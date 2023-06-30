import express from 'express'
import prisma from "../utils/prisma.js"
// import { filter } from "../utils/common.js";
// import { Image } from '@prisma/client';

const router = express.Router()

//Create user backend//

//post api to post data into database//
router.get(`/`, async (req, res) => {
   try {
    // Logic to fetch data from the 'images' table in your database
    const images = await prisma.Image.findMany() // Replace 'Image' with your actual model for the 'images' table
    
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router