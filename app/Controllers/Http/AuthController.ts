import * as Admin from 'firebase-admin/auth'
import * as App from 'firebase-admin'
import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import ResponseService from 'App/Services/ResponseService'
import RegisterValidator from 'App/Validators/RegisterValidator'
import { validator, rules, schema as Schema } from '@ioc:Adonis/Core/Validator'
const serviceAccount = require('App/utils/qlkh-service.json')
const app = App.initializeApp({
    credential: App.credential.cert(serviceAccount),
})
const rps = new ResponseService()

export default class AuthController {
    // đăng kí
    public async register({ request, response }: HttpContextContract) {
        try {
            const data = await request.validate(RegisterValidator)

            const user = await User.create({
                name: data.name,
                phone: data.phone,
                password: data.password,
            })
            return rps.responseWithCustomMessage(
                response,
                201,
                user,
                true,
                'Đăng kí thành công'
            )
        } catch (error) {
            return rps.responseWithCustomMessage(
                response,
                400,
                error.messages.errors,
                false,
                'Đăng kí thất bại'
            )
        }
    }

    //register with firebase

    // public async register({ request, response, auth }: HttpContextContract) {
    //     const uid = request.input('uid')
    //     const getAuth = await Admin.getAuth(app).getUser(uid)
    //     const user = getAuth.toJSON()
    //     const phone = user['phoneNumber'].replace('+84', '0')
    //     const name = request.input('name')
    //     const password = request.input('password')
    //     try {
    //         const val = await validator.validate({
    //             schema: Schema.create({
    //                 uid: Schema.string({ trim: true }),
    //                 name: Schema.string({ trim: true }),
    //                 phone: Schema.string([
    //                     rules.unique({ table: 'users', column: 'phone' }),
    //                     rules.mobile(),
    //                 ]),
    //                 password: Schema.string({}, [
    //                     rules.minLength(6),
    //                     rules.maxLength(50),
    //                 ]),
    //             }),
    //             data: {
    //                 uid,
    //                 name,
    //                 phone,
    //                 password,
    //             },
    //         })
    //         const user = await User.create({
    //             name: val.name,
    //             password: val.password,
    //             phone: val.phone
    //         })
    //         const token = await auth.use('api').attempt(val.phone, val.password)
    //         return rps.responseWithCustomMessage(response, 201, {
    //             user:user,
    //             token:token.token
    //         },
    //         true,
    //         'Đăng kí thành công ')
    //     } catch (err) {
    //         return rps.responseWithCustomMessage(response, 400, err, false, 'Tạo tài khoản thất bại')
    //     }
    // }

    //đăng nhập
    public async login({ auth, request, response }: HttpContextContract) {
        const phone = request.input('phone')
        const password = request.input('password')
        try {
            const token = await auth.use('api').attempt(phone, password)
            const user = await User.findBy('phone', phone)
            return rps.responseWithCustomMessage(
                response,
                200,
                { token: token.token, user: user},
                true,
                'Đăng nhập thành công'
            )
        } catch (error) {
            return rps.responseWithCustomMessage(
                response,
                400,
                error,
                false,
                'Thông tin đăng nhập không chính xác'
            )
        }
    }

    //sửa thông tin
    public async changeInfo({
        request,
        response,
        params,
    }: HttpContextContract) {
        const body = request.body()
        try {
            const user = await User.findOrFail(params.id)
            user.name = body.name
            user.password = body.password
            await user.save()
            return response.status(200).json({
                body,
                message: 'thay đổi thông tin thành công',
            })
        } catch (error) {
            return response.status(400).json({
                message: 'Không tìm thấy thông tin',
            })
        }
    }

    //change pass
    public async changePassword({
        request,
        response,
        auth,
    }: HttpContextContract) {
        const user = await auth.use('api').user!
        const oldPass = request.input('oldPassword')
        const password = request.input('password')
        if (await Hash.verify(user.password, oldPass)) {
            await user.merge({ password: password }).save()
            return response.status(200).json({
                user,
                message: 'Đổi mật khẩu thành công',
            })
        } else {
            return response.status(400).json({
                message: 'Mật khẩu cũ không chính xác',
            })
        }
    }

    //logout
    public async logout({ response, auth }: HttpContextContract) {
        //revoke token
        const check = await auth.use('api').isLoggedIn
        if (check) {
            const userId = await auth.use('api').user?.id!
            await auth.use('api').revoke()
            await Database.from('user_tokens').delete().where('user_id', userId)
            return rps.responseWithCustomMessage(
                response,
                200,
                null,
                true,
                `Đăng xuất thành công`
            )
        } else {
            return rps.responseWithCustomMessage(
                response,
                401,
                null,
                false,
                `Đã đăng xuất`
            )
        }
    }
}
