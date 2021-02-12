const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Joi = require('joi')
const knex = require('../database/knex')
const authConfig = require('../config/auth')
const { emailConstraint, passwordConstraint } = require('../util/body-constraints')

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
	const [player] = await knex('players').where({ email })

	if (!player) {
		return res.status(404).json({ msg: 'Email not registered' })
	}

	const hash = player.password
	const passwordCorrect = await bcrypt.compare(password, hash)

	if (!passwordCorrect) {
		return res.status(401).json({ msg: 'Incorrect password' })
	}

	const { playerId } = player

	const { secret, expiresIn } = authConfig

	const token = jwt.sign({ playerId }, secret, { expiresIn })

	return res.status(201).json({ playerId, token })
}
