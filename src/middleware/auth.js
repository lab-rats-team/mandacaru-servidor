const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth')
const responseMessages = require('../util/response-messages')

module.exports = async (req, res, next) => {
	const accessToken = req.headers['x-access-token']

	if (!accessToken) {
		return res.status(422).json({
			message: responseMessages.MISSING_ACCESS_TOKEN[language]
		})
	}

	const { secret } = authConfig

	jwt.verify(accessToken, secret, function(err, decoded) {
		if (err) {
			return res.status(401).json({
				message: responseMessages.INVALID_ACCESS_TOKEN[language]
			})
		}
		req.playerId = decoded.playerId
		return next()
	})
}
