/**
 * Coordinate systems:
 *   - DMS: Degrees Minutes Seconds, example: 48° 51' 30.24" N, 2° 17' 40.2" E
 *   - DD: Decimal Degrees, example: 48.8584° N, 2.2945° E
 *
 * IFC uses a sightly different format for DD and DMS:
 *   DMS is an array of 3 in IFC2x3 or 3 to 4 in IFC 4+. The first element is the degrees, the second is the minutes the third is the seconds, the fourth is the number of millionth-seconds.
 *   When the direction is West or South, all components are negative. When direction is East or North, all components are positive.
 *
 *  DD is negative if South or West
 */

import DmsCoordinates, { parseDms } from "dms-conversion";


/**
 * Convert an array of DMS coordinate values into DD system equivalent.
 *
 * @param {Array} param DMS coordinate
 * @param {String} param either latitude or longitude
 * @returns {Number} DD coordinate
 */
function DMS2DD([degrees, minutes, seconds, secondsFraction = 0], type) {
  degrees = +degrees;
  minutes = +minutes;
  seconds = +seconds;
  secondsFraction = +secondsFraction;

  // rétro compatibility because we used to save invalid values before 28/08/2024
  if (degrees < 0 && minutes > 0 && seconds > 0) {
      minutes *= -1;
      seconds *= -1;
      secondsFraction *= -1;
  }

  let direction = type === "latitude" ? "N": "E";
  // if degrees === 0, we lose the -0 if any. We need to check if minutes and seconds are negative
  if (degrees < 0 || (degrees === 0 && minutes <= 0 && seconds <= 0)) {
    direction = type === "latitude" ? "S": "W";
    degrees *= -1;
    minutes *= -1;
    seconds *= -1;
    secondsFraction *= -1;
  }
  seconds += secondsFraction/1000000;
  const dmsString = `${degrees}°${minutes}′${seconds}″ ${direction}`;
  return parseDms(dmsString);
}

/**
 * Convert a DD coordinates value into DMS system equivalent.
 *
 * @param {Number} param latitude DD coordinate
 * @param {Number} param longitude DD coordinate
 * @returns {[Array, Array]} latitude and longitude DMS coordinate
 */
function DD2DMS(lat, long) {
  const dmsCoords = new DmsCoordinates(lat, long);
  const { longitude, latitude } = dmsCoords.dmsArrays;
  let [latD, latM, latS, latDir] = latitude;
  if (latDir == "S") {
    latD *= -1;
    latM *= -1;
    latS *= -1;
  }

  let [longD, longM, longS, longDir] = longitude;
  if (longDir == "W") {
    longD *= -1;
    longM *= -1;
    longS *= -1;
  }

  const latDMS = [latD, latM, latS];
  const longDMS = [longD, longM, longS];

  return [latDMS, longDMS];
}

const MAP_TILER_TOKEN = ENV.VUE_APP_MAPTILER_TOKEN;

/**
 * Get the DD coordinates of a given address using OpenStreetMapAPI.
 * The returned value is an object with a "longitude" and "latitude" fields.
 * If no coordinates are found, "longitude" and "latitude" will be null.
 *
 * @param {String} address a postal address
 * @returns {Object} DD coordinates
 */
const getCoordinatesFromAddress = async address => {
  const response = await fetch(
    `https://api.maptiler.com/geocoding/${address}.json?key=${MAP_TILER_TOKEN}&types=poi&excludeTypes=true`
  );
  const data = await response.json();
  const bestResult = data.features[0];
  return {
    longitude: bestResult?.geometry.coordinates[0],
    latitude: bestResult?.geometry.coordinates[1]
  };
};

/**
 * Given an address fragment (search text), get a list of address suggestions
 * (along with corresponding coordinates) from OpenStreetMap API.
 *
 * @param {String} searchText a postal address fragment
 * @returns {Array} a list of search results
 */
const getAdressesFromSearchText = async searchText => {
  const response = await fetch(
    `https://api.maptiler.com/geocoding/${searchText}.json?key=${MAP_TILER_TOKEN}&types=poi&excludeTypes=true`
  );
  const data = await response.json();
  return data.features.map(result => ({
    longitude: result.geometry.coordinates[0],
    latitude: result.geometry.coordinates[1],
    address: result.place_name,
  }));
};

export { DMS2DD, DD2DMS, getCoordinatesFromAddress, getAdressesFromSearchText };
