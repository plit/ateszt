const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require('./api/routers/user');
const tableRoutes = require('./api/routers/table');

mongoose.connect(
    `mongodb+srv://plit:${process.env.MONGO_PW}@cluster0-ileg6.mongodb.net/ateszt`, {
        useNewUrlParser: true,
    }, (err) => {
        if (err) console.log(err);
        else console.log('Connected to DB');
    }
);
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use("/api/user", userRoutes);
app.use("/api/table", tableRoutes);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
