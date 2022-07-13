/**
 * Adjusts the num of unread emails when a user stars/unstars an email
 * @param {Boolean} starred true if the email was starred, false otherwise
 * @param {Array} mailboxesListUnread react hook containing # of unread emails
 * @param {Function} setMailboxesListUnread set react hook
 */
export function adjustUnreadStarred(
    starred,
    mailboxesListUnread,
    setMailboxesListUnread,
) {
  const tempArr = [...mailboxesListUnread];
  // adjust the starred mailbox whether the email is being starred or unstarred
  if (starred) {
    tempArr[tempArr.length - 1] += 1;
  } else {
    tempArr[tempArr.length - 1] -= 1;
  }
  setMailboxesListUnread(tempArr);
  return;
}
