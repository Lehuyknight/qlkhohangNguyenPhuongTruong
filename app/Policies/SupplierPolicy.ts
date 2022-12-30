import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Supplier from 'App/Models/Supplier'
import User from 'App/Models/User'

export default class SupplierPolicy extends BasePolicy {
    public async view(user:User, supplier: Supplier){
        return supplier.shopId === user.id
    }
    public async fix(user:User, supplier: Supplier){
        return supplier.shopId === user.id
    }
    public async update(user:User, supplier: Supplier){
        return supplier.shopId === user.id
    }
    public async delete(user:User, supplier: Supplier){
        return supplier.shopId === user.id
    }
}