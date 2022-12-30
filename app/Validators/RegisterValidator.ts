import { rules, schema as Schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CustomReporter } from 'App/Validators/Reporter/CustomReporter'

export default class RegisterValidator {
    constructor(protected ctx: HttpContextContract) {}

    public reporter = CustomReporter

    public schema = Schema.create({
        name: Schema.string(),
        phone: Schema.string([
            rules.unique({ table: 'users', column: 'phone' }),
            rules.mobile(),
        ]),
        password: Schema.string({}, [
            rules.minLength(6),
            rules.maxLength(50),
        ])
    })

    public messages = {
        required: 'Trường {{ field }} không được bỏ trống',
        'phone.mobile': 'Số điện thoại không đúng định dạng',
        'phone.unique': 'Số điện thoại đã được sử dụng',
        'password.minLength': 'Mật khẩu tối thiểu 6 ký tự',
        'password.maxLength': 'Mật khẩu tối đa 50 ký tự',
      }
}
