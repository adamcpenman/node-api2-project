const express = require("express")
const postsRouter = require('./routers/crud.js')
const server = express()

server.use(express.json())

server.use('/api/posts', postsRouter);

server.use("/", (req, res) => {
    console.log("ip:", req.ip)

    res.send({
        message: "Node API 2"
    })
})

server.listen(4000, () => {
  console.log("Server Running on http://localhost:4000")
})