import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Product from 'App/Models/Product';
import User from 'App/Models/User';

export default class ProductPolicy extends BasePolicy {
    public async view(user:User, product: Product){
        return product.shopId === user.id
    }
    public async fix(user:User, product:Product){
        return product.shopId === user.id
    }
    public async update(user:User, product:Product){
        return product.shopId === user.id
    }
    public async delete(user:User, product:Product){
        return user.id === product.shopId
    }
}