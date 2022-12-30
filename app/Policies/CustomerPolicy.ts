import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import Customer from 'App/Models/Customer'
import User from 'App/Models/User'

export default class CustomerPolicy extends BasePolicy {
    public async view(user: User, customer: Customer) {
        return customer.shopId === user.id
    }
    public async fix(user: User, customer: Customer) {
        return customer.shopId === user.id
    }
    public async update(user: User, customer: Customer){
        return customer.shopId === user.id
    }
    public async delete(user: User, customer: Customer){
        return customer.shopId === user.id
    }
}
