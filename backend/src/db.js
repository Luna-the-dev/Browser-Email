const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.selectMailboxes = async (mailbox) => {
  let select = 'SELECT * FROM mail';
  // filtering by mailbox if specified in query
  if (mailbox) {
    select += ` WHERE mailbox = $1`;
  }
  const query = {
    text: select,
    values: mailbox ? [`${mailbox}`] : [],
  };
  const {rows} = await pool.query(query);

  // returning undefined if no mailboxes matched the query
  if (rows.length == 0) {
    return undefined;
  }

  // formatting the emails the way the design spec specified
  return formatMailboxes(rows);
};

exports.selectStarred = async () => {
  let select = 'SELECT * FROM mail WHERE starred = true';
  const query = {
    text: select,
    values: [],
  }
  const {rows} = await pool.query(query);

  // returning undefined if no mailboxes matched the query
  if (rows.length == 0) {
    return undefined;
  }

  let starredEmails = [];
  // creating a map object with the mailbox names as keys
  // and objects filled with emails as the values
  for (const row of rows) {
    row.mail.id = row.id;
    row.mail.read = row.read;
    row.mail.starred = row.starred;
    if (row.avatar === null) {
      row.mail.from.avatar = 'foobar';
    } else {
      row.mail.from.avatar = row.avatar;
    }
    starredEmails.push(row.mail);
  }

  return starredEmails;
};

exports.selectUnread = async () => {
  let select = 'SELECT mailbox, read, starred FROM mail WHERE read = false';
  const query = {
    text: select,
    values: [],
  }
  const {rows} = await pool.query(query);

  // returning empty arr of object if there are no unread emails
  if (rows.length == 0) {
    return [{name: '', unread: 0}];
  }

  const mailboxes = new Map();
  mailboxes.set('starred', 0);

  // creating a map object with the mailbox names as keys
  // and objects filled with emails as the values
  for (const row of rows) {
    if (mailboxes.has(row.mailbox) == false) {
      mailboxes.set(row.mailbox, 1);
    } else {
      mailboxes.set(row.mailbox, mailboxes.get(row.mailbox) + 1);
    }

    if (row.starred) {
      mailboxes.set('starred', mailboxes.get('starred') + 1);
    }
  }

  // placing the map contents into an array of objects to meet design spec
  const mailboxesList = [];
  mailboxes.forEach((unread, key) => {
    mailboxesList.push({name: key, unread: unread});
  });

  return mailboxesList;
};

exports.listMailboxes = async () => {
  let select = 'SELECT mailbox FROM mail'
  const query = {
    text: select,
    values: [],
  }
  const {rows} = await pool.query(query);

  // returning undefined if there are no mailboxes
  if (rows.length == 0) {
    return undefined;
  }

  // taken from: https://dev.to/marinamosti/
  //          removing-duplicates-in-an-array-of-objects-in-js-with-sets-3fep
  const seen = new Set();
  const mailboxNames = rows.filter(el => {
    const duplicate = seen.has(el.mailbox);
    seen.add(el.mailbox);
    return !duplicate;
  });

  mailboxNames.map((row, i) => {
    mailboxNames[i] = row.mailbox;
  });

  return mailboxNames;
}

exports.selectEmail = async (id) => {
  const select = `SELECT * FROM mail WHERE id = $1`;
  const query = {
    text: select,
    values: [id],
  };

  // getting the email that matched the given id
  const {rows} = await pool.query(query);

  if (rows.length == 0) {
    return undefined;
  }

  const email = rows[0].mail;
  email.id = id;
  email.read = rows[0].read;
  email.starred = rows[0].starred;
  if (rows[0].avatar === null) {
    email.from.avatar = 'foobar';
  } else {
    email.from.avatar = rows[0].avatar;
  }

  return email;
};

exports.insertEmail = async (email) => {
  // getting the user's name and email address from the
  // emails already in the 'sent' mailbox
  const select = `SELECT mail FROM mail WHERE mailbox = 'sent'`;
  const querySel = {
    text: select,
    values: [],
  };
  const {rows} = await pool.query(querySel);
  const sentEmail = rows[0];

  // setting the user's name and email address for the email being posted
  email.from = {
    name: sentEmail.mail.from.name,
    email: sentEmail.mail.from.email,
  };

  // setting the date and time that the email is being sent
  const date = new Date();
  email.sent = date.toISOString().split('.')[0]+'Z';
  email.received = date.toISOString().split('.')[0]+'Z';

  const insert =
    `INSERT INTO mail(mailbox, read, starred, mail) ` +
    `VALUES ('sent', false, false, $1) RETURNING id`;
  const queryIns = {
    text: insert,
    values: [email],
  };

  // inserting the email into the table and setting the email's id
  // as the one that was generated by the insert
  result = await pool.query(queryIns);
  id = result.rows[0].id;
  email.id = id;

  return email;
};

