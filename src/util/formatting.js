export const currencyFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  minimumFractionDigits: 0, // Ensure no decimal places
  maximumFractionDigits: 0,
});
