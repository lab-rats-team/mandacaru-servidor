const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Joi = require('joi')
const knex = require('../database/knex')
const authConfig = require('../config/auth')
const responseMessages = require('../util/response-messages')

exports.create = async (req, res) => {
	const { language } = req

	const schema = Joi.object({
		email: Joi.string().email().required()
			.messages({
				'string.base': responseMessages.FIELD_HAS_TO_BE_A_STRING[language],
				'string.empty': responseMessages.FIELD_CANT_BE_EMPTY[language],
				'string.email': responseMessages.INVALID_EMAIL[language],
				'any.required': responseMessages.FIELD_IS_REQUIRED[language],
			}),
		password: Joi.string().min(6).required()
			.messages({
				'string.base': responseMessages.FIELD_HAS_TO_BE_A_STRING[language],
				'string.empty': responseMessages.FIELD_CANT_BE_EMPTY[language],
				'string.min': responseMessages.PASSWORD_MIN_LENGTH[language],
				'any.required': responseMessages.FIELD_IS_REQUIRED[language],
			}),
	})

	try { await schema.validateAsync(req.body) }
	catch (err) {
		const [{ message }] = err.details
		return res.status(422).json({ message })
	}

	const { email, password } = req.body
	const [player] = await knex('players').where({ email })

	if (!player) {
		return res.status(404).json({
			message: responseMessages.EMAIL_NOT_REGISTERED[language]
		})
	}

	const hash = player.password
	const passwordCorrect = await bcrypt.compare(password, hash)

	if (!passwordCorrect) {
		return res.status(401).json({
			message: responseMessages.INCORRECT_PASSWORD[language]
		})
	}

	const { playerId } = player

	const { secret, expiresIn } = authConfig

	const token = jwt.sign({ playerId }, secret, { expiresIn })

	return res.status(201).json({ playerId, token })
}
