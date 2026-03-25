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


// ---

/**
 * The DMS_REGEX and parseDMS/parseDD utils function are extracted from "dms-conversion" package.
 * Source: https://github.com/WSDOT-GIS/dms-js
 */

// Matches DMS DmsCoordinates
const DMS_REGEX = /^(-?\d+(?:\.\d+)?)[°:d]?\s?(?:(\d+(?:\.\d+)?)['′ʹ:]?\s?(?:(\d+(?:\.\d+)?)["″ʺ]?)?)?\s?([NSEW])?/i;

const truncate = n => n > 0 ? Math.floor(n) : Math.ceil(n);

/**
 * Parses a Degrees Minutes Seconds string into a Decimal Degrees number.
 *
 * @param {string} dmsStr A string containing a coordinate in either DMS or DD format.
 * @return {Number} If dmsStr is a valid coordinate string, the value in decimal degrees will be returned. Otherwise NaN will be returned.
 */
function parseDMS(dmsStr) {
    let output = NaN;
    const dmsMatch = DMS_REGEX.exec(dmsStr);
    if (dmsMatch) {
        const degrees = Number(dmsMatch[1]);
        const minutes = typeof (dmsMatch[2]) !== "undefined" ? Number(dmsMatch[2]) / 60 : 0;
        const seconds = typeof (dmsMatch[3]) !== "undefined" ? Number(dmsMatch[3]) / 3600 : 0;
        const hemisphere = dmsMatch[4] || null;
        if (hemisphere !== null && /[SW]/i.test(hemisphere)) {
            output = -Math.abs(degrees) - minutes - seconds;
        }
        else {
            output = degrees + minutes + seconds;
        }
    }
    return output;
}

 /**
  * 
  * @param {Number} ddValue A number (coordinate) in decimal degrees
  * @param {String} type Either "latitude" or "longitude"
  * @returns {Array} DMS array
  */
function parseDD(ddValue, type) {
  const direction = type === "longitude"
    ? ddValue < 0 ? "W" : "E"
    : ddValue < 0 ? "S" : "N";
  const absDD = Math.abs(ddValue);
  const degrees = truncate(absDD);
  const minutes = truncate((absDD - degrees) * 60);
  const seconds = (absDD - degrees - minutes / 60) * Math.pow(60, 2);
  return [degrees, minutes, seconds, direction];
}

// ---


/**
 * Convert an array of DMS coordinate values into DD system equivalent.
 *
 * @param {Array} param DMS coordinate
 * @param {String} type either "latitude" or "longitude"
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
  return parseDMS(dmsString);
}

/**
 * Convert a DD coordinates value into DMS system equivalent.
 *
 * @param {Number} param latitude DD coordinate
 * @param {Number} param longitude DD coordinate
 * @returns {[Array, Array]} latitude and longitude DMS coordinate
 */
function DD2DMS(lat, long) {
  let [latD, latM, latS, latDir] = parseDD(lat, "latitude");
  if (latDir == "S") {
    latD *= -1;
    latM *= -1;
    latS *= -1;
  }

  let [longD, longM, longS, longDir] = parseDD(long, "longitude");
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
