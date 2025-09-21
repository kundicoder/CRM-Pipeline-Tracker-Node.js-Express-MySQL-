const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');
const logoutController = require('../controllers/logoutController');
const checkIf = require('../middlewares/auth');
const verifyToken = require('../middlewares/jwtauth');
const {loginSanitizer } = require("../validations/sanitizer");

let routes = app => {

    router.get('/', authController.index);
    router.post('/login', loginSanitizer, authController.login);
    router.get('/admin', checkIf.isAdmin, adminController.home);
    router.get('/admin/home', checkIf.isAdmin, adminController.homeIndex);
    router.get('/user/home', checkIf.isUser, userController.homeIndex);
    router.get('/user', checkIf.isUser, userController.home);

    router.post('/logout', logoutController.logout);

    return app.use("/", router);

};

module.exports = routes;