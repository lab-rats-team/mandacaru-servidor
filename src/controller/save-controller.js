const knex = require('../database/knex')
const maxSaves = require('../config/max-saves')

exports.list = async (req, res) => {
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
	const playerId = parseInt(req.params.playerId)
	const saveId = parseInt(req.params.saveId)
	const { data } = req.body

	if (playerId !== req.playerId) {
		return res.status(401).json({ msg: 'Unauthorized' })
	}

	const [player] = await knex('players').where({ playerId }).limit(1)

	if (player === undefined) {
		return res.status(404).json({ msg: 'Inexistent player' })
	}

	if (saveId < 1 || saveId > maxSaves) {
		return res.status(422).json({ msg: 'Invalid saveId' })
	}

	if (!(await knex('saves').where({ playerId, saveId }).update({ data }))) {
		return res.status(500).json({ msg: 'Failed to update save in database' })
	}
	return res.status(204).json()
}

exports.erase = async (req, res) => {
	const playerId = parseInt(req.params.playerId)
	const saveId = parseInt(req.params.saveId)

	if (playerId !== req.playerId) {
		return res.status(401).json({ msg: 'Unauthorized' })
	}

	const [player] = await knex('players').where({ playerId }).limit(1)

	if (player === undefined) {
		return res.status(404).json({ msg: 'Inexistent player' })
	}

	if (saveId < 1 || saveId > maxSaves) {
		return res.status(422).json({ msg: 'Invalid saveId' })
	}

	if (!(await knex('saves').where({ playerId, saveId }).update({ data: null }))) {
		return res.status(500).json({ msg: 'Failed to erase save from database' })
	}

	return res.status(204).json()
}
