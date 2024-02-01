const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = 8080; // assign a port
const newsService = require("./modules/newsService")

app.get("/", (req, res) => {
    // newsService.getNews().then((data) => {
    //     res.send(data)
    // })
    
    res.redirect("/news")
})

app.get("/news", (req, res) => {
    newsService.getNews().then((data) => {
        res.send(data)
    })
})

newsService.initialize().then(() => {
    app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
})
