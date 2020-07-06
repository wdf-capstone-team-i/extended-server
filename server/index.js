const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const app = express();
const PORT = 8080;

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(compression());

app.use((err, req, res, next) => {
  res.send("Oops. Well, that's embarrassing");
});

app.listen(PORT, () => console.log("Serving on port: ", PORT));
