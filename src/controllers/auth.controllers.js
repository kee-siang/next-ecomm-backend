import bcrypt from "bcryptjs"
import prisma from "../utils/prisma.js"
import { validateLogin } from "../validators/auth.js"
import { filter } from "../utils/common.js";
import { signAccessToken } from "../utils/jwt.js";
import express from "express"

const router = express.Router()

//Sign-in process backend//

//post endpoint to post data into database//
router.post('/', async (req, res) => {
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

export default router