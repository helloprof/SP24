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
    newsService.getNews().then((data) => {
        res.sendFile(path.join(__dirname, "/views/news.html"))
    })
})

app.get("/about", (req, res) => {
    // newsService.getNews().then((data) => {
    //     res.send(data)
    // })
    
    res.send("about")
})

newsService.initialize().then(() => {
    app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
})
