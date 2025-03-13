const express = require("express");

const app = express();

app.get("/", (req, res)=>{
    return res.send(200).send("/ root working");
})

app.listen(4000, ()=>{
    console.log("runnign 4000 port")
})

