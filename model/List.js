const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide list name"],
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  status: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("List", ListSchema);
