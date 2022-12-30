import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/', 'OrdersController.getOrder')
    Route.get('/:id', 'OrdersController.getOrderDetail')
    Route.post('/', 'OrdersController.createOrder')
    Route.patch('/:id', 'OrdersController.updateOrder')
    Route.delete('/:id', 'OrdersController.deleteOrder')
}).prefix('order')
