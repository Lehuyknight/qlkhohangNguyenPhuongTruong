import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Import from 'App/Models/Import'
import Product from 'App/Models/Product'
import CreateInvoiceService from 'App/Services/CreateInvoiceService'
import ResponseService from 'App/Services/ResponseService'
import CreateImportValidator from 'App/Validators/CreateImportValidator'

const rps = new ResponseService()
export default class ImportsController {
    //create import order
    public async importProduct({
        request,
        response,
        auth,
    }: HttpContextContract) {
        const user = await auth.use('api').user!
        const val = await request.validate(CreateImportValidator)
        if(val.supplierId === user.id){
            return rps.responseWithCustomMessage(
                response,
                400,
                null,
                false,
                `Không thể tự nhập hàng của chính mình`
            )
        }
        const newImport = await Import.create({
            shopId: user.id,
            supplierId: val.supplierId,
        })
        let total = 0
        for (let product of val.productList) {
            await newImport.related('importDetails').create({
                upcCode: product.upcCode,
                qty: product.qty,
                unitPrice: product.unitPrice,
            })
            total += product.qty * product.unitPrice
        }
        try {
            await newImport.merge({ total: total }).save()
            await newImport.load('importDetails')
            for (let product of val.productList) {
                const existProduct = await Product.query()
                    .select('*')
                    .where('shop_id', user.id)
                    .where('upc_code', product.upcCode)
                    .first()
                if (existProduct) {
                    existProduct.inStock += product.qty
                    await existProduct.save()
                } else {
                    await Product.create({
                        shopId: user.id,
                        upcCode: product.upcCode,
                        name: product.name,
                        sku: Product.generateSku(user.id, product.name, ),
                        inStock: product.qty,
                        price: product.unitPrice,
                        status: 'active',
                    })
                }
            }
            const exportData = {supplierId:val.supplierId, productList: val.productList, shopId:user.id }
            await CreateInvoiceService.createExportInvoice(exportData)
            return rps.responseWithCustomMessage(
                response,
                201,
                newImport,
                true,
                `Nhập hàng thành công `
            )
        } catch (err) {
            return rps.responseWithCustomMessage(
                response,
                400,
                err,
                false,
                `Tạo hóa đơn nhập thất bại ${err}`
            )
        }
    }
}
