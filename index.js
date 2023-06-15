// user sign up backend // 

import express from "express"
import prisma from "./src/utils/prisma.js"
import cors from 'cors';
import { Prisma } from "@prisma/client";

const app = express()
const port = process.env.PORT || 8080
app.use(express.json())
app.use(cors());

//function for validation//
function validateUser(input) {
  const validationErrors = {}
  if (!('name' in input) || input['name'].length == 0) {
    validationErrors['name'] = 'cannot be blank'
  }

  if (!('email' in input) || input['email'].length == 0) {
    validationErrors['email'] = 'cannot be blank'
  }else if ('email' in input && !input['email'].match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
    validationErrors['email'] = 'is invalid'
  }

  if (!('password' in input) || input['password'].length == 0) {
    validationErrors['password'] = 'cannot be blank'
  }

  if ('password' in input && input['password'].length < 8) {
    validationErrors['password'] = 'should be at least 8 characters'
  }

  return validationErrors;
}

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

  //validate input from user//
  const validationErrors = validateUser({ name, email, password })

  if (Object.keys(validationErrors).length != 0) return res.status(400).send({
    error: validationErrors
  })

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