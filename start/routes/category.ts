import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/', 'CategoriesController.getCategory')
    Route.get('/:id', 'CategoriesController.getCategoryDetails')
    Route.post('/', 'CategoriesController.insertCategory')
    Route.patch('/:id', 'CategoriesController.editCategory')
    Route.delete('/:id', 'CategoriesController.destroyCategory')
}).prefix('category')
