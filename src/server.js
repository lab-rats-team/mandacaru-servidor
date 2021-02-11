require('dotenv').config()
const express = require('express')
const routes = require('./routes')

const app = express()

app.use(express.json())

app.use(routes)

app.use((err, req, res, next) => {
	res.status(500).send('Internal server error');
})

app.listen(process.env.PORT || 3000, () => {
	console.log('Server running')
})
