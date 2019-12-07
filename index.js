const express = require("express")
const db = require("./data/db")

const server = express()

server.use(express.json())

server.get("/", (req, res) => {
    console.log("ip:", req.ip)

    res.json({
        message: "Node API 2"
    })
})

server.get("/api/posts", (req, res) => {
    db.find()
    .then(posts => {
        res
            .status(200)
            .json(posts)
    })
    .catch(() => {
        res
            .status(404)
            .json({ error: "Can not find messages" })
    })
})

server.get("/api/posts/:id" , (req, res) => {
    db.findById(req.params.id)
    .then(posts => {
        res
            .status(200)
            .json(posts)
    })
    .catch(() => {
        res
            .status(404)
            .json({ error: "Can not find that particular ID"})
    })
})

server.listen(4000, () => {
  console.log("Server Running on http://localhost:4000")
})