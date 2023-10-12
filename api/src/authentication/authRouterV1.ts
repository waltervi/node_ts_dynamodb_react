import express from "express";
import { expressSession } from "./sessionConfig.js";
import { PassportService } from "./passportDeclaration.js";
import { googleAuthenticationService } from "./googleAuthenticationService.js";
import { normalJsonParser } from "../util/SecurityService.js";

// import debug from "debug";

const authRouterV1 = express.Router();

authRouterV1.get("/login/federated/google", normalJsonParser, expressSession, PassportService.f.authenticate("google"));

authRouterV1.get("/oauth2/redirect/google", normalJsonParser, expressSession, googleAuthenticationService.oauth2RedirectGooglefunction);

authRouterV1.post("/logout", normalJsonParser, expressSession, function (req, res, next) {
  if (req.logout) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req.logout(function (err: any) {
      res.cookie("COR_TOKEN", "", { maxAge: 1000, httpOnly: true });
      if (err) {
        return next(err);
      }

      res.cookie("COR_TOKEN", "", { maxAge: 1000, httpOnly: true });
      res.redirect("/");
    });
  }
});

export { authRouterV1 };
