const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = 8080; // assign a port
const newsService = require("./modules/newsService")
const path = require("path")

app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    // newsService.getNews().then((data) => {
    //     res.send(data)
    // })
    
    res.redirect("/news")
    console.log("test")
})

app.get("/news", (req, res) => {

    if (req.query.region) {
        newsService.getNewsByRegion(req.query.region).then((newsByRegion) => {
            res.send(newsByRegion)
        }).catch((err) => {
            // res.send(err)
            console.log(err)
        })
    } else {
        newsService.getNews().then((newsData) => {
            // res.sendFile(path.join(__dirname, "/views/news.html"))
            res.render("news", {
                news: newsData
            })
        }).catch((err) => {
            console.log(err)
        })
    }

})

app.get("/news/add", (req, res) => {
    // form
    res.render('newArticle')

})

app.get("/news/:id", (req, res) => {
    newsService.getNewsByID(req.params.id).then((news) => {
        res.send(news)
    }).catch((err) => {
        res.send(err)
        console.log(err)
    })

})

app.get("/regions", (req, res) => {
    newsService.getRegions().then((regions) => {
        res.render('regions', {
            regions: regions
        })
    })

})

app.get("/regions/add", (req,res) => {
    res.render('newRegion')
})

app.post("/regions/add", (req, res) => {
    // console.log(req.body)
    newsService.addRegion(req.body).then(() => {
        res.redirect("/regions")
    })
})



app.get("/about", (req, res) => {
    // newsService.getNews().then((data) => {
    //     res.send(data)
    // })
    
    res.send("about")
})

app.use((req, res, next) => {
    res.status(404).send("404, client error");
});

newsService.initialize().then(() => {
    app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
})
