import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Customer from 'App/Models/Customer'

export default class CustomerFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Customer, Customer>

  // public method (value: any): void {
  //   this.$query.where('name', value)
  // }
  public static blacklist: string[] = ["secretMethod"]
  name(name: string) {
    this.$query.where((builder) =>{
      builder.where("name",'LIKE', `%${name}%`)
    })
  }
  phone(phone: string){
    this.$query.where((builder) => {
      builder.where("phone","LIKE",`%${phone}%`)
    })
  }
}
