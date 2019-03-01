const fs = require('fs');

var fileName = '/files.json';

fs.readFile(__dirname + fileName, (err, buff) => {
    if (err) throw err;
    let filesArr = JSON.parse(buff.toString('utf8'));
});
