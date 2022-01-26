require('express-group-routes');
const router = require('express').Router();
const multer = require('multer');

const authMiddleware = require('../app/middlewares/auth');
const { uploadImageConfig } = require('../config/multer');

const authController = require('../app/controllers/AuthController');


router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/recover-pass', authController.recoverPass)

router.group('/auth', (router) => {
    router.use(authMiddleware,);
    // router.post('/create-serial-killers', multer(uploadImageConfig).single('file'), serialKillerController.createSerialKiller)
})

module.exports = router;
