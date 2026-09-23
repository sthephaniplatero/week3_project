const { Schema, model } = require('mongoose');

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      trim: true,
      minlength: [1, 'name cannot be empty'],
      maxlength: [50, 'name cannot exceed 50 characters'],
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'description cannot exceed 300 characters'],
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = model('Category', categorySchema);
