const Joi = require("joi");
module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().trim().required(),
        description: Joi.string().allow("").optional(),
        image: Joi.object({
            url: Joi.string().uri().allow("").optional()
        }).optional(),
        price: Joi.number().min(0).required(),
        location: Joi.string().trim().required(),
        country: Joi.string().trim().required(),
    }).required()
});