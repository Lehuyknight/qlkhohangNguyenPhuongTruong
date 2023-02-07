import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Supplier from 'App/Models/Supplier'
import ResponseService from 'App/Services/ResponseService'
import CreateSupplierValidator from 'App/Validators/CreateSupplierValidator'
import UpdateSupplierValidator from 'App/Validators/UpdateSupplierValidator'

const rps = new ResponseService()

export default class SuppliersController {
    //create
    public async createSupplier({
        request,
        auth,
        response,
    }: HttpContextContract) {
        const user = await auth.use('api').user!
        try {
            const val = await request.validate(CreateSupplierValidator)
            const supplier = await Supplier.create({
                name: val.name,
                phone: val.phone,
                taxCode: val.taxCode,
                address: val.address,
                status: val.status,
                shopId: user.id,
            })
            return rps.responseWithCustomMessage(
                response,
                201,
                supplier,
                true,
                `Tạo mới đơn vị cung cấp thành công `
            )
        } catch (err) {
            return rps.responseWithCustomMessage(
                response,
                400,
                err,
                false,
                `Lỗi khi tạo mới nhà cung cấp`
            )
        }
    }

    //fix
    public async updateSupplier({
        params,
        request,
        response,
        bouncer,
    }: HttpContextContract) {
        try {
            const supplier = await Supplier.findOrFail(params.id)
            const val = await request.validate(UpdateSupplierValidator)
            try {
                await bouncer.with('SupplierPolicy').authorize('fix', supplier)
                await supplier
                    .merge({
                        name: val.name ? val.name : supplier.name,
                        phone: val.phone ? val.phone : supplier.phone,
                        address: val.address ? val.address : supplier.address,
                        taxCode: val.taxCode ? val.taxCode : supplier.taxCode,
                        status: val.status ? val.status : supplier.status,
                    })
                    .save()
                return rps.responseWithCustomMessage(
                    response,
                    200,
                    supplier,
                    true,
                    `Cập nhật thông tin nhà cung cấp '${supplier.name}' thành công`
                )
            } catch (err) {
                return rps.responseWithCustomMessage(
                    response,
                    401,
                    err,
                    false,
                    `Không có quyền sửa thông tin nhà cung cấp này`
                )
            }
        } catch (err) {
            return rps.responseWithCustomMessage(
                response,
                400,
                err,
                false,
                `Không tìm thấy nhà cung cấp `
            )
        }
    }

    //get
    public async getSupplier({
        params,
        response,
        bouncer,
    }: HttpContextContract) {
        try {
            const supplier = await Supplier.findOrFail(params.id)
            // await supplier.load('takeins')
            try {
                await bouncer.with('SupplierPolicy').authorize('view', supplier)
                return rps.responseWithCustomMessage(
                    response,
                    200,
                    supplier,
                    true,
                    `Lấy thông tin nhà cung cấp '${supplier.name}' thành công`
                )
            } catch (err) {
                return rps.responseWithCustomMessage(
                    response,
                    401,
                    err,
                    false,
                    `Không được phép truy cập thông tin này`
                )
            }
        } catch (err) {
            return rps.responseWithCustomMessage(
                response,
                400,
                err,
                false,
                `Không tìm thấy thông tin`
            )
        }
    }

    //getAll
    public async getAllSuppliers({ request, response, auth }: HttpContextContract) {
        const user = await auth.use('api').user!
        const {key = 'name', sort = 'asc', page = 1, limit = 10, ...input} = request.qs()
        const suppliers = await Supplier.query()
            .select('*')
            .where('shop_id', user.id)
            .orderBy(key, sort)
            .paginate(page, limit)
        if (suppliers.length) {
            return rps.responseWithCustomMessage(
                response,
                200,
                suppliers,
                true,
                `Lấy thông tin tất cả các nhà cung cấp thành công`
            )
        } else {
            return rps.responseWithCustomMessage(
                response,
                400,
                null,
                false,
                `Không có nhà cung cấp`
            )
        }
    }

    //delete
    public async destroy({response, bouncer, params}: HttpContextContract){
        try{
            const sup = await Supplier.findOrFail(params.id)
            try{
                await bouncer.with('SupplierPolicy').authorize('view', sup)
                await sup.delete()
                return rps.responseWithCustomMessage(response, 200, sup, true, `Xóa nhà cung cấp thành công`)
            }
            catch(err){
                return rps.responseWithCustomMessage(response, 401, err, false, `Không có quyền thực thi`)
            }
        }
        catch(err){
            return rps.responseWithCustomMessage(response, 400, null, false, 'Không tìm thấy nhà cung cấp')
        }
    }
}
