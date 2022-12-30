import { schema as Schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CustomReporter } from './Reporter/CustomReporter'

export default class CreateTakeInValidator {
  constructor(protected ctx: HttpContextContract) {}

  public reporter = CustomReporter
  
  public schema = Schema.create({
    invoiceNumber: Schema.string({trim:true}),
    productId: Schema.number([
      rules.unsigned()
    ]),
    customerId: Schema.number([
      rules.unsigned()
    ]),
    amount: Schema.number([
      rules.unsigned()
    ]) 
 })

  public messages = {
    required: '{{field}} không được để trống',
    'productId.unsigned': 'Sản phẩm không hợp lệ',
    'customer.unsigned': 'Khách hàng không hợp lệ',
    'amount.unsigned': 'Số tiền không hợp lệ'
  }
}
