const joi = require('@hapi/joi');

const validateUserRegister = (data) => {
  const userRegisterSchema = joi.object().keys({
    name: joi
      .string()
      .min(6)
      .max(35)
      .required(),
    email: joi
      .string()
      .min(6)
      .max(255)
      .required(),
    password: joi
      .string()
      .min(8)
      .max(1024)
      .required(),
  });
  return joi.validate(data, userRegisterSchema);
};

const validateUserLogin = (data) => {
  const userLoginSchema = joi.object().keys({
    email: joi
      .string()
      .min(6)
      .max(255)
      .required(),
    password: joi
      .string()
      .min(8)
      .max(1024)
      .required(),
  });
  return joi.validate(data, userLoginSchema);
};

module.exports = {
  validateUserRegister,
  validateUserLogin,
};
