const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');

const mail = require('./mail');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiSpec = path.join(__dirname, '../api/openapi.yaml');

const apidoc = yaml.safeLoad(fs.readFileSync(apiSpec, 'utf8'));
app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));

app.use(
    OpenApiValidator.middleware({
      apiSpec: apiSpec,
      validateRequests: true,
      validateResponses: true,
    }),
);

app.get('/v0/mail', mail.getMailboxes);
app.get('/v0/mail/starred', mail.getStarredMail);
app.get('/v0/mail/unread', mail.getUnreadMail);
app.get('/v0/mailboxes', mail.getMailboxNames);
app.get('/v0/mail/:id', mail.getById);
app.post('/v0/mail', mail.postNewEmail);
app.post('/v0/mailbox', mail.postNewMailbox);
app.put('/v0/mailbox', mail.deleteMailbox);
app.put('/v0/mail/:id', mail.moveEmail);
app.put('/v0/mail/read/:id', mail.setRead);
app.put('/v0/mail/starred/:id', mail.setStarred);


app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;
