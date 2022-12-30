import { schema as Schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CustomReporter } from './Reporter/CustomReporter'
export default class UpdateSupplierValidator {
  constructor(protected ctx: HttpContextContract) {}

  public reporter = CustomReporter
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
  public schema = Schema.create({
    name: Schema.string.nullableAndOptional({trim: true}),
    phone: Schema.string.nullableAndOptional({trim: true}, [
      rules.mobile()
    ]),
    taxCode: Schema.string.nullableAndOptional({trim: true}),
    address: Schema.string.nullableAndOptional({trim: true}),
    status: Schema.enum.nullableAndOptional(['active', 'in_active']),
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
    'phone.mobile': 'Số điện thoại không hợp lệ',
    'status.enum': 'Trạng thái không hợp lệ'
  }
}
