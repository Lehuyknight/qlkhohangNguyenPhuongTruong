import { validator } from '@ioc:Adonis/Core/Validator'
import Customer from 'App/Models/Customer';
import Product from 'App/Models/Product';

validator.rule('checkMobile', async (value, _, options) => {
    if (typeof value !== 'string') {
        return
    }

    //find user with ref code
    const user = await Customer.findBy('mobile', value);
    if (user === null) {
      options.errorReporter.report(
          options.pointer,
          'checkRefCode',
          'checkRefCode validation failed',
          options.arrayExpressionPointer
      )
    }
})

validator.rule('checkCustomer', async(value, _, options) => {
    if(typeof value !== 'number'){
        return
    }

    const customer = await Customer.find(value)
    if(customer === null){
        options.errorReporter.report(
            options.pointer,
            'checkCustomer',
            'checkCustomer validation failed',
            options.arrayExpressionPointer
        )
    }
})


validator.rule('checkProduct', async(value, _, options) => {
    if(typeof value !== 'number'){
        return
    }

    const product = await Product.find(value)
    if(product === null){
        options.errorReporter.report(
            options.pointer,
            'checkProduct',
            'checkProduct validation failed',
            options.arrayExpressionPointer
        )
    }
})
