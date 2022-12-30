import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.post('/', 'ExportsController.exportProduct')
}).prefix('export').middleware('auth')