import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'
import User from 'App/Models/User'

export default class UsersController {
    public async manage({}: HttpContextContract){
        const users = await User.query().orderBy("phone")

        const roles = await Role.query().orderBy("name")

        console.log(users, roles)
    }
    public async role({request, response,params}: HttpContextContract){
        
    }
}
