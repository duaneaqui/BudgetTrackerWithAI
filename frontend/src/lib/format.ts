export const peso = (value = 0) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(value);

export const today = () => new Date().toISOString().slice(0, 10);

export const monthName = (month: number) =>
  new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(2026, month - 1, 1));
