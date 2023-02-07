import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Export from 'App/Models/Export'
import Product from 'App/Models/Product'
import CreateInvoiceService from 'App/Services/CreateInvoiceService'
import ResponseService from 'App/Services/ResponseService'
import CreateExportValidator from 'App/Validators/CreateExportValidator'

const rps = new ResponseService()


export default class ExportsController {
    public async exportProduct({request, response, auth}:HttpContextContract){
        const user = await auth.use('api').user!
        const val = await request.validate(CreateExportValidator)
        const newExportOrder = await Export.create({
            shopId: user.id,
            customerId: val.customerId
        })
        let total = 0
        let fail = 0
        for(let product of val.productList){
            const productInstance = await Product.query().select('*').where('id', product.productId).where('shop_id', user.id).first()
            if(productInstance?.inStock! < product.qty){
                fail++
                continue
            }
            await newExportOrder.related('exportDetails').create({
                productId: product.productId,
                qty: product.qty
            })
            total+= product.qty * productInstance?.price!
        }
        try{
            await newExportOrder.merge({total: total}).save()
            await newExportOrder.load('exportDetails', (query) => {
                query.preload('product')
            })
            for(let product of newExportOrder.exportDetails){
                const productInstance = await Product.query().select('*').where('id', product.productId).where('shop_id', user.id).first()
                if(productInstance){
                    productInstance.inStock -= product.qty
                    await productInstance.save()
                }
            }
            const importData ={customerId: val.customerId,productList: val.productList,shopId: user.id}
            await CreateInvoiceService.createImportInvoice(importData)
            return rps.responseWithCustomMessage(
                response,
                201,
                newExportOrder,
                true,
                `Xuất hàng thành công với ${fail} sản phẩm lỗi do không đủ tồn kho`
            )
        }
        catch(err){
            return rps.responseWithCustomMessage(
                response,
                400,
                err,
                false,
                `Tạo hóa đơn xuất thất bại ${err}`
            )
        }
    }
}
