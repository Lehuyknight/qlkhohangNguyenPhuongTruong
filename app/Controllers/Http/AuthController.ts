import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import ResponseService from 'App/Services/ResponseService'
import RegisterValidator from 'App/Validators/RegisterValidator'

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

    //đăng nhập
    public async login({ auth, request, response }: HttpContextContract) {
        const phone = request.input('phone')
        const password = request.input('password')
        try {
            const token = await auth.use('api').attempt(phone, password)
            return rps.responseWithCustomMessage(
                response,
                200,
                { token: token.token },
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
    public async logout({response, auth}:HttpContextContract){
         //revoke token
         const check = await auth.use('api').isLoggedIn
         if (check) {
             const userId = await auth.use('api').user?.id!
             await auth.use('api').revoke()
             await Database.from('user_tokens').delete().where('user_id', userId)
             return rps.responseWithCustomMessage(response, 200, null, true, `Đăng xuất thành công`)
         } else {
             return rps.responseWithCustomMessage(response, 401, null, false, `Đã đăng xuất`)
         }
    }
}
