const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const cors = require('cors');

const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'timestamps.log')

// let currentStatus = {date: '', str: ''}

function writeToSharedFile(path){
    fs.writeFile(path, new Date() + '\n',  {'flag':'a'},  function(err) {
        if (err) {
            return console.error(err);
        }
    });
    // fs.appendFile(path, new Date() + '\n', function(err) {
    //     if (err) return console.log(err);
    // })
}

// const createRandomStringWithTimeStamp = () => {
//     const randomString = Math.random().toString(36).substr(2, 6)
//     const currentTime = new Date();
//     currentStatus = {date: currentTime, str: randomString}
// }

const writeTimestamp = () => {
    writeToSharedFile(filePath);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server has started on port ${process.env.PORT || 5000}`);
});

setInterval(writeTimestamp, 5000)

