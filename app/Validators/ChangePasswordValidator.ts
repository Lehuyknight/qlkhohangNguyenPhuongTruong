import { schema as Schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CustomReporter } from 'App/Validators/Reporter/CustomReporter'

export default class ChangePasswordValidator {
    constructor(protected ctx: HttpContextContract) {}

    public reporter = CustomReporter
    public schema = Schema.create({
        oldPassword: Schema.string({ trim: true }, [
            rules.minLength(6),
            rules.maxLength(50)
        ]),
        newPassword: Schema.string({ trim: true }, [
            rules.minLength(6),
            rules.maxLength(50),
        ]),
    })

    /**
     * Custom messages for validation failures. You can make use of dot notation `(.)`
     * for targeting nested fields and array expressions `(*)` for targeting all
     * children of an array. For example:
     *
     * {
     *   'profile.username.required': 'Username is required',
     *   'scores.*.number': 'Define scores as valid numbers'
     * }
     *
     */
    public messages = {
      required: '{{ field }} không được bỏ trống',
        'newPassword.minLength': 'Mật khẩu tối thiểu 6 ký tự',
        'newPassword.maxLength': 'Mật khẩu tối đa 50 ký tự',
    }
}
