import { Router } from 'express'
import {
    createOrder,
    deleteOrder,
    getOrderByNumber,
    getOrderCurrentUserByNumber,
    getOrders,
    getOrdersCurrentUser,
    updateOrder,
} from '../controllers/order'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import {
    validateGetOrders,
    validateOrderBody, validateOrderBodyUpdate,
    validateParamId, validateParamOrderNumber
} from '../middlewares/validations'
import { Role } from '../models/user'

const orderRouter = Router()

orderRouter.post('/', auth, validateOrderBody, createOrder)
orderRouter.get('/all', auth, validateGetOrders, getOrders)
orderRouter.get('/all/me', auth, validateGetOrders, getOrdersCurrentUser)
orderRouter.get(
    '/:orderNumber',
    auth,
    roleGuardMiddleware(Role.Admin),
    validateParamOrderNumber,
    getOrderByNumber
)
orderRouter.get('/me/:orderNumber', auth, validateParamOrderNumber, getOrderCurrentUserByNumber)
orderRouter.patch(
    '/:orderNumber',
    auth,
    roleGuardMiddleware(Role.Admin),
    validateParamOrderNumber,
    validateOrderBodyUpdate,
    updateOrder
)

orderRouter.delete('/:id', auth, roleGuardMiddleware(Role.Admin), validateParamId, deleteOrder)

export default orderRouter
