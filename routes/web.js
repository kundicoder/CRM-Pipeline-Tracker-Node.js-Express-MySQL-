const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController');
const bossController = require('../controllers/bossController');
const bossServicesApiController = require('../controllers/bossServicesApiController');
const marketerController = require('../controllers/marketerController');
const marketerApiController = require('../controllers/marketerApiController');
const logoutController = require('../controllers/logoutController');
const checkIf = require('../middlewares/auth');
const verifyToken = require('../middlewares/jwtauth');
const {loginSanitizer, clientSanitizer, serviceSanitizer } = require("../validations/sanitizer");

let routes = app => {

    router.get('/', authController.index);
    router.post('/login', loginSanitizer, authController.login);
    
    //Boss
    router.get('/boss', checkIf.isBoss, bossController.home);
    router.get('/boss/home', checkIf.isBoss, bossController.homeIndex);
    router.get('/boss/clients', checkIf.isBoss, bossController.clients);
    router.get('/boss/services', checkIf.isBoss, bossController.services);

    //API-boss
    router.post('/api/boss/register/service', checkIf.isBoss, serviceSanitizer, bossServicesApiController.addService);
    router.get('/api/boss/edit/service/:id', checkIf.isBoss, bossServicesApiController.getService);
    router.post('/api/boss/service/update/:id', checkIf.isBoss, serviceSanitizer, bossServicesApiController.updateService);

    //Marketer
    router.get('/marketer', checkIf.isMarketer, marketerController.home);
    router.get('/marketer/home', checkIf.isMarketer, marketerController.homeIndex);
    router.get('/marketer/pipelines', checkIf.isMarketer, marketerController.pipelines);
    router.get('/marketer/clients', checkIf.isMarketer, marketerController.clients);
    router.get('/marketer/reports', checkIf.isMarketer, marketerController.reports);

    //API - Marketer
    router.post('/api/marketer/register/client', checkIf.isMarketer, clientSanitizer, marketerApiController.addClient);
    router.get('/api/marketer/edit/client/:id', checkIf.isMarketer, marketerApiController.getClient);
    router.post('/api/marketer/client/update/:id', checkIf.isMarketer, clientSanitizer, marketerApiController.updateClient);

    router.post('/logout', logoutController.logout);

    return app.use("/", router);

};

module.exports = routes;