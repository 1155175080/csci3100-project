const orders = require("../controllers/order.controller");
const router = require("express").Router();

module.exports = app => {
    router.post('/create', orders.create);
    router.put('/placeorder', orders.PlaceOrder);
    router.delete('/remove', orders.removeOrderItem);
    router.get('/history/:userid', orders.history);
    router.get('/', orders.findAll)
    router.get('/status/:status', orders.findbystatus)
    router.get('/name/:method', orders.findbymethod)
    router.get('/id/:orderID', orders.findbyid)
    router.put('/update', orders.update);
    router.delete('/delete/:orderID', orders.delete);
    app.use('/api/order', router);
};
