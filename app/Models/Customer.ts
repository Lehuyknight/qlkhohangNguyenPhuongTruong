import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable  } from '@ioc:Adonis/Addons/LucidFilter'
import CustomerFilter from './Filters/CustomerFilter'

export default class Customer extends compose (BaseModel, Filterable){

  public static $filter = () => CustomerFilter
  
  @column({ isPrimary: true })
  public id: number

  @column()
  public shopId: number

  @column()
  public name: string

  @column()
  public phone: string

  @column()
  public address: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

}
