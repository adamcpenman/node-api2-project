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
//find all users
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
//find users by id
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

//create a new post 
server.post("/api/posts", (req, res) => {
    if (!req.body.title || !req.body.contents) {
        return res 
            .status(400).json({ error: "Need a title and contents"})
    }
    const newPost = {
        title: req.body.title,
        contents: req.body.contents
    }
    db.insert(newPost)
        res
            .status(201)
            .json(newPost)
})

//update 
server.put("/api/posts/:id", (req, res) => {
    if (!req.body.title) {
        return res.status(400).json({ message: "Missing title" })
    }
    db.update(req.params.id, req.body) 
        .then(change => {
            if(change) {
                res.status(200).json(change)
            } else {
                res.status(404).json({ message: "Nothing can be found"})
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: "Error updating"
            })
        })
})

//delete
server.delete("/api/posts/:id", (req,res) =>{ 
    db.remove(req.params.id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: "BYE FOREVER"})
            } else {
                res.status(204).json({ message: "I dont know her"
                })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: "Error, WTF?!"
            })
        })
})

//find comments
server.get("/api/posts/:id/comments", (req, res) => {
    console.log(res.params, "Find comments")
    db.findPostComments(req.params.id)
        .then(data => {
            res.json(data)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: "Nah, girl"
            })
        })
})

server.post("/api/posts/:id/comments", (req, res) => {
    if (!req.body.text || !req.body.post){
        return res.status(400).json({
            message: "Need Text and post values"
        })
    }
    const body = {
        text: req.body.text,
        post: req.body.post
    }
    db.insertComment(req.params.id, body)
        .then(data => {
            res.status(201).json(data)
        })
        .catch(error => {
            req.status(500).json({
                message: "Could not create"
            })
        })
})

server.listen(4000, () => {
  console.log("Server Running on http://localhost:4000")
})