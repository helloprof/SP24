const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = 8080; // assign a port
const newsService = require("./modules/newsService")
const path = require("path")

app.use(express.static("public"))

app.get("/", (req, res) => {
    // newsService.getNews().then((data) => {
    //     res.send(data)
    // })
    
    res.redirect("/news")
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
        newsService.getNews().then((data) => {
            res.sendFile(path.join(__dirname, "/views/news.html"))
        }).catch((err) => {
            console.log(err)
        })
    }

})

app.get("/news/:id", (req, res) => {
    newsService.getNewsByID(req.params.id).then((news) => {
        res.send(news)
    }).catch((err) => {
        console.log(err)
    })

})

app.get("/about", (req, res) => {
    // newsService.getNews().then((data) => {
    //     res.send(data)
    // })
    
    res.send("about")
})

app.use((req, res, next) => {
    res.status(404).end();
});

newsService.initialize().then(() => {
    app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
})
