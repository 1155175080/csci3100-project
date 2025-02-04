const Auth = require("../controllers/Auth.controller");
const router = require("express").Router();
const { verifytoken } = require('../middlewares/authJWT');

module.exports = app => {
    router.post('/login', Auth.login);
    router.post('/logout', verifytoken, Auth.logout);
    router.post('/register', Auth.register);
    app.use('/api/auth', router);
};