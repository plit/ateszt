const express = require("express");
const router = express.Router();

const TableController = require('../controllers/table');


router.all("/:tableName/:id?/:action?", async (req, res, next) => {
    try {
        const tableController = new TableController(req);
        const data = await tableController.processRequires();
        const status = (data && data.statusCode) || 200;
        res.status(status).json(data.response);
    } catch (err) {
        console.log(err);
        const statusCode = (err && err.statusCode) || 500;
        res.status(statusCode).json({
            error: err.message,
        });
    }
});

module.exports = router;
