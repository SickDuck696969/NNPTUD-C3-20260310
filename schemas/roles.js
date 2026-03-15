const mongoose = require('mongoose');
const { Schema } = mongoose;

const roleSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);