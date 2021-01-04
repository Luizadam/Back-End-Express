const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
// const io = require('socket.io')(port)
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv/config');
// var fileupload = require("express-fileupload");
// app.use(fileupload());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization, *');
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Credentials', true);
        return res.status(200).json({});
    }
    next();
});
const postingRoute = require('./routes/socialPosting')
const registRoute = require('./routes/Register')
app.use('/data',postingRoute)
app.use('/',registRoute)
app.get('/', (req, res) => res.send('Hello World!'))
app.use('/uploads', express.static('uploads'));

// io.on('connection', socket => {
//     const id = socket.handshake.query.id
//     socket.join(id)
  
//     socket.on('send-message', ({ recipients, text }) => {
//       recipients.forEach(recipient => {
//         const newRecipients = recipients.filter(r => r !== recipient)
//         newRecipients.push(id)
//         socket.broadcast.to(recipient).emit('receive-message', {
//           recipients: newRecipients, sender: id, text
//         })
//       })
//     })
//   })

mongoose.connect(
    process.env.DB_CONNECTION, {useNewUrlParser: true},()=>
    console.log('database connect'))
    

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))