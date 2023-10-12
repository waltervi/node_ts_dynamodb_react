import { UserService } from "../user/UserService.js";
import { UserDAO } from "../user/UserDAO.js";
import { SecurityService } from "../util/SecurityService.js";
import { PassportService } from "./passportDeclaration.js";
import { log } from "console";


const googleAuthenticationService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  oauth2RedirectGooglefunction: async (req: any, res: any, next: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    const returnedFunction = PassportService.f.authenticate("google", {}, (err: any, user: any, info: any, status: any) => {
      log("passport.authenticate:", err, user, info, status);

      if (err) {
        res.cookie("COR_TOKEN", "", { maxAge: 1000, httpOnly: true });
        return next(err);
      }

      if (!user) {
        res.cookie("COR_TOKEN", "", { maxAge: 1000, httpOnly: true });
        return res.redirect(process.env.FRONT_END_URL + "/login");
      }

      const resp = SecurityService.encryptToken(user.id);

      res.cookie("COR_TOKEN", resp.ciphertext, { maxAge: resp.maxAge, httpOnly: true });

      const url = process.env.FRONT_END_URL + "/";
      res.redirect(url);
    });

    returnedFunction(req, res, next);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  processCredentials: async (issuer: string, profile: any, cb: any) => {
    log("processCredentials", issuer, profile);
    try {
      const interalIssuer = "go_";
      const userId = interalIssuer + profile.id;

      let user = await UserDAO.findById(userId);

      if (!user) {
        await UserService.create(userId, profile.displayName);

        user = await UserDAO.findById(userId);
      }
      return cb(null, user);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      log("ERR_processCredentials", err);
      return cb(err.code);
    }
  },
};

export { googleAuthenticationService };
