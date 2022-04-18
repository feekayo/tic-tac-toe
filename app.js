const express = require ("express")
const http = require("http");
//require('dotenv').config();

const PORT = process.env.PORT || 3000

const app=express()

const server = http.createServer(app)

server.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})

const routes = require("./server/index");

app.use(express.json());
app.use("", routes);