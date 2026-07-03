from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, check_ins, habits


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    # Database schema is managed by Alembic migrations.
    yield


def create_app() -> FastAPI:
    app = FastAPI(title="Identity Coach API", version="0.1.0", lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth.router, prefix="/api")
    app.include_router(habits.router, prefix="/api")
    app.include_router(check_ins.router, prefix="/api")

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()
