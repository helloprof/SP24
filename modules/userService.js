const mongoose = require("mongoose")
const env = require("dotenv")
env.config()
const bcrypt = require('bcryptjs');

let Schema = mongoose.Schema

let userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    email: String,
    loginHistory: [{
        date: Date,
        userAgent: String
    }]
})

let User;

function initialize() {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection(process.env.MONGO_URI)

        db.on('error', (err) => {
            reject(err)
        })

        db.once('open', () => {
            console.log("Connected to MongoDB")
            User = db.model("users", userSchema);
            resolve()

        })
    })
}

function register(userData) {
    return new Promise((resolve, reject) => {
        if (userData.password != userData.password2) {
            reject("Passwords do not match")
        }

        bcrypt.hash(userData.password, 10) 
        .then((hash) => {
            userData.password = hash

            const newUser = new User(userData)
            newUser.save().then(() => {
                resolve("User registered successfully")
            }).catch((err) => {
                if (err.code == 11000) {
                    reject("Username already taken")
                } else {
                    reject("An error occurred: "+err) 
                }
            })
        }).catch((err) => {
            reject("Encryption Error: "+err)
        })
    })
}

function login(userData) {
    return new Promise((resolve, reject) => {
        User.findOne({username: userData.username})
        .exec()
        .then((user) => {
            bcrypt.compare(userData.password, user.password)
            .then((success) => {
                if (success) {
                    // add loginHistory stuff here
                    // let newUserHistory = {dateTime: new Date(), userAgent: userData.userAgent} 
                    // user.loginHistory.push(newObject)
                    // User.updateOne()
                    resolve(user)
                } else {
                    reject("Incorrect login details")
                }
            }).catch((err) => {
                reject("Decryption error: "+err)
            })

        }).catch((err) => {
            reject("Incorrect login details")
        })
    })
}



module.exports = {
    initialize,
    register,
    login
}