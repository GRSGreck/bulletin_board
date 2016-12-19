'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('../models/user');

passport.use(new LocalStrategy(
    function (username, password, cb) {
        UserModel.findOne({ email: username }, function (err, user) {
            if (err) return cb(err);
            if (!user) return cb(null, false, { message: 'Incorrect username.' });
            if (user.password !== password) return cb(null, false, { message: 'Incorrect password.' });

            return cb(null, user);
        })
    }
));