import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.post('/register', 'AuthController.register')
    Route.post('/login', 'AuthController.login')
    Route.post('/logout', 'AuthController.logout')
    Route.group(() => {
        Route.post('/change-password', 'AuthController.changePassword')
    }).middleware('auth')
}).prefix('auth')
