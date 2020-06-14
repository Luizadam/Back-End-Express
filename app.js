const express = require('express');
const app = express();
const port = 3001;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv/config');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors())

const postingRoute = require('./routes/socialPosting')
const registRoute = require('./routes/Register')
app.use('/sosmed',postingRoute)
app.use('/',registRoute)

// app.use(express.json())
// const jadwal = [
//     {id:1,name:"aku"},
//     {id:2,name:"kamu"},
//     {id:3,name:"kita"}
// ]
app.get('/', (req, res) => res.send('Hello World!'))

// app.get('/iniapi/pakeid/:id', (req,res) => {
//     res.send(req.params.id);
// })

// app.get('/api/jadwal/',(req,res)=>{
//     res.send(jadwal)
// })

// app.get ('/api/jadwal/:id',(req,res) => {
//     const jadwals = jadwal.find(obj => obj.id === parseInt(req.params.id))
//     if (!jadwals) res.status(404).send("Object Not Found.")
//     res.send(jadwals)
// })

// app.post ('/api/jadwal',(req,res) => {
//  const jadwals = {
//      id:jadwal.length +1,
//      name: req.body.name
//  }
//  jadwal.push(jadwals)
//  res.send(jadwals)

// })

// app.put ('/api/jadwal/:id',(req,res) => {
//     const jadwals = jadwal.find(obj => obj.id === parseInt(req.params.id))
//     if (!jadwals) res.status(404).send("Object Not Found.")
//     jadwals.name = req.body.name
//     res.send(jadwals)
// })

mongoose.connect(
    process.env.DB_CONNECTION, {useNewUrlParser: true},()=>
    console.log('database connect'))
    

    
// const MongoClient = require('mongodb').MongoClient;
// const uri = process.env.DB_CONNECTION;
// const client = new MongoClient(uri, {useNewUrlParser: true});
// client.connect(err => {
//   const collection = client.db("project").collection("projectSocialmedia");
//   // perform actions on the collection object
//   client.close();
// });


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))