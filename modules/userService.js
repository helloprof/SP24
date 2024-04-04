const mongoose = require("mongoose")
const env = require("dotenv")

env.config()

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



module.exports = {
    initialize,
}