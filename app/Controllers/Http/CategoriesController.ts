import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import { schema as Schema } from '@ioc:Adonis/Core/Validator'
import ResponseService from 'App/Services/ResponseService'
import CreateCategoryValidator from 'App/Validators/CreateCategoryValidator'
import UpdateCategoryValidator from 'App/Validators/UpdateCategoryValidator'

const rps = new ResponseService()

export default class CategoriesController {
    // tạo mới
    public async insertCategory({
        request,
        response,
        auth,
        bouncer,
    }: HttpContextContract) {
        await auth.use('api').user
        try {
            await bouncer.authorize('checkAdmin')
            try {
                const payload = await request.validate(CreateCategoryValidator)
                const category = await Category.create(payload)
                return rps.responseWithCustomMessage(
                    response,
                    201,
                    category,
                    true,
                    'Tạo danh mục thành công'
                )
            } catch (err) {
                return rps.responseWithCustomMessage(
                    response,
                    400,
                    err.messages.errors,
                    false,
                    `Tạo danh mục mới thất bại`
                )
            }
        } catch (err) {
            return rps.responseWithCustomMessage(
                response,
                401,
                err,
                false,
                `Không đủ thẩm quyền`
            )
        }
    }
    // sửa
    public async editCategory({
        params,
        auth,
        request,
        response,
        bouncer,
    }: HttpContextContract) {
        const a = await auth.use('api').user
        console.log(a)
        try {
            await bouncer.authorize('checkAdmin')
            try {
                const category = await Category.findOrFail(params.id)
                try {
                    const payload = await request.validate(
                        UpdateCategoryValidator
                    )
                    await category
                        .merge({
                            name: payload.name ? payload.name : category.name,
                            description: payload.description
                                ? payload.description
                                : category.description,
                        })
                        .save()
                    return rps.responseWithCustomMessage(
                        response,
                        200,
                        category,
                        true,
                        'Update danh mục thành công'
                    )
                } catch (err) {
                    return rps.responseWithCustomMessage(
                        response,
                        400,
                        err.messages.errors,
                        false,
                        'Update danh mục thất bại'
                    )
                }
            } catch (error) {
                return rps.responseWithCustomMessage(
                    response,
                    400,
                    error,
                    false,
                    'Không tìm thấy thông tin'
                )
            }
        } catch (error) {
            return rps.responseWithCustomMessage(
                response,
                400,
                error,
                false,
                'Không đủ thẩm quyền'
            )
        }
    }
    //lấy thông tin
    public async getCategory({ request, response }: HttpContextContract) {
        const {
            page = 1,
            limit = 10,
            key = 'name',
            sort = 'asc',
            ...input
        } = request.qs()
        const categories = await Category.filter(input)
            .orderBy(key, sort)
            .paginate(page, limit)
        return rps.responseWithCustomMessage(
            response,
            200,
            categories,
            true,
            'Lấy thông tin danh mục thành công'
        )
        // try {
        //     const category = await Category.query()
        //         .select('*')
        //         .orderBy('name', 'asc')
        //     return response.status(200).json({
        //         category,
        //         message: 'Lấy thông tin danh mục thành công',
        //     })
        // } catch (error) {
        //     return response.status(400).json({
        //         message: 'không tìm thấy thông tin',
        //     })
        // }
    }

    //get detail
    public async getCategoryDetails({ response, params }: HttpContextContract) {
        try {
            const category = await Category.findOrFail(params.id)
            return rps.responseWithCustomMessage(
                response,
                200,
                category,
                true,
                `Lấy chi tiết danh mục ${category.name} thành công`
            )
        } catch (err) {
            return rps.responseWithCustomMessage(
                response,
                400,
                err,
                false,
                `Lấy chi tiết danh mục thất bại`
            )
        }
    }

    //xóa danh mục
    public async destroyCategory({
        params,
        response,
        bouncer,
    }: HttpContextContract) {
        try {
            await bouncer.authorize('checkAdmin')
            try {
                const category = await Category.findOrFail(params.id)
                await category.delete()
                return rps.responseWithCustomMessage(
                    response,
                    200,
                    category,
                    true,
                    `Xóa danh mục ${category.name} thành công`
                )
            } catch (error) {
                return rps.responseWithCustomMessage(
                    response,
                    400,
                    error,
                    true,
                    `Xóa danh mục thất bại`
                )
            }
        } catch (error) {
            return rps.responseWithCustomMessage(
                response,
                401,
                error,
                false,
                'Không đủ thẩm quyền'
            )
        }
    }
}
