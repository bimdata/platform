const tagStyle = {
  maxBoxWidth: 126 * 2,
  maxTagWidth: 58,
  fontSize: 10,
  paddingX: 5,
  gap: 3
};

const isTooWide = sumTagSize => tagStyle.maxBoxWidth < sumTagSize;

const tagDispatcher = (tagsWithSize, sumTagSize) => {
  let displayedArray = [];
  let hiddedArray = [];

  for (const tag of tagsWithSize.reverse()) {
    sumTagSize -= tag.size;

    if (isTooWide(sumTagSize)) {
      hiddedArray.push(tag);
    } else {
      displayedArray = tagsWithSize.slice(
        0,
        tagsWithSize.length - hiddedArray.length
      );
      break;
    }
  }
  return {
    displayedArray,
    hiddedArray
  };
};

const addSizeToTag = tags => {
  const sizeOfStyle = tagStyle.paddingX * 2 + tagStyle.gap;
  return tags.map(tag => {
    const size = tag.name.length * (tagStyle.fontSize / 2);
    return {
      ...tag,
      size:
        size < tagStyle.maxTagWidth
          ? size + sizeOfStyle
          : tagStyle.maxTagWidth + sizeOfStyle
    };
  });
};

export { isTooWide, addSizeToTag, tagDispatcher };
