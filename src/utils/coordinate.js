/**
 * Coordinate systems:
 *   - DMS: Degrees Minutes Seconds, example: 48° 51' 30.24" N, 2° 17' 40.2" E
 *   - DD: Decimal Degrees, example: 48.8584° N, 2.2945° E
 */

/**
 * Convert an array of DMS coordinate values into DD system equivalent.
 *
 * @param {Array} param DMS coordinate
 * @returns {Number} DD coordinate
 */
function DMS2DD([degrees, minutes, seconds, secondsFraction]) {
  degrees = +degrees;
  minutes = +minutes;
  seconds = parseFloat(`${seconds}.${secondsFraction || 0}`);
  return degrees + minutes / 60 + seconds / 3600;
}

/**
 * Convert a DD coordinate value into DMS system equivalent.
 *
 * @param {Number} param DD coordinate
 * @returns {Array} DMS coordinate
 */
function DD2DMS(value) {
  value = +value;
  const degrees = Math.trunc(value);
  const minutes = Math.trunc(60 * Math.abs(value - degrees));
  const seconds = 3600 * Math.abs(value - degrees) - 60 * minutes;
  return [degrees, minutes, seconds];
}

/**
 * Get the DD coordinates of a given address using Open Street Map API.
 * The returned valu is an object with a "longitude" and "latitude" fields.
 * If no coordinates are found, "longitude" and "latitude" will be null.
 *
 * @param {String} address a postal address
 * @returns {Object} DD coordinates
 */
const getCoordinatesFromAddress = async address => {
  const formattedAddress = address.replace(/ /g, "+");
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${formattedAddress}&format=json&polygon=1&addressdetails=1`
  );
  const data = await response.json().then(json => json[0]);
  return {
    longitude: data ? +data.lon : null,
    latitude: data ? +data.lat : null
  };
};

export { DMS2DD, DD2DMS, getCoordinatesFromAddress };
