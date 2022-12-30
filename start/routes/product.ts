import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/', 'ProductsController.searchProduct')
    Route.get('/:id', 'ProductsController.getProduct')
    Route.post('/', 'ProductsController.insertProduct')
    Route.patch('/:id', 'ProductsController.updateProduct')
    Route.delete('/:id', 'ProductsController.destroyProduct')
}).prefix('product')
