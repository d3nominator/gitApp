// const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy; // Replace with your user model
const bcrypt = require("bcrypt");
const { User } = require("../Models/Users");


exports.initializingPassport = (passport) => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      console.log(username, password);
      const user = await User.findOne({ username: username }).exec();
      console.log(user);
      if (!user) return done(null, false, { message: "Incorrect username." });
      console.log(password, user.password);
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          return done(err, false, { message: "Incorrect password." });
        }
        if (!result) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      });
    })
  );

  // Serialize and deserialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  });
};

exports.ensureAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
  }
  res.redirect("/login");
};


exports.ensureNotAuthenticated = (req, res, next) => {
  if (req.user) {
    return res.redirect("/home");
  }
  next();
}
