import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.group(() => {
        Route.post('/login', 'AdminsController.login')
        Route.post('/register', 'AdminsController.register')
    }).prefix('auth')
}).prefix('admin')