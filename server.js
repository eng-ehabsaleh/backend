const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
app.use(cors());
app.use(express.json());
require("dotenv").config();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;
mongoose.connect(`${MONGO_URL}/${DB_NAME}`);

const fruitSchema = new mongoose.Schema({
  fruits_name: { type: String },
  fruits_image: { type: String },
  fruits_price: { type: String },
  email: { type: String },
});
const fruitsModal = mongoose.model("myFruit", fruitSchema);

app.get("/", function (req, res) {
  res.send("Hello World");
});
class fruit {
  constructor(name, image, price) {
    this.name = name;
    this.image = image;
    this.price = price;
  }
}
app.get("/glopalFav", (req, res) => {
  axios
    .get("https://fruit-api-301.herokuapp.com/getFruit")
    .then((herokuRes) => {
      const fruitArr = herokuRes.data.fruits.map((fruity) => {
        return new fruit(fruity.name, fruity.image, fruity.price);
      });
      res.json(fruitArr);
    });
});
app.get("/fav", (req, res) => {
  const email = req.query.email;
  fruitsModal.find({ email }, (err, data) => {
    res.json(data);
  });
});
app.post("/fav", (req, res) => {
  const { fruits_name, fruits_image, fruits_price } = req.body;
  const newFrut = new fruitsModal({ fruits_name, fruits_image, fruits_price });
  res.json(newFrut);
});
app.delete("/fav/:frut_id", (req, res) => {
  const frutId = req.params.frut_id;
  fruitsModal.deleteOne({ _id: frutId }, (error, deletedData) => {
    res.json(deletedData);
  });
});

app.put("/fav/:frut_id", (req, res) => {
  const frutId = req.params.frut_id;
  const { fruits_name, fruits_image, fruits_price } = req.body;
  fruitsModal.findByIdAndUpdate(
    { _id: frutId },
    { fruits_name, fruits_image, fruits_price },
    { new: true },
    (err, updatedfruit) => {
      res.json(updatedfruit);
    }
  );
});
app.listen(PORT);
