/**
 * Will generate a random number of specific length
 * e.g. if length is 4 it will give a number between 1000 to 9999 (inclusive)
 * @param {number} length - length of the generated numbers
 * @returns {number}
 */
export const generateRandomNumber = (length) => {
  // This function will ignore numbers less than the min value
  const min = Math.pow(10, length - 1)
  const max = min * 9
  return Math.floor(min + Math.random() * max)
}
