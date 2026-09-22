const { Schema, model } = require('mongoose');

// Users authenticate exclusively via GitHub OAuth, so no password field
// exists here and no plain-text or hashed credentials are ever stored.
const userSchema = new Schema(
  {
    githubId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: null,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = model('User', userSchema);
