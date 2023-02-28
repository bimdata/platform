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
  seconds = parseFloat(`${seconds}.${Math.abs(secondsFraction) || 0}`);
  return degrees + minutes / 60 + seconds / 3600;
}

/**
 * Convert a DD coordinate value into DMS system equivalent.
 *
 * @param {Number} param DD coordinate
 * @returns {Array} DMS coordinate
 */
function DD2DMS(latOrLong) {
  const result = new Array(3);
  result[0] = 0 | latOrLong;
  if (latOrLong < 0) {
    latOrLong *= -1;
  }
  result[1] = 0 | (((latOrLong += 1e-9) % 1) * 60)
  result[2] = (0 | (((latOrLong * 60) % 1) * 6000)) / 100
  return result;
}

/**
 * Get the DD coordinates of a given address using OpenStreetMapAPI.
 * The returned value is an object with a "longitude" and "latitude" fields.
 * If no coordinates are found, "longitude" and "latitude" will be undefined.
 *
 * @param {String} address a postal address
 * @returns {Object} DD coordinates
 */
const getCoordinatesFromAddress = async address => {
  const formattedAddress = address.replace(/ /g, "+");
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${formattedAddress}&format=json`
  );
  const data = await response.json().then(json => ({
    longitude: json[0] ? +json[0].lon : undefined,
    latitude: json[0] ? +json[0].lat : undefined
  }));
  return data;
};

/**
 * Given an address fragment (search text), get a list of address suggestions
 * (along with corresponding coordinates) from OpenStreetMap API.
 *
 * @param {String} searchText a postal address fragment
 * @returns {Array} a list of search results
 */
const getAdressesFromSearchText = async searchText => {
  const formattedSearchText = searchText.replace(/ /g, "+");
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${formattedSearchText}&format=json`
  );
  const data = await response.json().then(json =>
    json.map(result => ({
      longitude: +result.lon,
      latitude: +result.lat,
      address: result.display_name
    }))
  );
  return data;
};

export { DMS2DD, DD2DMS, getCoordinatesFromAddress, getAdressesFromSearchText };
