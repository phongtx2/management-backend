const express = require("express");

const app = express();

app.use("/auth", require("./auth"));
app.use("/categories", require("./categories"));
app.use("/books", require("./books"));

module.exports = app;
