export function dropdownPositioner(elRef, elToPos, yOffset = 0) {
  const { y: Y, height: H } = elRef.getBoundingClientRect();
  const { y, height: h } = elToPos.getBoundingClientRect();

  if (y + h > Y + H) {
    return `-${h + yOffset}px`;
  }

  return getComputedStyle(elToPos).getPropertyValue("top") || "0px";
}
