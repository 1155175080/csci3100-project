const express = require("express");
const cors = require("cors");
const path = require("path");

require('dotenv').config({ path: path.join(__dirname, '.env')});
console.log("[LOG] FRONTEND_URL: " + process.env["FRONTEND_URL"]);
const corsOptions = {
  origin: process.env.FRONTEND_URL,
};

const bodyParser = require('body-parser');
const app = express();
global.__imageDir = path.join(__dirname, '..', 'client/src/Assets/Images');

app.use(cors(corsOptions));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

// static
app.use('/images', express.static(__imageDir));

// connecting to the database
const db = require("./src/models");
db.sequelize.sync()//{ force: true }
  .then(() => {
    console.log("[LOG] database connected successfully.");

    // router
    require("./src/routes/user.routes")(app);
    require("./src/routes/product.routes")(app);
    require("./src/routes/order.routes")(app);
    require("./src/routes/cart.routes")(app);
    require("./src/routes/Auth.routes")(app);
    require("./src/routes/comment.routes")(app);
    require("./src/routes/user-info.routes")(app);
    require("./src/routes/recommend.routes")(app);

    // starting the server
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`[LOG] server started on port ${PORT}.`);
    });
  })
  .catch(err => {
    console.error("[ERROR] server connection failed.\n" + err);
  })

