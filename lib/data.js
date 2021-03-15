const fs = require('fs');
const path = require('path');

const lib = {};

lib.basedir = path.join(__dirname, '../.data/');

lib.create = (dir, file, data, callback) => {
  fs.open(
    `${lib.basedir + dir}/${file}.json`,
    'wx',
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // convert data to string
        const stringData = JSON.stringify(data);

        // write data to file and then close it
        fs.writeFile(fileDescriptor, stringData, (err2) => {
          if (!err2) {
            fs.close(fileDescriptor, (err3) => {
              if (!err3) {
                callback(false);
              } else {
                callback('Error closing the new file!');
              }
            });
          } else {
            callback('Error writing a new file!');
          }
        });
      } else {
        callback("could't create new file, it may already exists!");
      }
    }
  );
};

lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
    callback(err, data);
  });
};

lib.update = (dir, file, data, callback) => {
  // file open
  fs.open(
    `${lib.basedir + dir}/${file}.json`,
    'r+',
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // convert the data to string
        const stringData = JSON.stringify(data);

        // truncate the file (do empty)
        fs.ftruncate(fileDescriptor, (err2) => {
          if (!err2) {
            // write to the file and close it.
            fs.writeFile(fileDescriptor, stringData, (err3) => {
              if (!err3) {
                fs.close(fileDescriptor, (err4) => {
                  if (!err4) {
                    callback(false);
                  } else {
                    callback('Error closing file!');
                  }
                });
              } else {
                callback('Error writing to file');
              }
            });
          } else {
            callback('Error truncating file!');
          }
        });
      } else {
        callback('Error updating file may not exists!');
      }
    }
  );
};

lib.delete = (dir, file, callback) => {
  fs.unlink(`${lib.basedir + dir}/${file}.json`, err => {
    if (!err) {
      callback(false)
    } else {
      callback('file deleting failed!')
    }
  })
}

module.exports = lib;