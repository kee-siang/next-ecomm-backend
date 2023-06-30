import express from 'express'
import prisma from "../utils/prisma.js"
import { filter } from "../utils/common.js";
import auth from "../middlewares/auth.js"

const router = express.Router()

//Create user backend//

//post api to post data into database//
router.post(`/`, auth, async (req, res) => {
    const { fileUrl, price, title, description } = req.body;

    // //validate input from user//
    // const validationErrors = validateInput(data)

//     if (Object.keys(validationErrors).length != 0) return res.status(400).send({
//     error: validationErrors
//   })
    const user_Id = req.user.payload.id;
    
    const result = await prisma.Image.create({
        data: {
            fileUrl,
            price,
            title,
            description,
            user: {
                connect: {
                    id : user_Id
                },
            },
        }

    }).then(Image => {

        //call the filter function to filter out the password.//
        return res.json(filter(Image, 'fileUrl', 'price', 'title', 'description'))
    })
})

export default router