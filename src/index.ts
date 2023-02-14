const express = require('express')
var bodyParser = require('body-parser');
require('./models/index')
const { Pool } = require('pg')

const app = express()
const port = 5000;

app.use(bodyParser.json());


// Available Routes 
app.use('/api/',require('./routes/studentRoute'));
app.use('/api/',require('./routes/userRoute'));
app.use('/api/',require('./routes/subjectRoute'));
app.use('/api/marks',require('./routes/marksRoute'));
app.use('/api/',require('./routes/emailAuthRoute'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})