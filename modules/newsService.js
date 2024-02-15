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

function getNewsByID(id) {
    return new Promise((resolve, reject) => {
        let foundArticle = news.find((newsArticle) => newsArticle.id == id)
        if (foundArticle) {
            resolve(foundArticle)

        } else {
            reject("article ID not found")
        }
    })
}

function getNewsByRegion(region) {
    return new Promise((resolve, reject) => {
        let foundArticlesByRegion = news.filter((newsArticle) => newsArticle.region == region)
        if (foundArticlesByRegion) {
            resolve(foundArticlesByRegion)
        } else {
            reject(`articles not found by region ${region}`)
        }
    })
}


module.exports = {
    initialize,
    getNews,
    getNewsByID,
    getNewsByRegion
}