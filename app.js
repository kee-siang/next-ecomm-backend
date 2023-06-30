import morgan from "morgan"
import express from "express"
import cors from 'cors'
import userRouter from "./src/controllers/users.controllers.js"
import authRouter from "./src/controllers/auth.controllers.js"
import imgRouter from "./src/controllers/img.controllers.js"
import loadRouter from "./src/controllers/load.controllers.js"
import checkoutRouter from "./src/controllers/payment.controllers.js"

const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan('combined'))
app.use('/user', userRouter)
app.use('/auth', authRouter)
app.use('/upload', imgRouter)
app.use('/load', loadRouter)
app.use('/create-checkout-session', checkoutRouter)
// start added
// app.get('/protected', auth, (req, res) => {
//   res.json({ "hello": "world" })
// })
// end added

export default app

