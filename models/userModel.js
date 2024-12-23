const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  savedAd: Array,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// hash password befor save it in db
userSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// compare entered password and db password
userSchema.methods.comparePassword = async function (
  enteredPassword,
  userPasswoed,
) {
  return await bcrypt.compare(enteredPassword, userPasswoed);
};

// check chang password time and token expire time
userSchema.methods.checkChangePassAfter = async function (jwtExpireTime) {
  if (this.passwordChangedAt) {
    return (
      parseInt(this.passwordChangedAt.getTime() / 1000, 10) > jwtExpireTime
    );
  }
  return false;
};

// create random password token for forgetful user :)
userSchema.methods.createPasswordResetToken = function () {
  // create random pass token
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // set expire time for that token
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// insert value of passwordChangedAt after changing pass automatically
userSchema.pre('save', function (next) {
  if (!this.isModified('password') && this.isNew) return next();
  // * add -1000 because of passwordChangedAt can be update after set Token (JWT) for intenet slow speed
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;
