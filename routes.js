const express = require("express");

const routes = express.Router();
const teamController = require("./controllers/team.controller");
const playerController = require("./controllers/player.controller");
const upload = require("./storage").upload;

routes.route(process.env.API_ALL_PRODUCT)
    .get(teamController.getAll)
routes.post(process.env.API_ALL_TEAM,
    upload.single(process.env.TEAM_SCHEMA_FILE_FIELD_NAME),
    teamController.addOne);


routes.route(process.env.API_ONE_PRODUCT)
    .get(teamController.getOne)
    .delete(teamController.deleteOne);

routes.put(process.env.API_ONE_TEAM,
    upload.single(process.env.TEAM_SCHEMA_FILE_FIELD_NAME),
    teamController.fullUpdateOne);
routes.patch(process.env.API_ONE_TEAM,
    upload.single(process.env.TEAM_SCHEMA_FILE_FIELD_NAME),
    teamController.partialUpdateOne);

routes.route(process.env.API_ALL_REVIEW_OF_PRODUCT)
    .get(playerController.getAll)
    .post(playerController.addOne);

routes.route(process.env.API_ONE_REVIEW_OF_PRODUCT)
    .get(playerController.getOne)
    .put(playerController.fullUpdateOne)
    .patch(playerController.partialUpdateOne)
    .delete(playerController.deleteOne);


module.exports = routes;
