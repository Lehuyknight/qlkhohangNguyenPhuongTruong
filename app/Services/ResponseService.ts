import RpsFormat from 'App/utils/RpsFormat'

export default class ResponseService{
    public returnResponse(response, statusCode:number, data:any, isSuccess:boolean, action:string, module: string){
        const msg = this.getMsg(action, isSuccess, module)
        return response.status(statusCode).json(
            new RpsFormat(
                data,
                isSuccess,
                msg
            )
        )
    }

    public responseWithCustomMessage(response, statusCode:number, data:any, isSuccess:boolean, message: any){
        return response.status(statusCode).json(
            new RpsFormat(
                data,
                isSuccess,
                message
            )
        )
    }

    private getMsg(action: string, type: boolean, module: string){
        let actionText = ''
        let typeTxt = type ? 'thành công' : "lỗi"
        switch(action){
            case 'update':
                actionText = "Sửa"
                break
            case 'delete':
                actionText = "Xóa"
                break
            case 'create':
                actionText = "Tạo"
                break
            default:
                actionText = "Lấy"
        }

        return `${actionText} ${module} ${typeTxt}`
    }

    public modifiedData(data:Object){
        Object.keys(data).forEach((key) => {
            if (data[key] == null) {
                delete data[key]
            }
        })
        return data
    }
}


