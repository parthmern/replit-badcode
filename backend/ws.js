
const { Server ,Socket } = require("socket.io");
const { fetchDir } = require("./fs");
const {copyFileInsideS3, fetchAllFilesFromS3AndCopyToLocalMachine} = require("./s3.js");
const path = require("path");


function mainWS(httpServer){

    console.log("mainWS triggered");

    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", async (socket) => {

        const replId = socket.handshake.query.roomId;
        console.log("replId==>",replId);

        if (!replId) {
            socket.disconnect();
            return;
        }


        const bucketName = "replparthmern";
        const sourceFolder = "base/nodejs";
        const destinationFolder  = "code/userId/replid";
        await copyFileInsideS3(bucketName, sourceFolder, destinationFolder); // working
        await fetchAllFilesFromS3AndCopyToLocalMachine(`code/userId/replid`, path.join(__dirname, `../tmp/${123}`));

        // await fetchS3Folder(`code/${replId}`, path.join(__dirname, `../tmp/${replId}`));
        socket.emit("loaded", {
            rootContent: await fetchDir(path.join(__dirname, `../tmp/${123}/code/userId/replid`), "")
        });

        initHandlers(socket, replId);
    });

}


async function initHandlers(socket, replId) {
    socket.on("disconnect", () => {
        console.log("user disconnected");
        //todo: delete temp files
    });

    socket.on("fetchDir", async (dir) => {
        const dirPath = path.join(__dirname, `../tmp/${replId}/${dir}`);
        const contents = await fetchDir(dirPath, dir);
        console.log("contents=>", contents);
    });



}


module.exports = {
    mainWS
}