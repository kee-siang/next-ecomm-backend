// user sign up backend // 
import express from "express"
import prisma from "./src/utils/prisma.js"
import cors from 'cors';
import { Prisma } from "@prisma/client";

const app = express()
const port = process.env.PORT || 8080
app.use(express.json())
app.use(cors());

//Create user backend//

//function for user validation//
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

//function to filter out the password//
function filter(obj, ...keys) {
  return keys.reduce((a, c) => ({ ...a, [c]: obj[c] }), {})
}

//post endpoint to post data into database//
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

  //check the password is match with database password, if not show error message//
  const checkPassword = bcrypt.compareSync(data.password, user.password)
  if (!checkPassword) return res.status(401).send({
    error: 'Email address or password not valid'
  })
})

//Sign-in process backend//

//function for login validation//
function validateLogin(input) {
  const validationErrors = {}

  if (!('email' in input) || input['email'].length == 0) {
    validationErrors['email'] = 'cannot be blank'
  }

  if (!('password' in input) || input['password'].length == 0) {
    validationErrors['password'] = 'cannot be blank'
  }

  if ('email' in input && !input['email'].match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
    validationErrors['email'] = 'is invalid'
  }

  return validationErrors
}

//post endpoint to post data into database//
app.post('/sign-in', async (req, res) => {
  const data = req.body

  //validate input from user//
  const validationErrors = validateLogin(data)

  //display error//
  if (Object.keys(validationErrors).length != 0) return res.status(400).send({
    error: validationErrors
  })

  //find user email//
  const user = await prisma.user.findUnique({
    where: {
      email: data.email
    },
  });

  //if user email is not correct, show this error message//
  if (!user) return res.status(401).send({
    error: 'Email address not valid'
  })

  //check the password is match with database password, if not show error message//
  const checkPassword = bcrypt.compareSync(data.password, user.password)
  if (!checkPassword) return res.status(401).send({
    error: 'password not valid'
  })

  //filter out user password//
  const userFiltered = filter(user, 'id', 'name', 'email')

  //get token//
  const accessToken = await signAccessToken(userFiltered)
  return res.json({ accessToken })
})

app.listen(port, () => {
  console.log(`App started; listening on port ${port}`)
})