// Yerel saat diliminde YYYY-MM-DD üretir.
// (toISOString UTC'ye kayar; gece 00:00-03:00 arası yanlış günü verir.)
export const todayLocal = () => new Date().toLocaleDateString("en-CA");
