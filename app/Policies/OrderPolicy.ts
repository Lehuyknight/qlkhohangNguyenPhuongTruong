import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Order from 'App/Models/Order'

export default class OrderPolicy extends BasePolicy {
    public async fix(user: User, order: Order) {
        return order.shopId === user.id
    }
    public async view(user: User, order: Order) {
        return order.shopId === user.id
    }
    public async delete(user: User, order: Order) {
        return order.shopId === user.id
    }
}
