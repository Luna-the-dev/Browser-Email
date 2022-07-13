const db = require('./db');

exports.getMailboxes = async (req, res) => {
  let mail = {};
  if (req.query.mailbox === undefined && req.query.from === undefined) {
    // get all mailboxes if there was no query
    mail = await db.selectMailboxes();
  } else if (req.query.from === undefined) {
    // get a single mailbox with the name of the query
    mail = await db.selectMailboxes(req.query.mailbox);
  } else {
    // get emails from a single user
    mail = await db.selectFromUser(req.query.from, req.query.mailbox);
  }

  if (mail !== undefined) {
    // returns list of mailboxes if query was valid
    return res.status(200).json(mail);
  } else {
    // throw an error if query did not match any mailboxes
    return res.status(400).send();
  }
};

exports.getStarredMail = async (req, res) => {
  const starredMail = await db.selectStarred();
  if (starredMail == undefined) {
    return res.status(400).send();
  } else {
    return res.status(200).send(starredMail);
  }
};

exports.getUnreadMail = async (req, res) => {
  const readMail = await db.selectUnread();
  if (readMail == undefined) {
    return res.status(400).send();
  } else {
    return res.status(200).send(readMail);
  }
}

exports.getMailboxNames = async (req, res) => {
  const mailboxes = await db.listMailboxes();
  if (mailboxes == undefined) {
    return res.status(400).send();
  } else {
    return res.status(200).send(mailboxes);
  }
};

exports.getById = async (req, res) => {
  const email = await db.selectEmail(req.params.id);
  if (email) {
    // return the email if it exists
    return res.status(200).json(email);
  } else {
    // return 404 if no email matches the id
    return res.status(404).send();
  }
};

exports.postNewEmail = async (req, res) => {
  const email = await db.insertEmail(req.body);
  return res.status(201).send(email);
};

exports.postNewMailbox = async (req, res) => {
  const mailbox = req.query.mailbox.toLowerCase();
  const mailboxAlreadyExists = await db.insertMailbox(mailbox);
  if (mailboxAlreadyExists) {
    // throw error if mailbox already exists
    return res.status(400).json();
  } else {
    // operation successful
    return res.status(201).send();
  }
};

exports.deleteMailbox = async (req, res) => {
  const mailbox = req.query.mailbox.toLowerCase();
  const mailboxExists = await db.moveMailboxToTrash(mailbox);
  if (mailboxExists === 'error 400') {
    // throw error if mailbox doesnt exist
    return res.status(400).json();
  } else if (mailboxExists === 'error 409') {
    // throw error if mailbox is a pre-defined one
    return res.status(409).json();
  } else {
    // operation successful
    return res.status(201).send();
  }
}

exports.moveEmail = async (req, res) => {
  const doesIdExist = await db.moveEmail(req.query.mailbox, req.params.id);

  // throwing an error if the id does not match an email
  if (doesIdExist === false) {
    return res.status(404).send();
  } else if (doesIdExist === undefined) {
    // throwing an error if user tries to move email into 'sent' mailbox
    return res.status(409).send();
  } else {
    return res.status(204).send();
  }
};

exports.setRead = async (req, res) => {
  const doesEmailExist = await db.setRead(req.params.id, req.query.isRead);

  // throwing an error if the id does not match an email
  if (doesEmailExist === false) {
    return res.status(404).send();
  } else {
    return res.status(204).send();
  }
};

exports.setStarred = async (req, res) => {
  const doesEmailExist = await db.setStarred(req.params.id, req.query.isStarred);

  // throwing an error if the id does not match an email
  if (doesEmailExist === false) {
    return res.status(404).send();
  } else {
    return res.status(204).send();
  }
};