exports.insertMailbox = async (mailbox) => {
  // returning error if the user tries creating a mailbox that already exists
  let select = `SELECT mailbox FROM mail WHERE mailbox = $1`;
  const query = {
    text: select,
    values: [mailbox],
  };
  const {rows: duplicateMailbox} = await pool.query(query);
  if (duplicateMailbox.length !== 0) {
    return true;
  }


  // getting the user's name and email address from the
  // emails already in the 'sent' mailbox
  select = `SELECT mail FROM mail WHERE mailbox = 'sent'`;
  const querySel = {
    text: select,
    values: [],
  };
  const {rows} = await pool.query(querySel);
  const sentEmail = rows[0];

  // setting the date and time that the email is being sent
  const date = new Date();

  const mail = {
    to: {
      name: sentEmail.mail.from.name,
      email: sentEmail.mail.from.email,
    },
    from: {
      name: 'Email Services',
      email: 'emailservices@email.com',
    },
    subject: 'How to navigate your new mailbox',
    content: `Welcome to your new mailbox!\n` +
      `To add emails to this mailbox, select an email and press the ` +
      `'Move to a Different Mailbox' button in the top-right corner.\n` +
      `You can also delete any mailbox by typing its name in the ` +
      `'Delete Mailbox' field, or by moving all emails into a different ` +
      `mailbox.`,
    sent: date.toISOString().split('.')[0]+'Z',
    received: date.toISOString().split('.')[0]+'Z',
  }

  const avatar = 'https://prosmartmailing.com/wp-content/' +
    'uploads/2016/09/Mail-Circle-Icon.png';

  const insert =
    `INSERT INTO mail(mailbox, read, starred, avatar, mail) ` +
    `VALUES ($1, false, false, $2, $3)`;
  const queryIns = {
    text: insert,
    values: [mailbox, avatar, mail],
  };

  // inserting the mailbox into the table
  await pool.query(queryIns);

  return false;
};

exports.moveMailboxToTrash = async (mailbox) => {
  // return error if user tries to delete static mailbox
  if (
    mailbox === 'inbox' ||
    mailbox === 'starred' ||
    mailbox === 'sent' ||
    mailbox === 'drafts' ||
    mailbox === 'trash'
  ) return 'error 409';

  // returning error if the user tries deleting a mailbox that doesn't exist
  let select = `SELECT mailbox FROM mail WHERE mailbox = $1`;
  let query = {
    text: select,
    values: [mailbox],
  };
  const {rows: duplicateMailbox} = await pool.query(query);

  // return error if mailbox doesn't exist
  if (duplicateMailbox.length === 0) {
    return 'error 400';
  }

  select = `UPDATE mail SET mailbox = 'trash' WHERE mailbox = $1`;
  query = {
    text: select,
    values: [mailbox],
  };
  await pool.query(query);

  return;
}

exports.moveEmail = async (mailbox, id) => {
  let select = '';
  let query = {};

  // return error code 409 if user tries to move an email into
  // the 'sent' mailbox that wasn't already there
  if (mailbox === 'sent') {
    select = `SELECT mailbox FROM mail WHERE id = $1`;
    query = {
      text: select,
      values: [id],
    };
    const {rows: previousMailbox} = await pool.query(query);
    if (previousMailbox[0].mailbox !== 'sent') {
      return undefined;
    }
  }

  select = `UPDATE mail SET mailbox = $1 WHERE id = $2 RETURNING mail`;
  query = {
    text: select,
    values: [mailbox, id],
  };

  const {rows} = await pool.query(query);

  if (rows.length == 0) {
    return false;
  } else {
    return true;
  }
};

exports.selectFromUser = async (from, mailbox) => {
  // checking to see if the mailbox exists
  if (mailbox !== undefined) {
    const selectMailbox = 'SELECT mailbox FROM mail WHERE mailbox = $1';
    const queryMailbox = {
      text: selectMailbox,
      values: [mailbox],
    };
    const {rows: mailboxes} = await pool.query(queryMailbox);
    // returning undefined if no mailboxes matched the query
    if (mailboxes.length == 0) {
      return undefined;
    }
  }

  // searching the database for emails from the specific user
  // if a mailbox is specified, only query emails from that inbox
  let select = `SELECT * FROM mail `;
  if (mailbox !== undefined) {
    select +=
      `WHERE mail->'from'->>'name' ~* $1 AND mailbox = $2 ` +
      `OR mail->'from'->>'email' ~* $1 AND mailbox = $2`;
  } else {
    select +=
    `WHERE mail->'from'->>'name' ~* $1 ` +
    `OR mail->'from'->>'email' ~* $1`;
  }
  const query = {
    text: select,
    values: mailbox ? [from, mailbox] : [from],
  };
  const {rows} = await pool.query(query);

  // formatting the emails the way the design spec specified
  return formatMailboxes(rows);
};

exports.setRead = async (id, isRead) => {
  const select =
    `UPDATE mail SET read = $2 WHERE id = $1 RETURNING mail`;
  query = {
    text: select,
    values: [id, isRead],
  };
  const {rows} = await pool.query(query);

  if (rows.length == 0) {
    return false;
  } else {
    return true;
  }
};

exports.setStarred = async (id, isStarred) => {
  const select =
    `UPDATE mail SET starred = $2 WHERE id = $1 RETURNING mail`;
  query = {
    text: select,
    values: [id, isStarred],
  };
  const {rows} = await pool.query(query);

  if (rows.length == 0) {
    return false;
  } else {
    return true;
  }
};

/**
 * function to format the row object returned from a postgresql query
 * @param {Object} rows an object of email data retrieved from the database
 * @return {Array} An array of objects formatted like the design spec specifies
 */
function formatMailboxes(rows) {
  const mailboxes = new Map();

  // creating a map object with the mailbox names as keys
  // and objects filled with emails as the values
  for (const row of rows) {
    row.mail.id = row.id;
    row.mail.read = row.read;
    row.mail.starred = row.starred;
    if (row.avatar === null) {
      row.mail.from.avatar = 'foobar';
    } else {
      row.mail.from.avatar = row.avatar;
    }
    if (mailboxes.has(row.mailbox) == false) {
      mailboxes.set(row.mailbox, [row.mail]);
    } else {
      mailboxes.get(row.mailbox).push(row.mail);
    }
  }

  // placing the map contents into an array of objects to meet design spec
  const mailboxesList = [];
  mailboxes.forEach((emails, key) => {
    mailboxesList.push({name: key, mail: emails});
  });

  return mailboxesList;
}

console.log(`Connected to database '${process.env.POSTGRES_DB}'`);
