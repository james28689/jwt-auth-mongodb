const controller = require("../controllers/stock.controller");
const { authJwt } = require("../middleware");

module.exports = function(app) {
    app.post(
        "/api/stock/create",
        [authJwt.verifyToken],
        controller.createStock
    );

    app.post(
        "/api/stock/update",
        [authJwt.verifyToken],
        controller.updateStock
    );

    app.get(
        "/api/stock/getStockByUser",
        [authJwt.verifyToken],
        controller.getStockByUser
    );

    app.post(
        "/api/stock/create-order",
        [authJwt.verifyToken],
        controller.createOrder
    );

    app.delete(
        "/api/stock/delete/:id",
        [authJwt.verifyToken],
        controller.deleteStock
    )
}