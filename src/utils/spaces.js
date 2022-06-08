function isFull(spaceSubInfo) {
  return (
    spaceSubInfo.remainingSmartDataSize != null &&
    spaceSubInfo.remainingSmartDataSize <= 0
  );
}

function isFullTotal(spaceSubInfo) {
  return (
    spaceSubInfo.remainingTotalSize != null &&
    spaceSubInfo.remainingTotalSize <= 0
  );
}

export { isFull, isFullTotal };
