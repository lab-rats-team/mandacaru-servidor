const Joi = require('joi')

exports.emailConstraint =
	Joi.string()
		.email()
		.required()
		.messages({
			'string.base': `Email must be a string`,
			'string.empty': `Email must not be empty`,
			'string.email': `Email must be valid`,
			'any.required': `Email is required`
		})

exports.passwordConstraint =
	Joi.string()
		.min(6)
		.required()
		.messages({
			'string.base': `Password must be a string`,
			'string.empty': `Password must not be empty`,
			'string.min': `Password must contain at least {#limit} characters`,
			'any.required': `Password is required`
	})

exports.saveDataConstraint =
	Joi.string()
		.required()
		.messages({
			'string.base': `Data must be a string`,
			'string.empty': `Data must not be empty`,
			'any.required': `Data is required`
		})

