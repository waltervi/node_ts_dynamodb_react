
import express, { urlencoded } from "express"
import { config } from "./config.js"
import {authRouterV1} from "./authentication/authRouterV1.js"
import {userRouterV1} from "./user/UserRouterV1.js"
import {EventsRouterV1} from "./events/EventsRouterV1.js"
import helmet from "helmet"
import cookieParser from "cookie-parser";
// import debug from "debug";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import morgan, { token } from "morgan"


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loggerMiddleWare = (req: any, res : any,next: () => void) => {
    // debugLog( new Date(), "-", req.method, "-",req.url)
    next()
}

const app = express()
app.disable('x-powered-by')
app.use(loggerMiddleWare)
app.use(urlencoded({extended:false}))

token("time", ()=> new Date().toISOString())

app.use(morgan("[:time] :remote-addr :method :url :status :res[content-length] :response-time ms"))

app.use(cookieParser());

if (app.get('env') === 'production') {
    app.use(helmet())
}

app.use(authRouterV1)
app.use(userRouterV1)
app.use(EventsRouterV1)


// custom 404
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
app.use((req : any, res: any, next: any) => {
    res.status(404).send("Sorry can't find that!")
})
  
  // custom error handler
// eslint-disable-next-line @typescript-eslint/no-explicit-any  , @typescript-eslint/no-unused-vars
app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(config.PORT, () => {console.log("listening on por 3000")})

export {app}//meant for tests only

