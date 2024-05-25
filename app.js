const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const expressValidator = require("express-validator")


//app
const app = express();

require("dotenv").config();

// db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB Connected");
    app.listen(port, () => {
      console.log(`server runs on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log("DB Error", err));

  
//import routes
const authRouter = require("./routes/auth")
const userRouter = require("./routes/user")
const categoryRouter = require("./routes/category")

// middleware
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(expressValidator())


// routes middleware

app.use('/api',authRouter)
app.use('/api',userRouter)
app.use('/api',categoryRouter)

const port = process.env.PORT || 3000;
