const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth')

module.exports = async (req, res, next) => {
	const accessToken = req.headers['x-access-token']

	if (!accessToken) {
		return res.status(401).json({ error: 'Token not provided' });
	}

	const { secret } = authConfig

	jwt.verify(accessToken, secret, function(err, decoded) {
		if (err) {
			return res.status(500).json({ msg: 'Invalid token' })
		}
		req.playerId = decoded.playerId
		return next()
	})
}
