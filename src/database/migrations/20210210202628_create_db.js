
exports.up = (knex) => {
	return knex.schema
		.createTable('players', (table) => {
			table.increments('playerId')
			table.string('email', 254).notNullable()
			table.string('password').notNullable()

			table.unique('email')
		})
		.createTable('saves', (table) => {
			table.integer('playerId').unsigned().notNullable()
			table.integer('saveId').unsigned().notNullable()
			table.text('data').nullable()

			table.primary(['playerId', 'saveId'])
			table.foreign('playerId').references('players.playerId')
		})
}

exports.down = (knex) => {
	return knex.schema
		.dropTable('saves')
		.dropTable('players')
}
