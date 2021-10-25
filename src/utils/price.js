function getPrice(obj) {
  const grossPrice = obj.price.gross;
  let i = 0;
  while (Number.isNaN(+grossPrice.slice(i))) {
    i++;
  }
  return {
    price: +grossPrice.slice(i),
    currency: grossPrice.slice(0, i)
  };
}

export { getPrice };
