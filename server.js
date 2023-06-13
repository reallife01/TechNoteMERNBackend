require('dotenv').config()
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const {logger} = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
// custom modules
const corsOptions = require("./config/corsOptions");
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require("./config/dbConnect");
const {logEvents} = require('./middleware/logger')

connectDB();

const PORT = process.env.PORT || 4500;

console.log(process.env.NODE_ENV);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// app.use(cors);


// custom middleware logger
app.use(logger);
// built-in middleware for json
app.use(express.json());
app.use(cookieParser())








//serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));
app.use("/auth", require('./routes/authRoutes'));
app.use("/users", require('./routes/userRoutes'));
app.use("/notes", require('./routes/notesRoutes'));

app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
      res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
      res.json({ error: "404 Not Found" });
    } else {
      res.type("txt").send("404 Not Found");
    }
  });

  app.use(errorHandler);


  mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}🛫`));
  });

    mongoose.connection.on('error', err =>{
        console.log(err);
        logEvents(`${err.no}: ${err.code}\t${err.sycall}\t${err.hotsname}`, 'mongoErrLog.log')
    })
// app.listen(PORT, () => console.log(`Server running on port ${PORT}🛫`));
