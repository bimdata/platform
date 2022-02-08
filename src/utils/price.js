function getPrice(obj) {
  const { net, tax } = obj.price;
  let i = 0;
  while (Number.isNaN(+net.slice(i))) {
    i++;
  }
  return {
    currency: net.slice(0, i),
    price: +net.slice(i),
    tax: +tax.slice(i)
  };
}

export { getPrice };
