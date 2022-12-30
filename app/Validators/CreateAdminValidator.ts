import { rules, schema as Schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CustomReporter } from './Reporter/CustomReporter'

export default class CreateAdminValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public reporter = CustomReporter
  public schema = Schema.create({
    name: Schema.string({trim: true}, [
      rules.maxLength(100)
    ]),
    username: Schema.string({trim: true},[
      rules.maxLength(20),
      rules.unique({table: 'admins', column: 'username'})
    ]),
    password: Schema.string({trim: true},[
      rules.minLength(6),
      rules.maxLength(22)
    ]),
    image: Schema.string.nullableAndOptional({trim:true})
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
    required: '{{field}} không được để trống',
    'username.maxLength': 'Tên đăng nhập không được vượt quá 20 kí tự',
    'username.unique': 'Tên đăng nhập đã tồn tại',
    'password.minLength': 'Mật khẩu phải lớn hơn 6 kí tự',
    'password.maxLength': 'Mật khẩu không dài quá 22 kí tự',
    'name.maxLength': 'Tên không dài quá 100 kí tự'
  }
}
