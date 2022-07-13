import axios from 'axios';
import sortEmails from './sortEmails.js';

/**
 * Simple component with no state.
 * @param {String} mailboxName name of the mailbox to get
 * @param {Function} setMailbox function to set the react hook for the mailbox
 * @param {Function} setIsMailboxEmpty set the react hook for empty mailbox
 */
export function getMailbox(mailboxName, setMailbox, setIsMailboxEmpty) {
  if (mailboxName === 'starred') {
    getStarredEmails(setMailbox);
  } else {
    axios.get('http://localhost:3010/v0/mail?mailbox=' + mailboxName)
        .then((res) => {
          setMailbox(sortEmails(res.data[0].mail));
          setIsMailboxEmpty(false);
          return;
        })
        .catch((error) => {
          console.log(error + '\nThis is handled by the program.');
          setIsMailboxEmpty(true);
          return;
        });
  }
}

/**
 * Simple component with no state.
 * @param {String} emailId id of the email to view
 * @param {Function} setCurrEmail set the react hook for the email being viewed
 * @param {String} mailboxName name of the mailbox that the email is in
 */
export function getEmail(emailId, setCurrEmail, mailboxName) {
  axios.get('http://localhost:3010/v0/mail/' + emailId)
      .then((res) => {
        const currEmail = res.data;
        currEmail.mailbox = mailboxName;
        setCurrEmail(currEmail);
        return;
      })
      .catch((error) => {
        console.log(error);
        console.log('Email does not exist');
        return;
      });
}

/**
 * Simple component with no state.
 * @param {String} id id of the email to view
 * @param {Function} newMailbox set the react hook for the email being viewed
 */
export function moveEmail(id, newMailbox) {
  axios.put('http://localhost:3010/v0/mail/' + id + '?mailbox=' + newMailbox)
      .then((res) => {
        return;
      })
      .catch((error) => {
        console.log(error);
        return;
      });
}

/**
 * Simple component with no state.
 * @param {Function} setMailboxesList set react hook for the mailboxesNames
 */
export function getMailboxNames(setMailboxesList) {
  axios.get('http://localhost:3010/v0/mailboxes')
      .then((res) => {
        const mailboxesList = [];
        mailboxesList.push('inbox');
        mailboxesList.push('sent');
        mailboxesList.push('drafts');
        mailboxesList.push('trash');

        const tempArr = [];
        res.data.forEach((mailbox) => {
          if (
            mailbox !== 'inbox' &&
            mailbox !== 'sent' &&
            mailbox !== 'drafts' &&
            mailbox !== 'trash'
          ) {
            tempArr.push(mailbox);
          }
        });
        tempArr.sort();
        for (let i = 0; i < tempArr.length; i++) {
          mailboxesList.push(tempArr[i]);
        }

        setMailboxesList(mailboxesList);
        return;
      })
      .catch((error) => {
        console.log(error);
        return;
      });
}

/**
 * Simple component with no state.
 * @param {Array} mailboxesList react hook array of mailbox names
 * @param {Function} setMailboxesListUnread set react hook
 */
export function getUnreadEmails(mailboxesList, setMailboxesListUnread) {
  axios.get('http://localhost:3010/v0/mail/unread')
      .then((res) => {
        const mailboxesListUnread = [];
        const resArr = [...res.data];
        resArr.splice(0, 1);
        let mailbox = {};

        for (let i = 0; i < mailboxesList.length; i++) {
          mailbox = resArr.find((mailbox) => mailbox.name === mailboxesList[i]);
          if (mailbox !== undefined) {
            mailboxesListUnread[i] = mailbox.unread;
          } else {
            mailboxesListUnread[i] = 0;
          }
        }
        mailboxesListUnread.push(res.data[0].unread);

        setMailboxesListUnread(mailboxesListUnread);
        return;
      })
      .catch((error) => {
        console.log(error);
        return;
      });
}

/**
 * Simple component with no state.
 * @param {Function} setMailbox function to set the react hook for the mailbox
 */
function getStarredEmails(setMailbox) {
  axios.get('http://localhost:3010/v0/mail/starred')
      .then((res) => {
        setMailbox(sortEmails(res.data));
        return;
      })
      .catch((error) => {
        console.log(error);
        return;
      });
}

/**
 * sets the 'starred' value of an email
 * @param {String} id id of the email to set the starred
 * @param {Boolean} setStarred setting the email to be starred/unstarred
 */
export function setStarred(id, setStarred) {
  axios.put('http://localhost:3010/v0/mail/starred/'+ id +
    '?isStarred=' + setStarred.toString())
      .then((res) => {
        return;
      })
      .catch((error) => {
        return;
      });
}

/**
 * sets the 'read' value of an email
 * @param {String} id id of the email to set the starred
 * @param {Boolean} setRead setting the email to be read/unread
 */
export function setRead(id, setRead) {
  axios.put('http://localhost:3010/v0/mail/read/'+ id +
    '?isRead=' + setRead.toString())
      .then((res) => {
        return;
      })
      .catch((error) => {
        return;
      });
}

/**
 * creates a new mailbox
 * @param {String} mailbox name of the new mailbox
 * @param {Array} mailboxesList react hook array of mailbox names
 * @param {Function} setMailboxesList sets mailboxesList
 */
export function createNewMailbox(mailbox, mailboxesList, setMailboxesList) {
  axios.post('http://localhost:3010/v0/mailbox?mailbox=' + mailbox)
      .then((res) => {
        const tempMailboxesList = [...mailboxesList];
        const staticMailboxes =
          tempMailboxesList.splice(0, tempMailboxesList.indexOf('trash') + 1);
        tempMailboxesList.push(mailbox);
        tempMailboxesList.sort();
        const newMailboxesList = staticMailboxes.concat(tempMailboxesList);
        setMailboxesList(newMailboxesList);
        return;
      })
      .catch((error) => {
        console.log(error);
        console.log('Mailbox already exists.');
        return;
      });
}

/**
 * deletes a non-static mailbox
 * @param {String} mailbox name of the mailbox being deleted
 * @param {Array} mailboxesList react hook array of mailbox names
 * @param {Function} setMailboxesList sets mailboxesList
 */
export function deleteMailbox(mailbox, mailboxesList, setMailboxesList) {
  axios.put('http://localhost:3010/v0/mailbox?mailbox=' + mailbox)
      .then((res) => {
        const newMailboxesList = [...mailboxesList];
        const index = newMailboxesList.indexOf(mailbox);
        newMailboxesList.splice(index, 1);
        setMailboxesList(newMailboxesList);
        return;
      })
      .catch((error) => {
        console.log(error);
        console.log('Mailbox doesnt exist.');
        return;
      });
}
