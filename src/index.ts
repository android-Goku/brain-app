import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { DB_STRING, JWT_USER_SECRET } from "./config";
import { contentModel, userModel } from "./db";
import {userMiddleware} from "./middleware";

const app = express();

// This is very important to use req and res as json 

app.use(express.json())

app.post("/api/v1/signup", async ( req, res ) => {
    // todo: zod validation for hashing the password
    const username = req.body.username;
    const password = req.body.password;

    try {
        await userModel.create({
            username: username,
            password: password
        });
    
        res.json({
            message: "User signed up"
        })
    } catch (e){
        res.status(411).json({
            message: "User already exists"
        })
    }
})

app.post("/api/v1/signin", async ( req, res ) => {
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await userModel.findOne({
        username,
        password
    })
    if (existingUser){
        const token = jwt.sign({
            id : existingUser._id
        }, JWT_USER_SECRET)

        res.json({
            token
        })
    } else { 
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
})

app.post("/api/v1/content", userMiddleware, async ( req, res ) => {
    const title = req.body.title
    const link = req.body.link
    await contentModel.create({
        title,
        link,
        //@ts-ignore
        userId: req.userId,
        tags: []
    })

    res.json({
        message: "Content added."
    })
})
app.get("/api/v1/content", userMiddleware, async ( req, res ) => {
    //@ts-ignore
    const userId = req.userId;

    const contents = await contentModel.find({
        userId: userId
    }).populate("userId", "username")

    res.json({
        contents
    })

})

app.delete("/api/v1/content", userMiddleware, async ( req, res ) => {

    const contentId = req.body.contentId;
    console.log(contentId)
    const contentDelete = await contentModel.deleteMany({
        _id: contentId,
        //@ts-ignore
        userId: req.userId
    })
    console.log(contentDelete)
    res.json({
        message: "content deleted"
    })
    
})
app.post("/api/v1/:sharelink", ( req, res ) => {
    
})

async function main() {
    await mongoose.connect(DB_STRING);
    app.listen(3000);
    console.log("Connected to Database")
}

main()