import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.post('/create', 'TakeinsController.createTake')
    Route.put('/edit/:id', 'TakeinsController.updateTakein')
    Route.get('/get/:id', 'TakeinsController.getTakein')
    Route.delete('/delete/:id', 'TakeinsController.deleteTakein')
}).prefix('import')
