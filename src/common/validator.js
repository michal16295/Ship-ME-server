const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports.validate = (schema, value, res, next) => {
    let valid = this.validateSchema(schema, value, res);
    if (valid)
        next();
}

module.exports.validateSchema = (schema, value, res) => {
    const { error } = schema.validate(value);
    if (error) {
        res.status(400).send({ error: error.details[0].message });
        return false;
    }
    return true;
}

module.exports.validatePathId = (req, res, next) => {
    const jId = Joi.objectId();
    logger.debug('validatePathId');
    const schema = Joi.object({
        id: jId.required(),
    });

    this.validate(schema, req.params, res, next);
}
module.exports.jObjectId = Joi.objectId();