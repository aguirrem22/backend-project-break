require('dotenv').config();
const express = require("express");
const session = require('express-session');
const path = require('path');
const cors = require("cors");
const methodOverride = require("method-override");

const app = express();
const PORT = process.env.PORT || 8080;
const SESSION_SECRET = process.env.SESSION_SECRET || 'secret-key';
const connectDB = require("./config/db.js");
const productRouter = require("./routes/productRoutes.js");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));
app.use(session({secret: SESSION_SECRET, resave: false, saveUninitialized: false}));

app.use("/", productRouter);

if (process.env.NODE_ENV !== "test") {
	connectDB();
	app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}

module.exports = app;