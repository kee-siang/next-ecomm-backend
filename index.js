// user sign up backend // 

import express from "express"
import prisma from "./src/utils/prisma.js"

const app = express()
const port = process.env.PORT || 8080
app.use(express.json())

//get data api//
app.get('/', async (req, res) => {
  const posts = await prisma.user.findMany({
  })
  res.json(posts)
})

//post api to post data into database//
app.post(`/user`, async (req, res) => {
  const { name, email, password } = req.body
  const result = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  })
  res.json(result)
})

app.listen(port, () => {
  console.log(`App started; listening on port ${port}`)
})