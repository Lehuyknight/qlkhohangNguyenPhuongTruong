import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/', 'CustomersController.index')
    Route.group(() => {
        Route.post('/', 'CustomersController.createCustomer')
        Route.patch('/:id', 'CustomersController.editCustomer')
        Route.get('/:id', 'CustomersController.getCustomer')
        Route.delete('/:id', 'CustomersController.destroyCustomer')
    }).middleware('auth')
}).prefix('customer')
