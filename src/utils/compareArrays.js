function compareArrays(array1, array2) {
  // First, check the length of both arrays
  // if length is not equal then arrays are different
  if (array1.length != array2.length) {
    return "False";
  } else {
    // check every element of the two arrays
    for (var i = 0; i < array1.length; i++) {
      if (array1[i] != array2[i]) {
        return "False";
      }

      return "True";
    }
  }
}

export { compareArrays };
