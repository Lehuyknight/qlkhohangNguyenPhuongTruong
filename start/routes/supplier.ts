import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/', 'SuppliersController.getAllSuppliers')
    Route.get('/:id', 'SuppliersController.getSupplier')
    Route.post('/', 'SuppliersController.createSupplier')
    Route.patch('/:id', 'SuppliersController.updateSupplier')
    Route.delete('/:id', 'SuppliersController.destroy')
}).prefix('supplier')
