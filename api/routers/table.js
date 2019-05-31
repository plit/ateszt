const express = require("express");
const router = express.Router();

const TableController = require('../controllers/table');
const {checkAuth} = require('../middleware/auth');

router.all("/:tableName/:id?", checkAuth, TableController.call);

module.exports = router;
