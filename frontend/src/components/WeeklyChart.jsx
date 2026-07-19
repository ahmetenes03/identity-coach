const DAY_FMT = new Intl.DateTimeFormat("tr-TR", { weekday: "short" });
const DATE_FMT = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" });

/**
 * Son 7 günün check-in'lerini gösteren yığılmış sütun grafiği.
 * Renkler tasarım token'larından gelir (indigo=yapıldı, amber=kaçırıldı;
 * CVD-güvenli, doğrulanmış çift). Kimlik yalnız renge bırakılmaz:
 * legend + hover tooltip + ekran okuyucu tablosu.
 */
function WeeklyChart({ days }) {
  if (!days?.length) return null;

  const maxTotal = Math.max(...days.map((d) => d.total), 1);
  const hasAny = days.some((d) => d.total > 0);

  return (
    <div className="weekly-chart">
      <div className="chart-header">
        <h3>Son 7 Gün</h3>
        <div className="chart-legend" aria-hidden="true">
          <span className="legend-item">
            <i className="legend-swatch done" /> Yapıldı
          </span>
          <span className="legend-item">
            <i className="legend-swatch missed" /> Kaçırıldı
          </span>
        </div>
      </div>

      {!hasAny ? (
        <p className="chart-empty">
          Bu hafta henüz check-in yok — ilk kaydını bugün oluştur.
        </p>
      ) : (
        <div className="chart-plot" aria-hidden="true">
          {days.map((day) => {
            const date = new Date(`${day.date}T00:00:00`);
            const doneH = (day.done / maxTotal) * 100;
            const missedH = (day.missed / maxTotal) * 100;
            return (
              <div className="chart-col" key={day.date}>
                <div className="chart-tip">
                  <strong>{DATE_FMT.format(date)}</strong>
                  <span>✅ {day.done} yapıldı</span>
                  <span>➖ {day.missed} kaçırıldı</span>
                </div>
                <div className="chart-stack">
                  {day.missed > 0 && (
                    <div
                      className="chart-seg missed"
                      style={{ height: `${missedH}%` }}
                    />
                  )}
                  {day.done > 0 && (
                    <div
                      className="chart-seg done"
                      style={{ height: `${doneH}%` }}
                    />
                  )}
                </div>
                <span className="chart-day">{DAY_FMT.format(date)}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Ekran okuyucular için veri tablosu */}
      <table className="sr-only">
        <caption>Son 7 günün check-in sayıları</caption>
        <thead>
          <tr>
            <th>Tarih</th>
            <th>Yapıldı</th>
            <th>Kaçırıldı</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day.date}>
              <td>{day.date}</td>
              <td>{day.done}</td>
              <td>{day.missed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WeeklyChart;
