import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Category from 'App/Models/Category'

export default class CategoryFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Category, Category>

  // public method (value: any): void {
  //   this.$query.where('name', value)
  // }
  name(name:string){
    this.$query.whereILike('name', `%${name}%`)
  }
}
