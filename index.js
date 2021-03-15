// dependencies
const http = require("http")
const { handleReqRes } = require("./helpers/handleReqRes")
const envts = require('./helpers/envts')
const data = require("./lib/data")

// app object 
const app = {}

// This is for test purpose
// data.create('test', 'new', { name: 'sagar', profession: 'web developer', language: ['bangla', 'english'] }, (err) => {
//   if (err) {
//     console.error(err)
//   } else {
//     console.log('File successfully created!')
//   }
// })

// data.read('test', 'new', (err, data) => {
//   if (err) {
//     console.error(err)
//   } else {
//     console.log('File open success ', data)
//   }
// })

// data.update('test', 'new', { name: 'stacksagar', profession: 'javascript developer', language: ['bangla', 'english', 'hinde'] }, (err) => {
//   if (err) {
//     console.error(err)
//   } else {
//     console.log('file successfully updated!')
//   }
// })

// data.delete('test', 'new', (err) => {
//   if (err) {
//     console.error(err)
//   } else {
//     console.log('file successfully deleted!')
//   }
// })

// create server 
app.createServer = () => {
  const server = http.createServer(app.handleReqRes)

  server.listen(envts.port, () => {
    console.log(` ---> listening to port ${envts.port} \n ---> preview: http://localhost:${envts.port}`)
  })
 }  

// handle Request Response 
app.handleReqRes = handleReqRes

// start server 
app.createServer()