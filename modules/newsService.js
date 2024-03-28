let newsData = require("../data/news.json")
let regionsData = require("../data/regions.json")
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
    name: Sequelize.STRING,
    image: Sequelize.STRING
})

const NewsArticle = sequelize.define('NewsArticle', {
    articleID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: Sequelize.STRING,
    description: Sequelize.TEXT,
    date: Sequelize.DATE,
    image: Sequelize.STRING
})

NewsArticle.belongsTo(Region, { foreignKey: 'regionID' })

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
        NewsArticle.findAll().then((newsData) => {
            resolve(newsData)
        }).catch((err) => {
            reject(err)
        })
    })
}

function getNewsByID(id) {
    return new Promise((resolve, reject) => {
        NewsArticle.findOne({
            where: {
                articleID: id
            }
        }).then((newsArticle) => {
            resolve(newsArticle)
        }).catch((err) => {
            reject(err)
        })
    })
}

function getNewsByRegion(region) {
    return new Promise((resolve, reject) => {

        NewsArticle.findAll({
            where: {
                regionID: region
            }
        }).then((newsArticles) => {
            resolve(newsArticles)
        }).catch((err) => {
            reject(err)
        })
    })
}

function getRegions() {
    return new Promise((resolve, reject) => {
        Region.findAll().then((regions) => {
            resolve(regions)
        }).catch((err) => {
            reject(err)
        })
    })
}

function addRegion(newRegion) {
    return new Promise((resolve, reject) => {
        if (newRegion) {
            console.log(newRegion)
            Region.create(newRegion).then((region) => {
                console.log("SAKJDAKJASDKJASKJKASDKASD")
                console.log(region)
                resolve()
            }).catch((err) => {
                reject(err)
            })
        }
    })
}

function addArticle(newArticle) {
    return new Promise((resolve, reject) => {
        if (newArticle) {
            NewsArticle.create(newArticle).then(() => {
                resolve()
            }).catch((err) => {
                reject(err)
            })
        }
    })
}

function getRegionByID(id) {
    return new Promise((resolve, reject) => {
        Region.findOne({
            where: {
                regionID: id
            }
        }).then((region) => {
            resolve(region)

        }).catch((err) => {
            reject(err)
        })
    })
}

function deleteRegion(id) {
    return new Promise((resolve, reject) => {
        Region.destroy({
            where: {
                regionID: id
            }
        }).then(() => {
            resolve()

        }).catch((err) => {
            reject(err)
        })
    })
}


module.exports = {
    initialize,
    getNews,
    getNewsByID,
    getNewsByRegion,
    getRegions,
    addRegion,
    summarizeArticle,
    getRegionByID,
    deleteRegion,
    addArticle
}




// sequelize
// .sync()
// .then( async () => {
//   try{
//     await Region.bulkCreate(regionsData);
//     await NewsArticle.bulkCreate(newsData); 
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
// })