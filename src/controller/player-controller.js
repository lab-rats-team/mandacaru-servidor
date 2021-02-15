const bcrypt = require('bcryptjs')
const Joi = require('joi')
const knex = require('../database/knex')
const maxSaves = require('../config/max-saves')
const responseMessages = require('../util/response-messages')

exports.list = async (req, res) => {
	const players = await knex('players')
	return res.status(200).json(players)
}

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

	if ((await knex('players').where({ email }).limit(1)).length !== 0) {
		return res.status(409).json({
			message: responseMessages.EMAIL_ALREADY_BEING_USED[language]
		});
	}

	const salt = await bcrypt.genSalt()
	const hash = await bcrypt.hash(password, salt)

	const playerId = await knex.transaction(async (trx) => {
		const [playerId] = await trx('players').insert({ email, password: hash })
		const saves = []
		for (let saveId = 1; saveId <= maxSaves; saveId++) {
			saves.push({ playerId, saveId, data: null })
		}
		await trx('saves').insert(saves)
		return playerId
	})
	return res.status(201).json({ playerId })
}
