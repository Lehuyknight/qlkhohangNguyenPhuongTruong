import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Order from 'App/Models/Order'

export default class OrderFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Order, Order>

  // public method (value: any): void {
  //   this.$query.where('name', value)
  // }
  public static blacklist: string[] = ["secretMethod"]
  invoice(invoiceNumber: string) {
    this.$query.where((builder) =>{
      builder.where("invoiceNumber","LIKE",`%${invoiceNumber}%`)
    })
  }
}
