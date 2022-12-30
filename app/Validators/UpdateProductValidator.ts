import { schema as Schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CustomReporter } from './Reporter/CustomReporter'

export default class UpdateProductValidator {
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
        name: Schema.string.nullableAndOptional({ trim: true }),
        sku: Schema.string.nullableAndOptional({ trim: true }, [
            rules.unique({ table: 'products', column: 'sku' }),
        ]),
        upcCode: Schema.string.nullableAndOptional({ trim: true }, [
            rules.regex(/^[0-9]+$/),
            rules.minLength(12),
            rules.maxLength(12),
        ]),
        description: Schema.string.nullableAndOptional({ trim: true }),
        price: Schema.number.nullableAndOptional([rules.unsigned()]),
        inStock: Schema.number.nullableAndOptional([rules.unsigned()]),
        image: Schema.string.nullableAndOptional({ trim: true }),
        unit: Schema.string.nullableAndOptional({ trim: true }),
        status: Schema.enum.nullableAndOptional(['active', 'in_active']),
        categoryId: Schema.number.nullableAndOptional(),
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
        'sku.unique': 'SKU đã tồn tại',
        'upcCode.minLength': 'Barcode không hợp lệ, phải có 12 số',
        'upcCode.maxLength': 'Barcode không hợp lệ, phải có 12 số',
        'status.enum': 'Trạng thái không hợp lệ'
    }
}
