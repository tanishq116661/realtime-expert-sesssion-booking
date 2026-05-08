const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: { type: String, required: true },
  times: [{ type: String, required: true }]
});

const expertSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  experience: { type: Number, required: true },
  rating: { type: Number, required: true },
  description: { type: String, default: '' },
  slots: [slotSchema]
});

const Expert = mongoose.model('Expert', expertSchema);
module.exports = Expert;
