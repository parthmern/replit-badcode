
const fs = require("fs");

const fetchDir = (dir, baseDir)   => {

    console.log("fetchin from=>", dir,  )
    console.log("baseDir", baseDir);

    return new Promise((resolve, reject) => {
        fs.readdir(dir, { withFileTypes: true }, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files.map(file => ({ type: file.isDirectory() ? "dir" : "file", name: file.name, path: `${baseDir}/${file.name}`  })));
            }
        });       
    });
}


module.exports = {
    fetchDir
}