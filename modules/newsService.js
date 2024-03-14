let newsData = require("../data/news.json")
let regionsData = require("../data/regions.json")
let news = []
const OpenAI = require("openai")
const env = require("dotenv")
env.config()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function summarizeArticle(articleData) {
  try {
    // Example prompt message
    // const promptMessage = articleData;

    // Create a completion request
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: articleData.articleQuery }],
      model: "gpt-4",
    });

    // Log the completion choice
    console.log(completion.choices[0]);
    // figure out how to put this data answer into our card's json temp data 

    // do this in client:
    //    const chatResponse = document.getElementById("response")
    // chatResponse.innerText = completion.choices[0].message.content

  } catch (error) {
    console.error("Error:", error);
  }
}


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

function getRegions() {
    return new Promise((resolve, reject) => {
        if (regionsData) {
            resolve(regionsData)
        } else {
            reject("no regions found")
        }
    })
}
function addRegion(newRegion) {
    return new Promise((resolve, reject) => {
        if (newRegion) {
            newRegion.id = regionsData.length + 1
            regionsData.push(newRegion)
            resolve("success")
        } else {
            reject("no regions found")
        }
    })
}





module.exports = {
    initialize,
    getNews,
    getNewsByID,
    getNewsByRegion,
    getRegions,
    addRegion,
    summarizeArticle
}