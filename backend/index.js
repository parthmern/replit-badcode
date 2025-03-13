const express = require("express");
const {copyFileInsideS3, fetchAllFilesFromS3AndCopyToLocalMachine} = require("./s3.js");
const {mainWS} = require("./ws.js");
const {createServer} = require("http");
const path = require("path");
var cors = require('cors')



const app = express();
app.use(cors())
const httpServer = createServer(app);

app.get("/", (req, res)=>{
    return res.send(200).send("/ root working");
})

httpServer.listen(4000, ()=>{
    console.log("runnign 4000 port")
})
 
//SOCKET
mainWS(httpServer);




// ROUTES
app.post("/project", async (req, res) => {
    
    const { replId, language } = req.body;

    if (!replId) {
        res.status(400).send("Bad request");
        return;
    }

    const bucketName = "replparthmern";
    const sourceFolder = `base/${language}`;
    // todo: code/userId/replid
    const destinationFolder  = `code/userId/${replId}`;
    // copyFileInsideS3(bucketName, sourceFolder, destinationFolder); // working

    await copyS3Folder(`base/${language}`, `code/${replId}`);

    res.send("Project created");
});

async function main(){
    const bucketName = "replparthmern";
const sourceFolder = "base/nodejs";
const destinationFolder  = "code/userId/replid";
await copyFileInsideS3(bucketName, sourceFolder, destinationFolder); // working


await fetchAllFilesFromS3AndCopyToLocalMachine(`code/userId/replid`, path.join(__dirname, `../tmp/${123}`));
}

main();