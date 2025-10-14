const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController');
const bossController = require('../controllers/bossController');
const bossServicesApiController = require('../controllers/bossServicesApiController');
const bossStaffApiController = require('../controllers/bossStaffApiController');
const bossClientApiController = require('../controllers/bossClientApiController');
const marketerController = require('../controllers/marketerController');
const marketerApiController = require('../controllers/marketerApiController');
const logoutController = require('../controllers/logoutController');
const checkIf = require('../middlewares/auth');
const verifyToken = require('../middlewares/jwtauth');
const { loginSanitizer, clientSanitizer, serviceSanitizer, staffSanitizer } = require("../validations/sanitizer");

let routes = app => {

    router.get('/', authController.index);
    router.post('/login', loginSanitizer, authController.login);
    
    //Boss
    router.get('/boss', checkIf.isBoss, bossController.home);
    router.get('/boss/home', checkIf.isBoss, bossController.homeIndex);
    router.get('/boss/clients', checkIf.isBoss, bossController.clients);
    router.get('/boss/pipelines', checkIf.isBoss, bossController.pipelines);
    router.get('/boss/services', checkIf.isBoss, bossController.services);
    router.get('/boss/team', checkIf.isBoss, bossController.team);

    //API-boss-service
    router.post('/api/boss/register/service', checkIf.isBoss, serviceSanitizer, bossServicesApiController.addService);
    router.get('/api/boss/edit/service/:id', checkIf.isBoss, bossServicesApiController.getService);
    router.post('/api/boss/service/update/:id', checkIf.isBoss, serviceSanitizer, bossServicesApiController.updateService);
    
    //API-boss-staff
    router.post('/api/boss/register/staff', checkIf.isBoss, staffSanitizer, bossStaffApiController.addStaff);
    router.get('/api/boss/edit/staff/:id', checkIf.isBoss, bossStaffApiController.getStaff);
    router.post('/api/boss/staff/update/:id', checkIf.isBoss, staffSanitizer, bossStaffApiController.updateStaff);
    router.post('/api/boss/block/staff/:id', checkIf.isBoss, bossStaffApiController.blockStaff);
    router.get('/api/boss/get/staff', checkIf.isBoss, bossStaffApiController.getMarketer);
    router.post('/api/boss/unblock/staff/:id', checkIf.isBoss, bossStaffApiController.unBlockStaff);


    //API-boss-client
    router.post('/api/boss/assign/client', checkIf.isBoss, clientSanitizer, bossClientApiController.assignStaff);

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