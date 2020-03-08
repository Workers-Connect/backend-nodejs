const express = require('express');
const app = express();

app.use(require('./users/users'));
app.use(require('./users/login'));
app.use(require('./company/company'));

module.exports = app;