import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Product from './Product'
import Customer from './Customer'
import {compose} from '@ioc:Adonis/Core/Helpers'
import { Filterable  } from '@ioc:Adonis/Addons/LucidFilter'
import OrderFilter from './Filters/OrderFilter'
import User from './User'

export default class Order extends compose (BaseModel, Filterable){

  public static $filter = () => OrderFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public invoiceNumber: string

  @column()
  public shopId:number

  @column()
  public productId: number

  @column()
  public customerId: number

  @column()
  public amount: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Product)
  public products:HasOne<typeof Product>

  @hasOne(() => Customer)
  public customers:HasOne<typeof Customer>

  @hasOne(() => User)
  public users: HasOne<typeof User>
}
