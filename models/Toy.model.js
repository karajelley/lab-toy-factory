const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const toySchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
    },
  
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },

    created: {
        type: Date,
        default: Date.now,
    },
  });

const Toy = mongoose.model("Toy", toySchema);

module.exports = Toy;
