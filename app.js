require("dotenv").config()
require("./data/connection/mongoose_connection");
const express = require("express");
const path = require("path");
const routes = require("./routes");

const app = express();
app.use(express.json());
app.post(function (req, res, next) {
    res.status(200).send(JSON.stringify(req.body));
});
app.use(express.urlencoded({ extended: true }));

const serverLog = function () {
    console.log(process.env.SERVER_RUNNING_MESSAGE, server.address().port);
}

const server = app.listen(process.env.EXPRESS_PORT, serverLog);
app.use(process.env.API_PREFIX, routes);
app.use(process.env.API_UPLOADS_PREFIX,express.static(path.join(__dirname, process.env.APP_STORAGE_FOLDER)));