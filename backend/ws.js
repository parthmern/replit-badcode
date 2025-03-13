
const { Server ,Socket } = require("socket.io");



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

        // await fetchS3Folder(`code/${replId}`, path.join(__dirname, `../tmp/${replId}`));
        // socket.emit("loaded", {
        //     rootContent: await fetchDir(path.join(__dirname, `../tmp/${replId}`), "")
        // });

        // initHandlers(socket, replId);
    });

}

module.exports = {
    mainWS
}