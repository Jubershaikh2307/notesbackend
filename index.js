const express = require('express');
var jwt = require('jsonwebtoken');
require('dotenv').config()
const bcrypt = require('bcryptjs');
const { connection } = require("./config/db");
const { UserModel } = require('./Models/user.model');
const { notesRouter } = require("./Routes/user.route")

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
    res.send({ "greeting": "Welcome" })
})

app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body
    const ispresent = await UserModel.findOne({ email })
    if (ispresent) {
        return res.send({ "responce": "user already Exist" })
    }
    //this is try again
    try {
        const hashPassword =await bcrypt.hashSync(password, 8)
        const new_user = new UserModel({ name, email, password: hashPassword })
        await new_user.save()
        res.send({ "responce": "Success" })
    } catch (error) {
        return res.send({ "responce": "Encryption Error"+error })
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email })
    if (!user) {
        return res.send({ "responce": "user Not Exist" })
    }
    const hashPassword = user.password
    await bcrypt.compare(password, hashPassword, (err, result) => {
        if (err) {
            return res.send({ "responce": "Please Try again" })
        }
        if (result == true) {
            var token = jwt.sign({ email: user.email, _id: user._id }, process.env.secret);
            return res.send({ "responce": "success", userId: user._id, token: token })
        } else {
            return res.send({ "responce": "Login Fail" })
        }
    })
})

const authentication = (req, res, next) => {
    if (!req.headers.token) {
        return res.send("Token not define")
    }
    const user_token = req.headers.token
    jwt.verify(user_token, process.env.secret, function (err, decoded) {
        if (err) {
            console.log(err);
        }
        next()
    });
}

const validator = (req, res, next) => {
    // console.log(req.body);
    const {title,lable,note}=req.body
    if(title!="" && lable!="" && note!=""){
        if(typeof(title) == "string" && typeof(lable) == "string" && typeof(note) == "string"){
            next()
        }else{
            res.send("Cridiential not proper")
        }
    }else{
        res.send("Please fill all cridiential")
    }
}

app.use(authentication)
app.use(validator)
app.use("/note", notesRouter)

app.listen(7000, async () => {
    try {
        await connection
        console.log("Connected to Database Successfully");
    } catch (error) {
        console.log("Connection fail :" + error);
    }
    console.log("server Running at http://localhost:" + process.env.port);
})