let newsData = require("../data/news.json")
let regionsData = require("../data/regions.json")
let news = []

function initialize() {
    return new Promise((resolve, reject) => {
        // combine news and regions data and resolve it

        if (newsData) {
            news = newsData
            resolve("success")
        } else {
            reject("no data")
        }
    })
}

function getNews() {
    return new Promise((resolve, reject) => {
        if (news) {
            resolve(news)
        } else {
            reject("no data")
        }
    })
}

module.exports = {
    initialize,
    getNews
}