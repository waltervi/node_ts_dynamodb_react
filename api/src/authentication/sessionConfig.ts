import { SessionOptions } from "express-session";
import debug from "debug";
import session from "express-session";
import dbClient from "../util/db.js";
import connect from "connect-dynamodb";



const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

const sessionKey: string = process.env.SESSION_KEY === undefined ? "1234567890" : process.env.SESSION_KEY;

const sessionOptions: SessionOptions = {
  secret: sessionKey,
  resave: true,
  saveUninitialized: true,
  unset: "destroy",
  cookie: {
    secure: false,
    httpOnly: true,
    path: "/",
    expires: expiryDate,
  },
};

const options = {
  // Optional DynamoDB table name, defaults to 'sessions'
  //table: "httpSessions",
  // Optional client for alternate endpoint, such as DynamoDB Local
  client: dbClient,
  // Optional ProvisionedThroughput params, defaults to 5
  //readCapacityUnits: 25,
  //writeCapacityUnits: 25,
  // Optional special keys that will be inserted directly into your table (in addition to remaining in the session)
  // specialKeys: [
  //   {
  //     name: "userId", // The session key
  //     type: "S", // The DyanamoDB attribute type
  //   },
  // ],
  // Optional skip throw missing special keys in session, if set true
  skipThrowMissingSpecialKeys: true,
};

const DynamoDBStore = connect(session);
sessionOptions.store = new DynamoDBStore(options);

if (process.env["ENV"] === "production") {
  sessionOptions.cookie = {
    secure: true,
    httpOnly: true,
    path: "/",
    expires: expiryDate,
  };
}

const expressSession = session(sessionOptions);

export { expressSession };
