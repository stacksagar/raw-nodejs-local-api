const path = require('path');
const fs = require('fs');

const app = {};

// base directory of the data folder
app.basedir = path.join(`${__dirname}/../.data/`);

app.create = (dir, file, data, callback) => {
  fs.open(`${app.basedir + dir}/${file}.json`, 'w', (err, getFile) => {
    if (getFile) {
      const stringData = JSON.stringify(data);
      fs.writeFile(getFile, stringData, (err2) => {
        if (!err2) {
          fs.close(getFile, (err3) => {
            if (!err3) {
              callback(false);
            } else {
              callback('Error: ' + err3);
            }
          });
        } else {
          callback('Error: ' + err2);
        }
      });
    } else {
      callback('Error: ' + err);
    }
  });
};

app.read = (dir, file, callback) => {
  fs.readFile(`${app.basedir + dir}/${file}.json`, 'utf8', (err, getData) => {
    callback(err, getData);
  });
};

app.update = (dir, file, data, callback) => {
  fs.open(`${app.basedir + dir}/${file}.json`, 'r+', (err, fileDes) => {
    if (!err && fileDes) {
      fs.ftruncate(fileDes, (err2) => {
        if (!err2) {
          fs.writeFile(fileDes, JSON.stringify(data), (err3) => {
            if (!err3) {
              fs.close(fileDes, (err4) => {
                if (!err4) {
                  callback(false);
                } else {
                  callback('file closed failed!');
                }
              });
            } else {
              callback('file updated failed!');
            }
          });
        } else {
          callback('file updated failed!');
        }
      });
    } else {
      callback("file update failed, We could't found this name file!");
    }
  });
};

app.delete = (dir, file, callback) => {
  fs.unlink(`${app.basedir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback('file failed to delete!');
    }
  });
};

module.exports = app;
