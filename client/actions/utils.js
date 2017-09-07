/**
 * Formats small numbers example: 0.0000000001 number to 0.0000000001 string instead of the
 * usual JS conversion to 1e-9
 *
 * @param {Number} incomingOutput
 * @return {String}
 */
export const formatLargeNumber = (incomingOutput) => {
  if (!incomingOutput) return incomingOutput.toString();

  let output = incomingOutput;
  let n = Math.log(output) / Math.LN10;
  let decimalPoints = 0;
  let m = 10 ** decimalPoints;

  n = (n >= 0 ? Math.ceil(n * m) : Math.floor(n * m)) / m;

  let x = 0 - Math.ceil(n);
  if (x < 0) x = 0;

  return output.toFixed(x);
};

/**
 * Gets pixels row and column based on coors number ((y * 1000) + x)
 *
 * @param {Number} coors
 * @return {Object}
 */
export const getPixelRowAndColumn = (coors) => {
  let row;
  let column;

  if ((coors % 1000) > 0) {
    column = coors % 1000;
    row = (coors - column) / 1000;
  } else {
    column = coors / 1000;
    row = 0;
  }

  return { row: row + 1, column: column + 1 };
};

export const rgbaToHex = (rgb) => (
  (rgb && rgb.length === 4) ? '#' +
    ('0' + parseInt(rgb[0], 10).toString(16)).slice(-2) +
    ('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) +
    ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) : ''
);

export const hexToRgb = (hex) => {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: 255
  } : null;
};

function addition(a, b, accParam = '', carryParam = 0) {
  let carry = carryParam;
  let acc = accParam;

  if (!(a.length || b.length || carry)) return acc.replace(/^0+/, '');

  carry = carry + (~~a.pop() + ~~b.pop()); // eslint-disable-line
  acc = (carry % 10) + acc; // eslint-disable
  carry = carry > 9;

  return addition(a, b, acc, carry);
}

function sumStrings(a, b) {
  if (a === '0' && b === '0') return '0';
  return addition(a.split(''), b.split(''));
}

/**
 * Gets total of ETH from userPixels by adding pixel value strings
 *
 * @param {Array} userPixels
 * @return {String}
 */
export const getTotal = (userPixels) => {
  const total = userPixels.reduce((sum, pixel) => (
    sumStrings(sum, web3.toWei(pixel.amount))
  ), '');

  return web3.fromWei(total);
};
