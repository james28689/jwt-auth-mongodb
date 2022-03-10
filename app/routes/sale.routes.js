const controller = require("../controllers/sale.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
    app.post(
        "/api/sale/create",
        [authJwt.verifyToken],
        controller.createSale
    );

    app.post(
        "/api/sale/update",
        [authJwt.verifyToken],
        controller.updateSale
    );

    app.get(
        "/api/sale/getSalesByUser",
        [authJwt.verifyToken],
        controller.getSalesByUser
    );

    app.delete(
        "/api/sale/delete/:id",
        [authJwt.verifyToken],
        controller.deleteSale
    );
}