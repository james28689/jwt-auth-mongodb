const controller = require("../controllers/usage.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
    app.post(
        "/api/usage/create",
        [authJwt.verifyToken],
        controller.createUsage
    );

    app.post(
        "/api/usage/update",
        [authJwt.verifyToken],
        controller.updateUsage
    );

    app.get(
        "/api/usage/getUsagesByUser",
        [authJwt.verifyToken],
        controller.getUsagesByUser
    );

    app.delete(
        "/api/usage/delete/:id",
        [authJwt.verifyToken],
        controller.deleteUsage
    );

    app.delete(
        "/api/usage/delete-all",
        [authJwt.verifyToken],
        controller.deleteAllUsagesByUser
    );
}