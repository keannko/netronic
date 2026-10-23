export const getEfficiencyStyle = value => {
  if (value == null || !Number.isFinite(value)) return {};
  const hue = value <= 100 ? Math.max(0, Math.min(120, (value - 50) * 2.4)) : 120 + Math.min(100, value - 100) * 0.9;
  return { color: `hsl(${hue}, 65%, 27%)`, backgroundColor: `hsl(${hue}, 65%, 92%)` };
};