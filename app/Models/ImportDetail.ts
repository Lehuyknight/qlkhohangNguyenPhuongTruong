import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Import from './Import'
import Product from './Product'

export default class ImportDetail extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public invoiceNumber: string

  @column()
  public upcCode: string

  @column()
  public qty: number

  @column()
  public unitPrice: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Import,{
    localKey: 'invoiceNumber',
    foreignKey: 'invoiceNumber'
  })
  public ImportOrder: BelongsTo<typeof Import>

  @belongsTo(() => Product,{
    localKey: 'upcCode',
    foreignKey: 'upcCode'
  })
  public product: BelongsTo<typeof Product>
}
