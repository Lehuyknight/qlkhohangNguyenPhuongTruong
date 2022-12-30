import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Admin from 'App/Models/Admin'
import ResponseService from 'App/Services/ResponseService'
import CreateAdminValidator from 'App/Validators/CreateAdminValidator'

const rps = new ResponseService()
export default class AdminsController {
    //login
    public async login({ request, response, auth }: HttpContextContract) {
        const { username, password } = request.body()
        try {
            const token = await auth.use('admin').attempt(username, password)
            return rps.responseWithCustomMessage(
                response,
                200,
                { token: token.token },
                true,
                'Đăng nhập thành công '
            )
        } catch (err) {
            return rps.responseWithCustomMessage(
                response,
                400,
                err,
                false,
                'Thông tin đăng nhập không chính xác'
            )
        }
    }

    //signup
    public async register({
        request,
        response,
        bouncer,
        auth,
    }: HttpContextContract) {
        try{
            await bouncer.authorize('checkAdmin')
        }
        catch(err){
            return rps.responseWithCustomMessage(response, 401, err, false, 'Hãy đăng nhập vào tài khoản admin để tạo 1 tài khoản admin')
        }
        try{
            const val = await request.validate(CreateAdminValidator)
            const admin = await Admin.create({
                name: val.name,
                password: val.password,
                username: val.username,
                image: val.image!,
            })
            const token = await auth
                .use('admin')
                .attempt(val.username, val.password)
            return rps.responseWithCustomMessage(
                response,
                201,
                {
                    admin: admin,
                    token: token.token,
                },
                true,
                'Tạo tài khoản thành công '
            )
        }
        catch(err){
            return rps.responseWithCustomMessage(response, 400, err, false, 'Tạo tài khoản admin thất bại')
        }
        
    }
}
