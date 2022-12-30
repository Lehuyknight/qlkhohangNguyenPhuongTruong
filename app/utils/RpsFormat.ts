export default class RpsFormat {
    data: any
    isSuccess: boolean
    message: string

    constructor(data: any, isSuccess: boolean, message: string) {
        this.data = data,
            this.isSuccess = isSuccess,
            this.message = message
    }
}
