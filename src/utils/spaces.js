function isFullSmartData(spaceSubInfo) {
  return (
    spaceSubInfo.remaining_smart_data_size != null &&
    spaceSubInfo.remaining_smart_data_size <= 0
  );
}

function isFullTotal(spaceSubInfo) {
  return (
    spaceSubInfo.remaining_total_size != null &&
    spaceSubInfo.remaining_total_size <= 0
  );
}

export { isFullSmartData, isFullTotal };
