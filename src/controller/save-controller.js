const knex = require('../database/knex')
const Joi = require('joi')
const responseMessages = require('../util/response-messages')
const MAX_SAVES = require('../config/max-saves')

exports.list = async (req, res) => {
	const { language } = req

	if (!/^[1-9]{1}[0-9]*$/.test(req.params.playerId)) {
		return res.status(422).json({
			message: responseMessages.PLAYER_ID_MUST_BE_A_POSITIVE_INTEGER[language]
		})
	}

	const playerId = parseInt(req.params.playerId)

	if (playerId !== req.playerId) {
		return res.status(403).json({ msg: 'Forbidden' })
	}

	const [player] = await knex('players').where({ playerId }).limit(1)

	if (player === undefined) {
		return res.status(404).json({ msg: 'Inexistent player' })
	}

	const saves = await knex('saves').where({ playerId }).select('saveId', 'data')

	return res.status(200).json(saves)
}

exports.update = async (req, res) => {
	const { language } = req

	if (!/^[1-9]{1}[0-9]*$/.test(req.params.playerId)) {
		return res.status(422).json({
			message: responseMessages.PLAYER_ID_MUST_BE_A_POSITIVE_INTEGER[language]
		})
	}
	if (!/^[1-9]{1}[0-9]*$/.test(req.params.saveId)) {
		return res.status(422).json({
			message: responseMessages.SAVE_ID_MUST_BE_A_POSITIVE_INTEGER[language]
		})
	}

	const playerId = parseInt(req.params.playerId)
	const saveId = parseInt(req.params.saveId)

	if (saveId < 1 || saveId > MAX_SAVES) {
		return res.status(422).json({
			message: responseMessages.SAVE_ID_OUT_OF_RANGE[language]
		})
	}

	const schema = Joi.object({
		data: Joi.string().required()
			.messages({
				'string.base': responseMessages.FIELD_HAS_TO_BE_A_STRING[language],
				'string.empty': responseMessages.FIELD_CANT_BE_EMPTY[language],
				'any.required': responseMessages.FIELD_IS_REQUIRED[language],
			})
	})

	try { await schema.validateAsync(req.body) }
	catch (err) {
		const [{ message }] = err.details
		return res.status(422).json({ message })
	}

	const { data } = req.body

	if (playerId !== req.playerId) {
		return res.status(403).json({
			message: responseMessages.FORBIDDEN[language]
		})
	}

	const [player] = await knex('players').where({ playerId }).limit(1)

	if (player === undefined) {
		return res.status(404).json({
			message: responseMessages.INEXISTENT_PLAYER[language]
		})
	}

	if (!(await knex('saves').where({ playerId, saveId }).update({ data }))) {
		return res.status(500).json({
			message: responseMessages.FAILED_TO_UPDATE_SAVE[language]
		})
	}
	return res.status(204).json()
}

exports.erase = async (req, res) => {
	const { language } = req

	if (!/^[1-9]{1}[0-9]*$/.test(req.params.playerId)) {
		return res.status(422).json({
			message: responseMessages.PLAYER_ID_MUST_BE_A_POSITIVE_INTEGER[language]
		})
	}
	if (!/^[1-9]{1}[0-9]*$/.test(req.params.saveId)) {
		return res.status(422).json({
			message: responseMessages.SAVE_ID_MUST_BE_A_POSITIVE_INTEGER[language]
		})
	}

	const playerId = parseInt(req.params.playerId)
	const saveId = parseInt(req.params.saveId)

	if (saveId < 1 || saveId > MAX_SAVES) {
		return res.status(422).json({
			message: responseMessages.SAVE_ID_OUT_OF_RANGE[language]
		})
	}

	if (playerId !== req.playerId) {
		return res.status(403).json({
			message: responseMessages.FORBIDDEN[language]
		})
	}

	const [player] = await knex('players').where({ playerId }).limit(1)

	if (player === undefined) {
		return res.status(404).json({
			message: responseMessages.INEXISTENT_PLAYER[language]
		})
	}

	if (!(await knex('saves').where({ playerId, saveId }).update({ data: null }))) {
		return res.status(500).json({
			message: responseMessages.FAILED_TO_ERASE_SAVE[language]
		})
	}

	return res.status(204).json()
}
