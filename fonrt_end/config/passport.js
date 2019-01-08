const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const db = require('../server/data');
const User = db.Member;
const constants = require('./constants');

module.exports = function(passport){
    let opts={};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = constants.secret;
    passport.use(new JwtStrategy(opts,(jwt_payload,done) => {
        // console.log("strategy time");
        // console.log(jwt_payload);
        User.getUserById(jwt_payload.data._id, (err,user) => {
            if(err) return done(err,false);
            if(user){
                return done(null,user);
            }else{
                return done(null,false);
            }
        })
    }))
}
