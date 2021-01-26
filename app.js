const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const sessions = require("client-sessions");
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");
const csurf = require("csurf");

const indexRouter = require("./routes/index");
const catalogRouter = require("./routes/catalog");
const userRouter = require("./routes/usersRouter");

// no usage
const wikiRouter = require("./routes/wiki");
const User = require("./models/user");

const app = express();

// Protect with HTTP headers
app.use(helmet());

// gzip/deflate Response
app.use(compression());

// setup cookie session (identify logged-in user for a duration)
app.use(sessions({
  cookieName: "session",
  secret: "woosafd32532wfsf",
  duration: 15 * 60 * 1000,
}));

// database connection setup

const username = "Uchiha";
const passwd = "ptM0qwc19W9HziXc";
const dev_DB_url = `mongodb+srv://${username}:${passwd}@cluster0.adbv3.mongodb.net/local_library?retryWrites=true&w=majority`;
const mongoDB = process.env.MONGODB_URI || dev_DB_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(csurf());
// place compression middleware here
app.use(express.static(path.join(__dirname, "public")));

// Smart Retrive User Middleware
app.use((req, res, next) => {
  // check if cookie session of userId sent to server
  // @ts-ignore
  if (!(req?.session.userId)) {
    return next(); // no cookie so go -> next resolver middleware
  }

  // cookie session exist
  // @ts-ignore
  User.findById(req.session.userId, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next();
    }

    user.password = undefined; // never pull password out of db

    // @ts-ignore
    req.user = user;
    res.locals.user = user;

    next();
  });
});

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/catalog", catalogRouter);

app.use("/wiki", wikiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
