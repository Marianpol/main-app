const express = require("express");
const fetch = require("node-fetch");
const app = express();
const path = require("path");
const fs = require("fs");
const cors = require('cors');
const MESSAGE = process.env.MESSAGE;

const directory = path.join('/', 'usr', 'src', 'app', 'files')
const timePath = path.join(directory, 'timestamps.log');
const counterPath = path.join(directory, 'visitcounter.log');
let currentStatus = {date: '', str: '', pageVisits: ''}

function readSharedFile(path, cb){
    if (fs.existsSync(path)) {
        fs.readFile(path, "utf8" , function(err, data) {
            const lines = data.split('\n');
            let lastLine = lines[lines.length - 1];
            if (lines[lines.length - 1] == ''){
                lastLine = lines[lines.length - 2];
            }
            cb(null, lastLine)
        })
    }
}

function readVisitCounter(path, cb) {
    if (fs.existsSync(path)) {
        fs.readFile(path, "utf8" , function(err, data) {
            cb(null, data)
        })
    }
}

const createRandomStringWithTimeStamp = (path) => {
    const randomString = Math.random().toString(36).substr(2, 6)
    readSharedFile(timePath, function(err, timestamp){
        currentStatus = {...currentStatus, date: timestamp, str: randomString}
    })
    getVisitCounter();
    // readVisitCounter(counterPath, function(err, visits){
    //     currentStatus = {...currentStatus, pageVisits: visits}
    // })

}
const logRandomString = () => {
    createRandomStringWithTimeStamp()
    console.log(currentStatus.date + ': ' + currentStatus.str)
}
const createRandomString = () => Math.random().toString(36).substr(2, 6)

app.get('/api/get/random', (req, res) => {
    const startingString = createRandomString()
    res.send({'random' : startingString});
});

app.get('/api/get/log', (req, res) => {
    res.send({
        'someMessage': MESSAGE,
        'date': currentStatus.date,
        'string': currentStatus.str,
        'visits': currentStatus.pageVisits,
    });
});

const getVisitCounter = () => {
    const respose = fetch('http://ping-svc:3003/api/ping', {
        mode: 'cors',
        method: 'GET',
    })
    respose.then(res => res.json())
    .then((data) => {
        currentStatus = {...currentStatus, pageVisits: data['pong']}
    }).catch((error) => console.log(error))
}

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT || 5000}`);
});

setInterval(logRandomString, 5000)

