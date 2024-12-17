export const formatPrice = (amount: number, currency: string) => {
  const { format } = new Intl.NumberFormat("en-UK", {
    currency,
    style: "currency",
    currencySign: "accounting",

  });

  return format(amount);
};
