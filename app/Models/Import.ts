import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Supplier from './Supplier'
import User from './User'
import ImportDetail from './ImportDetail'

export default class Import extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public invoiceNumber: string

  @column()
  public shopId: number

  @column()
  public supplierId: number

  @column()
  public total: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Supplier)
  public supplier:HasOne<typeof Supplier>

  @hasOne(() => User)
  public user:HasOne<typeof User>

  @hasMany(() => ImportDetail,{
    localKey:'invoiceNumber',
    foreignKey: 'invoiceNumber'
  })
  public importDetails: HasMany<typeof ImportDetail>

  @beforeCreate()
  public static assignInvoiceNumber(importInstance: Import){
    const date = DateTime.now()
    importInstance.invoiceNumber = `IN-${date.year}${date.month}${date.day}${date.weekdayShort}${date.hour}${date.minute}${date.second}${date.millisecond}`
  }
}
