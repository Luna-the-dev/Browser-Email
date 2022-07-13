/**
 * Sort an array of emails by their date.
 * .sort algorithm taken from: https://stackoverflow.com/a/52583894
 * @param {Array} emails unsorted array of email objects
 * @return {Array} the original array sorted by date and filtered by trash/inbox
 */
function sortEmails(emails) {
  return emails.sort((a, b) => -a.received.localeCompare(b.received));
}

export default sortEmails;
