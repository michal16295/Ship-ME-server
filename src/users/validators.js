const logger = require("../common/logger")(__filename);
const { validate } = require("../common/validator");
const Joi = require("joi");

const pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const jEmail = Joi.string().min(5).max(120).email({ minDomainSegments: 2 });
const jFirstName = Joi.string().min(1).max(50);
const jLastName = Joi.string().min(1).max(50);
const jPassword = Joi.string().min(8).max(20).regex(pattern);
const jConfirmPass = Joi.string().min(8).max(20).regex(pattern);

module.exports.register = (req, res, next) => {
  logger.debug("register validataion");
  const schema = Joi.object({
    email: jEmail.required(),
    password: jPassword.required(),
    firstName: jFirstName.required(),
    lastName: jLastName.required(),
    confirmPassword: jConfirmPass.required(),
  });

  validate(schema, req.body, res, next);
};
