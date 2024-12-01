const express = require("express");
const mongoose = require("mongoose");
const Toy = require("./models/Toy.model.js")

const PORT = 5005;
require("dotenv").config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("All good here!");
});

app.listen(PORT, () => {
  console.log(`
    Server is running on port \x1b[33m${PORT}\x1b[0m
    Try a GET request to:
    \x1b[36mhttp://localhost:${PORT}/\x1b[0m
    `);
});


mongoose
  .connect(process.env.MONGODB_URI )
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });


  app.post('/toys', async (req, res) => {

    const { name, description, quantity, price, inStock } = req.body;

    const newToy = {
        name,
        description,
        price,
        quantity,
        inStock,
    };
    try {
      const response = await Toy.create(newToy);
        res.status(201).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error while creating a new toy"})
      }
});


app.get('/toys', async (req, res) => {

try {
  const response = await Toy.find();
  res.status(200).json(response)
} catch (error) {
  res.status(500).json({message: "Error while getting all toys"})
}
});

app.get("/toys/search", async (req, res) => {
  const { name } = req.query;
  if (!name) {
    const allToys = await Toy.find();
    res.status(200).json(allToys);
  }

  try {
    const toy = await Toy.find({
      name: {
        $regex: name.trim(),
      /*   $regex: `^${name.trim()}$`, */
        $options: "i"
      }
    });

    if (!toy) {
      return res.status(404).json({ message: "No toy found with the given name." });
    }

    res.status(200).json(toy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/toys/:toyId", async (req, res) => {

  const { toyId } = req.params;
  const { name, description, quantity, price, inStock, created } = req.body;
  const updateToy = {
    name,
    description,
    price,
    quantity,
    inStock,
    created
};

  try {
    const toyResponse = await Toy.findByIdAndUpdate(toyId, updateToy, {
      new: true
    } );
    res.status(200).json(toyResponse);
  } catch (error) {
    res.status(500).json({message: `Unable to update ${updateToy.name}`})
  }
});