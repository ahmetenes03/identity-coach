import asyncio
import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.database import SessionLocal
from app.routers import auth, check_ins, coach, habits, stats
from app.services import strategy_service

# Log dizini CWD'ye değil backend köküne sabitlenir; dosyaya yazılamayan
# ortamlarda (salt-okunur container vb.) uygulama yine de ayağa kalkar.
_BASE_DIR = Path(__file__).resolve().parents[1]
_handlers: list[logging.Handler] = [logging.StreamHandler()]
try:
    _log_dir = _BASE_DIR / "logs"
    _log_dir.mkdir(exist_ok=True)
    _handlers.append(logging.FileHandler(_log_dir / "app.log", encoding="utf-8"))
except OSError:  # pragma: no cover - depends on filesystem permissions
    pass

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=_handlers,
)
logger = logging.getLogger("identity_coach")


async def _seed_strategies_startup() -> None:
    try:
        with SessionLocal() as db:
            seeded = await strategy_service.ensure_seeded(db)
            if seeded:
                logger.info("Seeded %d coaching strategies", seeded)
    except Exception as exc:  # noqa: BLE001 - seeding must never block the API
        logger.warning("Strategy auto-seed skipped: %s", exc)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    logger.info("Identity Coach API starting up...")
    seed_task: asyncio.Task | None = None
    if get_settings().auto_seed_strategies:
        # Arka planda tohumla: gerçek embedding sağlayıcısı yavaşsa bile
        # /health ve auth uçları beklemeden açılır.
        seed_task = asyncio.create_task(_seed_strategies_startup())
    yield
    if seed_task and not seed_task.done():
        seed_task.cancel()
    logger.info("Identity Coach API shutting down...")


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title="Identity Coach API", version="0.2.0", lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth.router, prefix="/api")
    app.include_router(habits.router, prefix="/api")
    app.include_router(check_ins.router, prefix="/api")
    app.include_router(coach.router, prefix="/api")
    app.include_router(stats.router, prefix="/api")

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        import traceback

        # Ayrıntılar yalnızca sunucu loguna yazılır; istemciye iç bilgi
        # (SQL, bağlantı dizesi, dosya yolu) sızdırılmaz.
        logger.error(
            "Unhandled error on %s %s\n%s",
            request.method,
            request.url.path,
            traceback.format_exc(),
        )

        # Bu handler CORS middleware'inin DIŞINDA çalışır; header'ı elle
        # eklemezsek tarayıcı 500 gövdesini frontend'e hiç ulaştırmaz.
        headers = {}
        origin = request.headers.get("origin")
        if origin and origin in settings.cors_origin_list:
            headers = {"Access-Control-Allow-Origin": origin, "Vary": "Origin"}

        return JSONResponse(
            status_code=500,
            content={"detail": "Sunucu hatası oluştu. Lütfen tekrar deneyin."},
            headers=headers,
        )

    return app


app = create_app()
