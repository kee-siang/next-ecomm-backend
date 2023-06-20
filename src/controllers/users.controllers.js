import express from 'express'
import bcrypt from "bcryptjs"
import { Prisma } from "@prisma/client"
import prisma from "../utils/prisma.js"
import { validateUser } from "../validators/users.js"
import { filter } from "../utils/common.js"
const router = express.Router()

//Create user backend//

//post api to post data into database//

router.post(`/`, async (req, res) => {
  const data = req.body

  //validate input from user//
  const validationErrors = validateUser(data)

  if (Object.keys(validationErrors).length != 0) return res.status(400).send({
    error: validationErrors
  })

  //store password in hash//
  data.password = bcrypt.hashSync(data.password, 8);
  const result = await prisma.user.create({
    data,
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

export default router