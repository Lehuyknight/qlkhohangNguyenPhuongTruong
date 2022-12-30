import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.post('/', 'ImportsController.importProduct')
}).prefix('import').middleware('auth')