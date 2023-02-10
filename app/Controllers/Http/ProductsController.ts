import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import ResponseService from 'App/Services/ResponseService'
import CreateProductValidator from 'App/Validators/CreateProductValidator'
import UpdateProductValidator from 'App/Validators/UpdateProductValidator'

const rps = new ResponseService()
export default class ProductsController {
//tạo mới
    public async insertProduct ({request,auth,response}: HttpContextContract){
        const user = await auth.use("api").user!
        try{
            const payload = await request.validate(CreateProductValidator)
            const product = await Product.create({
                name: payload.name,
                sku: payload.sku,
                upcCode: payload.upcCode,
                description: payload.description,
                price: payload.price,
                inStock: payload.inStock,
                image: payload.image,
                unit: payload.unit,
                status: payload.status,
                categoryId: payload.categoryId,
                shopId: user.id
            })
            return rps.responseWithCustomMessage(response, 201, product, true, 'Tạo mới sản phẩm thành công')
        }
        catch(err){
            return rps.responseWithCustomMessage(response, 400, err, false, `Có lỗi khi tạo mới sản phẩm`)
        }   

    }
    //fix
    public async updateProduct({params, response, request, bouncer}: HttpContextContract){
        try{
            const payload = await request.validate(UpdateProductValidator)
            const product = await Product.findOrFail(params.id)
            try{
                await bouncer.with("ProductPolicy").authorize("fix",product)
                await product.merge({
                    name:payload.name? payload.name : product.name,
                    sku: payload.sku? payload.sku : product.sku,
                    upcCode: payload.upcCode? payload.upcCode : product.upcCode,
                    description: payload.description? payload.description : product.description,
                    price: payload.price? payload.price : product.price,
                    inStock: payload.inStock? payload.inStock : product.inStock,
                    image: payload.image? payload.image : product.image,
                    unit: payload.unit? payload.unit : product.unit,
                    status: payload.status? payload.status : product.status,
                    categoryId: payload.categoryId? payload.categoryId : product.categoryId
                }).save()
                return rps.responseWithCustomMessage(response, 200, product, true, `Cập nhật thông tin sản phẩm '${product.name}' thành công`)
                }
            catch(err){
                return rps.responseWithCustomMessage(response, 401, err, false, `Không có quyền sửa sản phẩm này`)

            }
        }
        catch (error){
            return rps.responseWithCustomMessage(response, 400, error, false, `Không tìm thấy sản phẩm`)

        }
    }

    //get
    public async getProduct({response,bouncer, params}: HttpContextContract){
        try{
            const product = await Product.findOrFail(params.id)
            await product.load('category')
            try{
                await bouncer.with("ProductPolicy").authorize("view",product)
                return rps.responseWithCustomMessage(response, 200, product, true,`Lấy thông tin sản phẩm ${product.name} thành công`)
                }
            catch (err){
                return rps.responseWithCustomMessage(response, 401, err, false, `Không có quyền xem sản phẩm này`)
            }
        }
        catch(error){
            console.log(error)
            return rps.responseWithCustomMessage(response, 400, error, false, `Không tìm thấy sản phẩm`)
        }
    }

    //get by name
    public async searchProduct({request, response,auth}: HttpContextContract){
        const user = await auth.use("api").user!
        const {key = "name", sort = "asc", page = 1, limit = 10, ...input} = request.qs()
        const result = await Product.filter(input).select("*").where("shop_id",user.id).orderBy(key,sort).paginate(page, limit)
        if (result.length == 0){
            return rps.responseWithCustomMessage(response, 400, null, false, `Không có sản phẩm`)
        }
        else{
            return rps.responseWithCustomMessage(response, 200, result, true, `Tìm sản phẩm thành công`)
        }
    }
    // delete
    public async destroyProduct ({response, params, bouncer}: HttpContextContract){
        try{
            const product = await Product.findOrFail(params.id)
            try{
                await bouncer.with("ProductPolicy").authorize("delete",product)
                await product.delete()
                return rps.responseWithCustomMessage(response, 200, product, true, `Xóa sản phẩm '${product.name} thành công`)
            }
            catch(err){
                return rps.responseWithCustomMessage(response, 401, err, false, `Không có quyền xem sản phẩm này`)

            }
        }    
        catch(error){
            return rps.responseWithCustomMessage(response, 400, error, false, `Không tìm thấy sản phẩm`)
        }
    }
}
