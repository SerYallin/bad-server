import { Joi, celebrate, Segments } from 'celebrate'
import { Types } from 'mongoose'

// eslint-disable-next-line no-useless-escape
export const phoneRegExp = /^(\+\d+)?(?:\s|-?|\(?\d+\)?)+$/
export const passwordRegExp = /^[a-zA-Z0-9!@#$%^&*()_+=-]{6,}$/;
export const emailCharsRegex = /^[\w@.-]+$/; 
export const nameRegex = /^[А-Яа-яЁёa-zA-Z0-9\s.,!?@#$%^&*()\-_=+/\\|:{}[\]"'~`]*$/;
export const tokensRegex = /^[a-zA-Z0-9]+$/;

export enum PaymentType {
    Card = 'card',
    Online = 'online',
}

// валидация id
export const validateOrderBody = celebrate({
    [Segments.BODY]: Joi.object().keys({
        items: Joi.array()
            .items(
                Joi.string().custom((value, helpers) => {
                    if (Types.ObjectId.isValid(value)) {
                        return value
                    }
                    return helpers.message({ custom: 'Невалидный id' })
                })
            )
            .messages({
                'array.empty': 'Не указаны товары',
            }),
        payment: Joi.string()
            .valid(...Object.values(PaymentType))
            .required()
            .messages({
                'string.valid':
                    'Указано не валидное значение для способа оплаты, возможные значения - "card", "online"',
                'string.empty': 'Не указан способ оплаты',
            }),
        email: Joi.string().email().required().messages({
            'string.empty': 'Не указан email',
        }),
        phone: Joi.string().max(22).required().pattern(phoneRegExp).messages({
            'string.empty': 'Не указан телефон',
        }),
        address: Joi.string().max(256).required().messages({
            'string.empty': 'Не указан адрес',
        }),
        total: Joi.number().required().messages({
            'string.empty': 'Не указана сумма заказа',
        }),
        comment: Joi.string().max(1024).optional().allow(''),
    }),
})

export const validateOrderBodyUpdate = celebrate({
    [Segments.BODY]: Joi.object().keys({
        status: Joi.string().max(100).required().messages({
            'string.empty': 'Не указан статус',
        })
    }),
})

export const validateGetOrders = celebrate({
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).default(10),
        sortField: Joi.string().max(100).default('createdAt'),
        sortOrder: Joi.string().max(4).valid('asc', 'desc').default('desc'),
        status: Joi.string().max(100),
        totalAmountFrom: Joi.number().min(0),
        totalAmountTo: Joi.number().min(0),
        orderDateFrom: Joi.date().iso(),
        orderDateTo: Joi.date().iso(),
        search: Joi.string().max(200),
    }),
})

export const validateParamOrderNumber = celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        orderNumber: Joi.number().required().integer().min(1),
    }),
})

export const validateParamId = celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.required().custom((value, helpers) => {
            if (Types.ObjectId.isValid(value)) {
                return value
            }
            return helpers.message({ any: 'Невалидный id' })
        }),
    }),
})

// валидация товара.
// name и link - обязательные поля, name - от 2 до 30 символов, link - валидный url
export const validateProductBody = celebrate({
    [Segments.BODY]: Joi.object().keys({
        title: Joi.string().required().min(2).max(30).messages({
            'string.min': 'Минимальная длина поля "name" - 2',
            'string.max': 'Максимальная длина поля "name" - 30',
            'string.empty': 'Поле "title" должно быть заполнено',
        }),
        image: Joi.object().keys({
            fileName: Joi.string().max(256).required(),
            originalName: Joi.string().max(256).required(),
            size: Joi.number().min(2*1024).max(10 * 1024 * 1024).required(),
        }),
        category: Joi.string().max(100).required().messages({
            'string.empty': 'Поле "category" должно быть заполнено',
        }),
        description: Joi.string().max(1024).required().messages({
            'string.empty': 'Поле "description" должно быть заполнено',
        }),
        price: Joi.number().allow(null),
    }),
})

export const validateProductUpdateBody = celebrate({
    [Segments.BODY]: Joi.object().keys({
        title: Joi.string().min(2).max(30).messages({
            'string.min': 'Минимальная длина поля "name" - 2',
            'string.max': 'Максимальная длина поля "name" - 30',
        }),
        image: Joi.object().keys({
            fileName: Joi.string().max(256).required(),
            originalName: Joi.string().max(256).required(),
            size: Joi.number().min(2*1024).max(10 * 1024 * 1024).required(),
        }),
        category: Joi.string().max(100),
        description: Joi.string().max(1024),
        price: Joi.number().allow(null),
    }),
})

export const validateObjId = celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        productId: Joi.string()
            .required()
            .custom((value, helpers) => {
                if (Types.ObjectId.isValid(value)) {
                    return value
                }
                return helpers.message({ any: 'Невалидный id' })
            }),
    }),
})

export const validateUserBody = celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30).messages({
            'string.min': 'Минимальная длина поля "name" - 2',
            'string.max': 'Максимальная длина поля "name" - 30',
        }),
        password: Joi.string().min(6).max(256).required().messages({
            'string.empty': 'Поле "password" должно быть заполнено',
        }),
        email: Joi.string()
            .required()
            .email()
            .message('Поле "email" должно быть валидным email-адресом')
            .messages({
                'string.empty': 'Поле "email" должно быть заполнено',
            }),
    }),
})

export const validateAuthentication = celebrate({
    body: Joi.object().keys({
        email: Joi.string()
            .required()
            .email()
            .message('Поле "email" должно быть валидным email-адресом')
            .messages({
                'string.required': 'Поле "email" должно быть заполнено',
            }),
        password: Joi.string().max(256).required().messages({
            'string.empty': 'Поле "password" должно быть заполнено',
        }),
    }),
})
