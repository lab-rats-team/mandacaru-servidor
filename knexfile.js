module.exports = {
	development: {
		client: 'sqlite3',
		connection: {
			filename: './dev.sqlite3',
		},
		migrations: {
			directory: './src/database/migrations',
			tableName: 'migrations',
		},
		useNullAsDefault: true,
	},
}
