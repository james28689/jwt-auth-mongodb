const { verifySignUp, authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );

        next();
    })

    app.post(
        "/api/auth/signup",
        [
            verifySignUp.checkDuplicateUsernameOrEmail,
        ],
        controller.signup
    );

    app.post("/api/auth/signin", controller.signin);

    app.post("/api/auth/refresh-token", controller.refreshAccessToken);

    app.post("/api/auth/change-email", [authJwt.verifyToken], controller.changeEmail);

    app.post("/api/auth/change-password", [authJwt.verifyToken], controller.changePassword);

    app.post("/api/auth/change-onboard", [authJwt.verifyToken], controller.changeOnboard);

    app.get("/api/auth/user-data", [authJwt.verifyToken], controller.getUserData);
};