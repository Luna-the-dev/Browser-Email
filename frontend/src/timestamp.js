/**
 * Convert ISO 8601 string into timestamp displayed by the app.
 * @param {String} date ISO 8601 string of date that the email was received
 * @return {String} The timestamp shown of when the email was received
 */
function timeStamp(date) {
  const received = new Date(date);
  const today = new Date();
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  if (datesAreOnSameDay(received, today)) {
    return (
      (received.getHours() < 10 ? '0' : '' ) + received.getHours() +
      ':' +
      (received.getMinutes() < 10 ? '0' : '' ) + received.getMinutes()
    );
  } else if (receivedIsOneDayBeforeToday(received, today)) {
    return 'Yesterday';
  } else if (received.getFullYear() === today.getFullYear()) {
    return (
      monthNames[received.getMonth()] +
      ' ' +
      (received.getDate() < 10 ? '0' : '' ) + received.getDate()
    );
  } else {
    return received.getFullYear();
  }
}

/**
 * this function was taken from:
 * https://flaviocopes.com/how-to-check-dates-same-day-javascript/
 * @param {Object} first date object to compare
 * @param {Object} second date object to compare
 * @return {Boolean} returns true if the two dates are the same
 */
const datesAreOnSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

/**
 * this function was taken from:
 * https://flaviocopes.com/how-to-check-dates-same-day-javascript/
 * @param {Object} first date object to compare
 * @param {Object} second date object to compare
 * @return {Boolean} returns true if the two dates are the same
 */
const receivedIsOneDayBeforeToday = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === (second.getDate() - 1);

export default timeStamp;
