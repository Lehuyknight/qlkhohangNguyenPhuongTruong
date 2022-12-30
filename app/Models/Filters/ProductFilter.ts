import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Product from 'App/Models/Product'

export default class ProductFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Product, Product>

  // public method (value: any): void {
  //   this.$query.where('name', value)
  // }
  public static blacklist: string[] = ['secretMethod']
  name(name: string) {
    this.$query.where((builder) =>{
      builder.where("name",'LIKE', `%${name}%`)
    })
  }
}
