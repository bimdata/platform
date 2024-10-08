function isFullTotal(spaceSubInfo) {
  return (
    spaceSubInfo.remaining_total_size != null &&
    spaceSubInfo.remaining_total_size <= 0
  );
}

function sortSpaces(spaces) {
  return spaces.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export { isFullTotal, sortSpaces };
