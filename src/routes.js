const express = require('express')
const authMiddleware = require('./middleware/auth')
const playerController = require('./controller/player-controller')
const saveController = require('./controller/save-controller')
const sessionController = require('./controller/session-controller')

const routes = express.Router()

routes.get('/players', playerController.list)
routes.post('/players', playerController.create)

routes.post('/sessions', sessionController.create)

routes.use(authMiddleware)

routes.get('/players/:playerId/saves', saveController.list)
routes.put('/players/:playerId/saves/:saveId', saveController.update)
routes.delete('/players/:playerId/saves/:saveId', saveController.erase)

module.exports = routes
