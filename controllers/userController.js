const crypto = require('crypto');
const User = require('../models/userModel');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/email');
const signJwt = async (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_TOKEN_EXPIRE,
  });
};
const createSendToken = async (user, statusCode, res) => {
  const token = await signJwt(user._id);

  res.status(statusCode).json({
    status: 'success',
    token: token,
    data: user,
  });
};
exports.register = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    await createSendToken(newUser, 201, res);
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }).select('+password');

    if (!user) {
      throw new Error('کاربری بااین ایمیل یافت نشد');
    }

    const comparingPass = await user.comparePassword(password, user.password);
    if (!comparingPass) {
      throw new Error('رمز عبور وارد شده صحیح نمی باشد');
    }

    await createSendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    // 1. check exist tocken by header authorization
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      throw new Error('شما لاگین نیستید');
    }

    // 2. check structure of token (verification)
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET_KEY,
    );

    // 3. check exist still user
    const checkedUser = await User.findOne({ _id: decoded.id });

    if (!checkedUser) {
      throw new Error('رمز عبور وارد شده صحیح نمی باشد');
    }

    // 4. Check if user changed password after the token was issued
    if (await checkedUser.checkChangePassAfter(decoded.iat)) {
      throw new Error('رمز عبور شما تغییر کرده! لطفا دوباره وارد شوید');
    }

    req.user = checkedUser;

    next();
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    try {
      console.log(roles);
      if (!roles.includes(req.user.role)) {
        throw new Error('شما دسترسی ندارید');
      }

      next();
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
};

exports.forgetPassword = async (req, res, next) => {
  // 1. find user email in db
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new Error('کاربری با این ایمیل یافت نشد');
  }
  // 2. create random pass token and save it in db
  const resetToken = user.createPasswordResetToken();

  // * validateBeforeSave use for stop all schema validation because of stop all required filed before seving reset pass token in db
  await user.save({ validateBeforeSave: false });

  // 3. send that pass to user

  try {
    const resetPassTokenUrl = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`;

    await sendEmail({
      email: user.email,
      subject:
        '(این رمز پس از 10 دقیقه منقضی خواهد شد) یک رمز عبور موقت برایتان ایجاد شده است',
      message: `رمز عبور خود را فراموش کرده ای؟ رمز عبور جدید خود را از طریق نشانی زیر ارسال کنید:\n ${resetPassTokenUrl}\n درصوزتی که رمز عبورتان را به خاطر دارید این پیغام را نادیده بگیرید.`,
    });

    res.status(200).json({
      status: 'success',
      message: 'رمز عبور موقتی به ایمیل شما ارسال شد',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({
      status: 'fail',
      message: 'خطایی در ارسال ایمیل رخ داد',
    });
  }
};
exports.resetPassword = async (req, res, next) => {
  try {
    // 1. get user token and check expire of token, if not expired set new password for user
    const hashedTpken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedTpken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('رمز عبور موقتی وجود ندارد یا منقضی شده');
    }

    // 2. set new password for user

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // 3. update passwordChangedAt

    // create step 3 in userModle by automatically way with pre middleware

    // 4. set token (JWT)
    await createSendToken(user, 200, res);
  } catch (error) {
    res.status(401).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.updateMyPassword = async (req, res, next) => {
  try {
    // 1. get user from db by id
    const user = await User.findById(req.user.id).select('+password'); // req.user come in from protect step

    // 2. check similarity of entered pass and db pass
    const comparedPasses = await user.comparePassword(
      req.body.passwordCurrent,
      user.password,
    );
    if (!comparedPasses) {
      throw new Error('رمز عبور فعلی اشتباه است');
    }
    // 3. update pass
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'رمز عبور با موفقیت تغییر کرد',
    });
    // 4. set token (JWT)
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    // 1. check the req dose not includ pass or if includ say update pass url
    if (req.body.password || req.body.passwordConfirm) {
      throw new Error(
        'این نشانی برای تغییر رمز عبور نیست، برای تغییر رمز عبور به آدرس /upadteMyPassword مراجعه کنید',
      );
    }
    // 2. update user
    const filterObj = async (obj, ...filterItems) => {
      const newObj = {};
      Object.keys(obj).forEach((item) => {
        if (filterItems.includes(item)) {
          newObj[item] = obj[item];
        }
      });

      return newObj;
    };

    const filteredBodyIltem = await filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBodyIltem,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};
exports.getMyAccount = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    res.status(200).json({
      status: 'fail',
      message: error.message,
    });
  }
};
exports.getAdminAccount = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    res.status(200).json({
      status: 'fail',
      message: error.message,
    });
  }
};
