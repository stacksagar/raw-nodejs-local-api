// dependencies

const handler = {}

handler.sampleHandler = (queryProperties, callback) => {
  callback(200, {
    message: 'this is sample handler'
  })
}

module.exports = handler