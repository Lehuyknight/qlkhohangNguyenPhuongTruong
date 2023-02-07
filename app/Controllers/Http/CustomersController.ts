import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Customer from 'App/Models/Customer'
import ResponseService from 'App/Services/ResponseService'
import CreateCustomerValidator from 'App/Validators/CreateCustomerValidator'
import UpdateCustomerValidator from 'App/Validators/UpdateCustomerValidator'

const rps = new ResponseService()
export default class CustomersController {
    //add
    public async createCustomer({
        request,
        auth,
        response,
    }: HttpContextContract) {
        const user = await auth.use('api').user!
        try {
            const val = await request.validate(CreateCustomerValidator)

            const customer = await Customer.create({
                name: val.name,
                phone: val.phone,
                address: val.address,
                shopId: user.id,
            })
            return rps.responseWithCustomMessage(
                response,
                201,
                customer,
                true,
                `Tạo khách hàng thành công`
            )
        } catch (err) {
            return rps.responseWithCustomMessage(
                response,
                400,
                err,
                false,
                `Có lỗi khi tạo mới khách hàng`
            )
        }
    }

    //fix
    public async editCustomer({
        params,
        request,
        response,
        bouncer,
    }: HttpContextContract) {
        try {
            const customer = await Customer.findOrFail(params.id)
            await bouncer.with('CustomerPolicy').authorize('fix', customer)
            const payload = await request.validate(UpdateCustomerValidator)
            await customer
                .merge({
                    name: payload.name ? payload.name : customer.name,
                    phone: payload.phone ? payload.phone : customer.phone,
                    address: payload.address
                        ? payload.address
                        : customer.address,
                })
                .save()
            return rps.responseWithCustomMessage(
                response,
                200,
                customer,
                true,
                `Sửa thông tin khách hàng ${customer.name} thành công`
            )
        } catch (err) {
            return rps.responseWithCustomMessage(
                response,
                400,
                err,
                false,
                `Có lỗi khi sửa thông tin`
            )
        }
    }

    //get
    public async getCustomer({
        params,
        response,
        bouncer,
    }: HttpContextContract) {
        try {
            const customer = await Customer.findOrFail(params.id)
            try {
                await bouncer.with('CustomerPolicy').authorize('view', customer)
            } catch (err) {
                return rps.responseWithCustomMessage(
                    response,
                    401,
                    err,
                    false,
                    'Không đủ quyền truy cập'
                )
            }
            return rps.responseWithCustomMessage(
                response,
                201,
                customer,
                true,
                `Lấy thông tin khách hàng thành công`
            )
        } catch (err) {
            return rps.responseWithCustomMessage(
                response,
                400,
                err,
                false,
                `Không có thông tin customer`
            )
        }
    }

    //search with name or phone
    public async index({ request, response, auth }: HttpContextContract) {
        const user = await auth.use('api').user!
        const {
            key = 'id',
            sort = 'asc',
            page = 1,
            limit = 10,
            ...input
        } = request.qs()
        const result = await Customer.filter(input)
            .where('shop_id', user?.id)
            .orderBy(key, sort)
            .paginate(page, limit)
        return rps.responseWithCustomMessage(
            response,
            200,
            result,
            true,
            `Lấy thông tin tất cả khách hàng thành công`
        )
    }

    //delete
    public async destroyCustomer({
        params,
        response,
        bouncer,
    }: HttpContextContract) {
        try {
            const customer = await Customer.findOrFail(params.id)
            try {
                await bouncer
                    .with('CustomerPolicy')
                    .authorize('delete', customer)
                await customer.delete()
                return rps.responseWithCustomMessage(
                    response,
                    200,
                    customer,
                    true,
                    'Xóa thành công'
                )
            } catch (err) {
                return rps.responseWithCustomMessage(
                    response,
                    401,
                    customer,
                    false,
                    'Không đủ quyền để thực hiện'
                )
            }
        } catch (err) {
            return rps.responseWithCustomMessage(
                response,
                400,
                err,
                false,
                `Có lỗi khi xóa`
            )
        }
    }
}
