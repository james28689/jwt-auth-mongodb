const controller = require("../controllers/field.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
    app.post(
        "/api/field/create",
        [authJwt.verifyToken],
        controller.addField
    );

    app.post(
        "/api/field/getFieldByUser",
        [authJwt.verifyToken],
        controller.getFieldByUser
    );
}