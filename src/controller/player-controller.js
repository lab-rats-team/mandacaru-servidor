const bcrypt = require('bcryptjs')
const Joi = require('joi')
const knex = require('../database/knex')
const maxSaves = require('../config/max-saves')
const { emailConstraint, passwordConstraint } = require('../util/body-constraints')

exports.list = async (req, res) => {
	const players = await knex('players')
	return res.status(200).json(players)
}

exports.create = async (req, res) => {
	const schema = Joi.object({
		email: emailConstraint,
		password: passwordConstraint
	})

	try { await schema.validateAsync(req.body) }
	catch (err) {
		return res.status(422).json({ msg: err.details[0].message })
	}

	const { email, password } = req.body

	if ((await knex('players').where({ email }).limit(1)).length !== 0) {
		return res.status(409).json({ msg: 'Email already being used' });
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
