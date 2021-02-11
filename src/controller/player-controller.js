const knex = require('../database/knex')
const maxSaves = require('../config/max-saves')

exports.list = async (req, res) => {
	const players = await knex('players')
	return res.status(200).json(players)
}

exports.create = async (req, res) => {
	const { email, password } = req.body

	if ((await knex('players').where({ email }).limit(1)).length !== 0) {
		return res.status(409).json({ msg: 'Email already being used' });
	}

	const playerId = await knex.transaction(async (trx) => {
		const [playerId] = await trx('players').insert({ email, password })
		const saves = []
		for (let saveId = 1; saveId <= maxSaves; saveId++) {
			saves.push({ playerId, saveId, data: null })
		}
		await trx('saves').insert(saves)
		return playerId
	})
	return res.status(201).json({ playerId })
}
