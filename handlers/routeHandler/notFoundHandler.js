// dependencies

const handler = {}

handler.notFoundHandler = (queryProperties, callback) => {
  callback(404, {
    message: 'Not Found!'
  })
}

module.exports = handler