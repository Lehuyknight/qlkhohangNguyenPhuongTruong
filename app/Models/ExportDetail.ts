import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Export from './Export'

export default class ExportDetail extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public invoiceNumber: string

  @column()
  public productId: number

  @column()
  public qty: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Export,{
    localKey: 'invoiceNumber',
    foreignKey: 'invoiceNumber'
  })
  public ImportOrder: BelongsTo<typeof Export>


}
