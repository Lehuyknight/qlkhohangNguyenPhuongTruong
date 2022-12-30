import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import ExportDetail from './ExportDetail'
import User from './User'
import Customer from './Customer'

export default class Export extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  
  @column()
  public invoiceNumber: string
  
  @column()
  public shopId: number
  
  @column()
  public customerId: number
  
  @column()
  public total: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignInvoiceNumber(exportInstance: Export){
    const date = DateTime.now()
    exportInstance.invoiceNumber = `OUT-${date.year}${date.month}${date.day}${date.weekdayShort}${date.hour}${date.minute}${date.second}${date.millisecond}`
  }

  @hasMany(() => ExportDetail, {
    localKey: 'invoiceNumber',
    foreignKey: 'invoiceNumber'
  })
  public exportDetails: HasMany<typeof ExportDetail>

  @hasOne(() => User,{
    foreignKey:'shopId'
  })
  public shop: HasOne<typeof User>
  
  @hasOne(() => Customer)
  public customer: HasOne<typeof Customer>

}
