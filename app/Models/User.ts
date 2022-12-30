import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import Product from './Product'
import Order from './Order'
import Takein from './Import'



export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public roleId: number

  @column()
  public name: string

  @column()
  public phone: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column()
  public image: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @belongsTo(() => Role)
  public roles: BelongsTo<typeof Role>

  @hasMany(() => Product)
  public products: HasMany<typeof Product>

  @hasMany(() => Order)
  public orders: HasMany<typeof Order>

  @hasMany(() => Takein)
  public takeins: HasMany<typeof Takein>
}
