import dotenv from "dotenv";
dotenv.config();
/* eslint-disable no-undef */
import passport from "passport";
import GoogleStrategy from "passport-google-oidc";
import { googleAuthenticationService } from "./googleAuthenticationService.js";
import debug from "debug";

/*
IT is incredible all the things that I had to do to make this work.
Dynamic imports werent working.
*/

if (process.env.npm_lifecycle_event === "test") {
  console.error("TEST ENVIROMENT, USSING PASSPORT MOCK");
  console.log("TEST ENVIROMENT, USSING PASSPORT MOCK");
}


let PassportService = {
  f : passport
}

if (process.env.npm_lifecycle_event === "test") {
  const passportMock = {
    currentUser: {},

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //callbackFunction: function (req: any, res: any, next: any): void {
    callbackFunction: function (req, res, next) {      
      console.log(req, res, next);
    },

    //authenticate : function (s : string, o : any, f : (err : any, user: any, info: any, status: any) => void ) : (req : any, res: any, next: any) => void {
    authenticate: function (s, o, f) {
      console.log(s, o, f);
      return this.callbackFunction;
    },
  };
  PassportService.f = passportMock;
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env["GOOGLE_CLIENT_ID"],
        clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
        callbackURL: "/oauth2/redirect/google",
        scope: ["profile"],
      },
      googleAuthenticationService.processCredentials
    )
  );

  passport.serializeUser(function (user, cb) {
    debug("passport.serializeUser", user);
    process.nextTick(function () {
      cb(null, { id: user.id, username: user.username, name: user.name });
    });
  });

  passport.deserializeUser(function (user, cb) {
    debug("passport.deserializeUser", user);
    process.nextTick(function () {
      return cb(null, user);
    });
  });

  PassportService.f = passport;
}

export { PassportService };
