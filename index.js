// user sign up backend // 

import express from "express"
import prisma from "./src/utils/prisma.js"
import cors from 'cors';
import bcrypt from "bcryptjs"

const app = express()
const port = process.env.PORT || 8080
app.use(express.json())
app.use(cors());

app.post('/sign-in', async (req, res) => {
  const data = req.body

  //find user email//
  const user = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  })

  //if user email is not correct, show this error message//
  if (!user) return res.status(401).send({
    error: 'Email address not valid'
  })

  //check the password is match with database password, if not show error message//
  const checkPassword = bcrypt.compareSync(data.password, user.password)
  if (!checkPassword) return res.status(401).send({
    error: 'password not valid'
  })

})

app.listen(port, () => {
  console.log(`App started; listening on port ${port}`)
})