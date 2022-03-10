const controller = require("../controllers/cost.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
    app.post(
        "/api/cost/create",
        [authJwt.verifyToken],
        controller.createCost
    );

    app.post(
        "/api/cost/update",
        [authJwt.verifyToken],
        controller.updateCost
    );

    app.get(
        "/api/cost/getCostsByUser",
        [authJwt.verifyToken],
        controller.getCostsByUser
    );

    app.delete(
        "/api/cost/delete/:id",
        [authJwt.verifyToken],
        controller.deleteCost
    );
}