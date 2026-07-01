export function formatRelationshipDuration(since: Date): string {
  const days = Math.floor((Date.now() - since.getTime()) / (1000 * 60 * 60 * 24));
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);

  if (years > 0) {
    return `${years} year${years === 1 ? "" : "s"}${
      months > 0 ? `, ${months} month${months === 1 ? "" : "s"}` : ""
    } together`;
  }
  if (months > 0) {
    return `${months} month${months === 1 ? "" : "s"} together`;
  }
  return `${days} day${days === 1 ? "" : "s"} together`;
}

export function formatAnniversaryCountdown(anniversary: Date): string {
  const now = new Date();
  const next = new Date(anniversary);
  next.setFullYear(now.getFullYear());
  if (next.getTime() < now.setHours(0, 0, 0, 0)) {
    next.setFullYear(next.getFullYear() + 1);
  }

  const daysUntil = Math.ceil(
    (next.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  if (daysUntil === 0) return "Today's your anniversary 🎉";
  if (daysUntil === 1) return "Anniversary is tomorrow";
  return `${daysUntil} days until your anniversary`;
}