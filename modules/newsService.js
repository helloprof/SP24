// let newsData = require("../data/news.json")
// let regionsData = require("../data/regions.json")
// let news = []
const OpenAI = require("openai")

const env = require("dotenv")
env.config()

const Sequelize = require("sequelize")
const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
    host: process.env.PGHOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false },
    },
});

const Region = sequelize.define('Region', {
    regionID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING
    },
    image: {
        type: Sequelize.STRING
    }
})

const Article = sequelize.define('Article', {
    articleID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.TEXT
    },
    date: {
        type: Sequelize.DATE
    },
    image: {
        type: Sequelize.STRING
    }
})

Article.belongsTo(Region, { foreignKey: 'regionID' })

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

        return completion.choices[0]
    } catch (error) {
        console.error("Error:", error);
    }
}


function initialize() {
    return new Promise((resolve, reject) => {
        // combine news and regions data and resolve it

        // if (newsData) {
        //     news = newsData
        //     resolve("success")
        // } else {
        //     reject("no data")
        // }

        sequelize.sync().then(() => {
            console.log("synced")
            resolve()        
        }).catch((err) => {
            console.log(err)
            reject(err)
        })

    })
}

function getNews() {
    return new Promise((resolve, reject) => {
        // if (news) {
        //     resolve(news)
        // } else {
        //     reject("no data")
        // }
        Article.findAll().then((newsData) => {
            resolve(newsData)
        }).catch((err) => {
            reject(err)
        }) 
    })
}

function getNewsByID(id) {
    return new Promise((resolve, reject) => {
        // let foundArticle = news.find((newsArticle) => newsArticle.id == id)
        // if (foundArticle) {
        //     resolve(foundArticle)

        // } else {
        //     reject("article ID not found")
        // }
        Article.findOne({
            where: {
                articleID: id
            }
        }).then((article) => {
            resolve(article)
        }).catch((err) => {
            reject(err)
        })
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



        // sequelize
        // .sync()
        // .then( async () => {
        //   try{
        //     await Region.bulkCreate(regionsData);
        //     await News.bulkCreate(newsData); 
        //     console.log("-----");
        //     console.log("data inserted successfully");
        //   }catch(err){
        //     console.log("-----");
        //     console.log(err.message);
      
        //     // NOTE: If you receive the error:
      
        //     // insert or update on table "Sets" violates foreign key constraint "Sets_theme_id_fkey"
      
        //     // it is because you have a "set" in your collection that has a "theme_id" that does not exist in the "themeData".   
      
        //     // To fix this, use PgAdmin to delete the newly created "Themes" and "Sets" tables, fix the error in your .json files and re-run this code
        //   }
      
        //   process.exit();
        // })
        // .catch((err) => {
        //   console.log('Unable to connect to the database:', err);
        // });
