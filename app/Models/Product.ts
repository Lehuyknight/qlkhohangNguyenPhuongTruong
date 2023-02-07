import { DateTime } from 'luxon'
import {
    BaseModel,
    column,
    HasMany,
    hasMany,
    HasOne,
    hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'
import Order from './Order'
import Takein from './Import'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import ProductFilter from './Filters/ProductFilter'
import User from './User'

export default class Product extends compose(BaseModel, Filterable) {
    public static $filter = () => ProductFilter

    @column({ isPrimary: true })
    public id: number

    @column()
    public shopId: number

    @column()
    public categoryId: number

    @column()
    public name: string

    @column()
    public sku: string

    @column()
    public upcCode: string

    @column()
    public description: string | null

    @column()
    public price: number

    @column()
    public inStock: number

    @column()
    public image: string | null

    @column()
    public unit: string

    @column()
    public status: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @hasOne(() => Category)
    public category: HasOne<typeof Category>

    @hasOne(() => User, {
        foreignKey: 'shopId',
    })
    public users: HasOne<typeof User>

    public static generateSku(shopId, name: string):string{
        return `PROD-${shopId}${name.substring(0, 2)s}`
    }
}
