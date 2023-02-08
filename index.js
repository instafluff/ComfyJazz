"use strict";

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8901;

app.use('/web', express.static(path.join(__dirname, '/web')));
app.use((req, res) => res.sendFile('/index.html', {root: __dirname}))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
