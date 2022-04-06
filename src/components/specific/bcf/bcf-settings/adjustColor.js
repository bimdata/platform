function adjustBorderColor(color, amount) {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, color =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  );
}

// https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
// https://www.w3.org/TR/AERT/#color-contrast
function adjustColor(bgColor, lightTextColor, darkTextColor) {
  const color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
  // hex to R
  const r = parseInt(color.substring(0, 2), 16);
  // hex to G
  const g = parseInt(color.substring(2, 4), 16);
  // hex to B
  const b = parseInt(color.substring(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 186
    ? darkTextColor
    : lightTextColor;
}

export { adjustBorderColor, adjustColor };
