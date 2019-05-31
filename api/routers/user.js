const express = require("express");
const router = express.Router();

const UserController = require('../controllers/user');
const {checkAuth} = require('../middleware/auth');

const User = require('../models/user');

router.get('/all', UserController.all);
router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.delete("/:userId", checkAuth, UserController.delete);

module.exports = router;
