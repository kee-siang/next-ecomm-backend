// user sign up backend // 

import express from "express"
import prisma from "./src/utils/prisma.js"
import cors from 'cors';
import { Prisma } from "@prisma/client";

const app = express()
const port = process.env.PORT || 8080
app.use(express.json())
app.use(cors());

// get data api//
app.get('/', async (req, res) => {
  const posts = await prisma.user.findMany({
  })
  res.json(posts)
})

//function to filter out the password//
function filter(obj, ...keys) {
  return keys.reduce((a, c) => ({ ...a, [c]: obj[c]}), {})
}


//post api to post data into database//
app.post(`/user`, async (req, res) => {
  const { name, email, password } = req.body
  const result = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  }).then(user => {
    //call the filter function to filter out the password.//
    return res.json(filter(user, 'id', 'name', 'email'))
  }).catch(err => {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const formattedError = {}
      formattedError[`${err.meta.target[0]}`] = 'email already taken'

      return res.status(500).send({
        error: formattedError
      });
    }
    throw err
  })
  
})

app.listen(port, () => {
  console.log(`App started; listening on port ${port}`)
})