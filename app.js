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
const auth = require('./routes/auth')
app.use('/sosmed',postingRoute)
app.use('/',auth)
app.get('/', (req, res) => res.send('Hello World!'))


mongoose.connect(
    process.env.DB_CONNECTION, {useNewUrlParser: true},()=>
    console.log('database connect'))
    


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))