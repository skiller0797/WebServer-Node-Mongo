const express = require('express');
require('dotenv').config();
const connectDB = require('./db/connect');

const app = express();
var cors = require('cors');
var bodyParser=require('body-parser');
var methodOverride=require('method-override');

const session = require('express-session');
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false
  })
)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// app.use(cors());
app.use(express.json());

const authRouter = require('./routes/auth');
const addRouter = require('./routes/add');

app.use('/api', authRouter);
app.use('/api', addRouter);

//port and connect to db
const port = process.env.port || 5000;
const start = async() => {
  try{
  
    // await connectDB(process.env.MONGO_URL);
    await connectDB("mongodb://127.0.0.1:27017/taxi");
    
    app.listen(port, () => {
      console.log('Server is running on port', port);
    });

  } catch(err) {
    console.log('error => ', err);
  }
}
app.get('/test', function(req, res){
  console.log('test called');
  res.send('success')
})
start();