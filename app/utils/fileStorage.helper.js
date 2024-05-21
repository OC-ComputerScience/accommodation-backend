const util = require("util");
const fs = require('fs')
const multer = require("multer");
const path = require("path");
const maxSize = 2 * 1024 * 1024;

const baseDir = path.join(__dirname, "../../../");
const uploadDir = "/accommodation-uploads/"

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = baseDir + uploadDir

    if(!fs.existsSync(path)){               // Make directory if it doesn't exist
      fs.mkdirSync(path, {recursive: true})
    }

    cb(null, path);
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let removeFile = (fileName) => {
  fs.unlinkSync(baseDir + uploadDir + fileName)
}

const exportFunctions = {
  upload: util.promisify(uploadFile),
  remove: removeFile
}


module.exports = exportFunctions;