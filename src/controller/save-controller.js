const knex = require('../database/knex')
const Joi = require('joi')
const { saveDataConstraint } = require('../util/body-constraints')
const maxSaves = require('../config/max-saves')

exports.list = async (req, res) => {
	if (!/^[1-9]{1}[0-9]*$/.test(req.params.playerId)) {
		return res.status(422).json({ msg: 'playerId must be a positive a positive integer' })
	}

	const playerId = parseInt(req.params.playerId)

	if (playerId !== req.playerId) {
		return res.status(401).json({ msg: 'Unauthorized' })
	}

	const [player] = await knex('players').where({ playerId }).limit(1)

	if (player === undefined) {
		return res.status(404).json({ msg: 'Inexistent player' })
	}

	const saves = await knex('saves').where({ playerId }).select('saveId', 'data')

	return res.status(200).json(saves)
}

exports.update = async (req, res) => {
	if (!/^[1-9]{1}[0-9]*$/.test(req.params.playerId)) {
		return res.status(422).json({ msg: 'playerId must be a positive integer' })
	}
	if (!/^[1-9]{1}[0-9]*$/.test(req.params.saveId)) {
		return res.status(422).json({ msg: 'saveId must be a positive integer' })
	}

	const playerId = parseInt(req.params.playerId)
	const saveId = parseInt(req.params.saveId)

	if (saveId < 1 || saveId > maxSaves) {
		return res.status(422).json({ msg: 'saveId out of range' })
	}

	const schema = Joi.object({ data: saveDataConstraint })

	try { await schema.validateAsync(req.body) }
	catch (err) {
		return res.status(422).json({ msg: err.details[0].message })
	}

	const { data } = req.body

	if (playerId !== req.playerId) {
		return res.status(401).json({ msg: 'Unauthorized' })
	}

	const [player] = await knex('players').where({ playerId }).limit(1)

	if (player === undefined) {
		return res.status(404).json({ msg: 'Inexistent player' })
	}

	if (!(await knex('saves').where({ playerId, saveId }).update({ data }))) {
		return res.status(500).json({ msg: 'Failed to update save in database' })
	}
	return res.status(204).json()
}

exports.erase = async (req, res) => {
	if (!/^[1-9]{1}[0-9]*$/.test(req.params.playerId)) {
		return res.status(422).json({ msg: 'playerId must be a positive integer' })
	}
	if (!/^[1-9]{1}[0-9]*$/.test(req.params.saveId)) {
		return res.status(422).json({ msg: 'saveId must be a positive integer' })
	}

	const playerId = parseInt(req.params.playerId)
	const saveId = parseInt(req.params.saveId)

	if (saveId < 1 || saveId > maxSaves) {
		return res.status(422).json({ msg: 'saveId out of range' })
	}

	if (playerId !== req.playerId) {
		return res.status(401).json({ msg: 'Unauthorized' })
	}

	const [player] = await knex('players').where({ playerId }).limit(1)

	if (player === undefined) {
		return res.status(404).json({ msg: 'Inexistent player' })
	}

	if (!(await knex('saves').where({ playerId, saveId }).update({ data: null }))) {
		return res.status(500).json({ msg: 'Failed to erase save from database' })
	}

	return res.status(204).json()
}
