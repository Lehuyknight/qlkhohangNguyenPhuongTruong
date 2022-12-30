import { schema as Schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import Export from 'App/Models/Export'
import Import from 'App/Models/Import'
import Product from 'App/Models/Product'
export default class CreateInvoiceService {
    public static async createExportInvoice(data) {
        const val = await validator.validate({
            schema: Schema.create({
                supplierId: Schema.number([rules.unsigned()]),
                productList: Schema.array().members(
                    Schema.object().members({
                        upcCode: Schema.string({ trim: true }),
                        qty: Schema.number(),
                        unitPrice: Schema.number([rules.unsigned()]),
                        name: Schema.string({ trim: true }),
                    })
                ),
                shopId: Schema.number([rules.unsigned()]),
            }),
            data: data,
        })
        let total = 0
        const newExportInvoice = await Export.create({
            shopId: val.supplierId,
            customerId: val.shopId,
        })

        for (let product of val.productList) {
            const productInstance = await Product.query()
                .select('*')
                .where('upc_code', product.upcCode)
                .where('shop_id', val.supplierId)
                .first()
            if (productInstance) {
                newExportInvoice.related('exportDetails').create({
                    productId: productInstance.id,
                    qty: product.qty,
                })
                total += product.qty * productInstance.price
            }
        }
        try {
            await newExportInvoice.merge({ total: total }).save()
            await newExportInvoice.load('exportDetails')
            for (let product of newExportInvoice.exportDetails) {
                const productInstance = await Product.query()
                    .select('*')
                    .where('id', product.productId)
                    .where('shop_id', val.supplierId)
                    .first()
                if (productInstance) {
                    productInstance.inStock -= product.qty
                    await productInstance.save()
                }
            }
        } catch (err) {
            return
        }
    }

    public static async createImportInvoice(data) {
        const val = await validator.validate({
            schema: Schema.create({
                customerId: Schema.number([
                    rules.unsigned(),
                    rules.checkCustomer(),
                ]),
                productList: Schema.array().members(
                    Schema.object().members({
                        productId: Schema.number([rules.checkProduct()]),
                        qty: Schema.number([rules.unsigned()]),
                    })
                ),
                shopId: Schema.number([rules.unsigned()]),
            }),
            data: data,
        })
        const newImportInstance = await Import.create({
            shopId: val.customerId,
            supplierId: val.shopId,
        })
        let total = 0
        for (let product of val.productList) {
            const productInstance = await Product.find(product.productId)
            if (productInstance) {
                await newImportInstance.related('importDetails').create({
                    upcCode: productInstance.upcCode,
                    qty: product.qty,
                    unitPrice: productInstance.price,
                })
                total += product.qty * productInstance.price
            }
        }
        try {
            await newImportInstance.merge({ total: total }).save()
            await newImportInstance.load('importDetails')
            for (let product of val.productList) {
                const newProduct = await Product.find(product.productId)
                if (newProduct) {
                    const existProduct = await Product.query()
                        .select('*')
                        .where('shop_id', val.customerId)
                        .where('upc_code', newProduct?.upcCode)
                        .first()
                    if (existProduct) {
                        existProduct.inStock += product.qty
                        await existProduct.save()
                        console.log(1)
                    } else {
                        await Product.create({
                            shopId: val.shopId,
                            upcCode: newProduct.upcCode,
                            name: newProduct.name,
                            inStock: product.qty,
                            price: newProduct.price,
                            status: 'active',
                        })
                        console.log(2)
                    }
                }
            }
        } catch (err) {
            console.log(`err`)
            return
        }
    }
}
