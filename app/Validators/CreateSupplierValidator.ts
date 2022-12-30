import { schema as Schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CustomReporter } from './Reporter/CustomReporter'
export default class CreateSupplierValidator {
  constructor(protected ctx: HttpContextContract) {}

  public reporter = CustomReporter
  
  public schema = Schema.create({
    name: Schema.string({trim: true}),
    phone: Schema.string({trim: true}, [
      rules.mobile()
    ]),
    taxCode: Schema.string({trim: true}, [
      rules.unique({table: 'suppliers', column: 'tax_code'})
    ]),
    address: Schema.string({trim: true}),
    status: Schema.enum(['active', 'in_active']),
})

  public messages = {
    required: '{{field}} không được để trống',
    'phone.mobile': 'Số điện thoại không hợp lệ',
    'status.enum': 'Trạng thái không hợp lệ',
    'taxCode.unique': 'Nhà cung cấp đã tồn tại'
  }
}
