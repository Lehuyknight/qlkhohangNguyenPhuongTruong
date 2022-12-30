import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Roles from 'App/Enums/roles'

export default class extends BaseSchema {
    protected tableName = 'users'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.string('name', 255).notNullable()
            table.string('phone', 20).notNullable().unique()
            table.string('password', 50).notNullable()
            table.string('remember_me_token').nullable()
            table
                .integer('role_id')
                .unsigned()
                .references('id')
                .inTable('roles')
                .defaultTo(Roles.USER)
            table.text('image').defaultTo('http://via.placeholder.com/50x50')

            /**
             * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamp('created_at', { useTz: true }).notNullable()
            table.timestamp('updated_at', { useTz: true }).notNullable()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
