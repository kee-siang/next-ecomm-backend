// user sign in backend // 
import express from "express"
import prisma from "./src/utils/prisma.js"
import cors from 'cors';
// import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs"

const app = express()
const port = process.env.PORT || 8080
app.use(express.json())
app.use(cors());

//post /sign-in endpoint//
app.post('/sign-in', async (req, res) => {
  const data = req.body

  //find respective email address in database to sign in//
  const user = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  })
  
  //if the match input is not match with the email that store in the database, send error message//
  if (!user) return res.status(401).send({
    error: 'Email address or password not valid'
  })

  //check the password is match with database password, if not show error message//
  const checkPassword = bcrypt.compareSync(data.password, user.password)
  if (!checkPassword) return res.status(401).send({
    error: 'Email address or password not valid'
  })
})

app.listen(port, () => {
  console.log(`App started; listening on port ${port}`)
})