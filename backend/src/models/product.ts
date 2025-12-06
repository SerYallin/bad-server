import { unlink } from 'fs'
import mongoose, { Document, Types } from 'mongoose'
import { join } from 'path'
import validator from 'validator';
import { nameRegex } from '../middlewares/validations';

export interface IFile {
    fileName: string
    originalName: string
}

export interface IProduct extends Document {
    _id: Types.ObjectId
    id: Types.ObjectId
    title: string
    image: IFile
    category: string
    description: string
    price: number
}

const cardsSchema = new mongoose.Schema<IProduct>(
    {
        title: {
            type: String,
            unique: true,
            required: [true, 'Поле "title" должно быть заполнено'],
            minlength: [2, 'Минимальная длина поля "title" - 2'],
            maxlength: [30, 'Максимальная длина поля "title" - 30'],
            validate: {
                validator: (v: string) => (nameRegex.test(v)),
                message: 'Заглавие содержит недопустимые символы',
            }
        },
        image: {
            fileName: {
                type: String,
                required: [true, 'Поле "image.fileName" должно быть заполнено'],
                maxlength: [255, 'Имя файла не должно превышать 255 символов'],
                validate: {
                    validator: (v: string) => (nameRegex.test(v)),
                    message: 'Имя файла содержит недопустимые символы',
                }
            },
            originalName: {
                type: String,
                maxlength: [255, 'Оригинальное имя не должно превышать 255 символов'],
                validate: {
                    validator: (v: string) => (nameRegex.test(v)),
                    message: 'Оригинальное имя содержит недопустимые символы',
                }
            }
        },
        category: {
            type: String,
            required: [true, 'Поле "category" должно быть заполнено'],
            maxlength: [255, 'Максимальная длина поля "category" - 255'],
            validate: {
                validator: (v: string) => (nameRegex.test(v)),
                message: 'Категория содержит недопустимые символы',
            }
        },
        description: {
            type: String,
            maxlength: [3096, 'Максимальная длина поля "description" - 3096 символов'],
        },
        price: {
            type: Number,
            default: null,
        },
    },
    { versionKey: false }
)

cardsSchema.index({ title: 'text' })

// Очистим нежелательные символы с текста перед сохранением
cardsSchema.pre('save', function (next) {
    if (this.isModified('description') && this.description) {
        this.description = validator.escape(this.description);
    }
    next();
})

// Можно лучше: удалять старое изображением перед обновлением сущности
cardsSchema.pre('findOneAndUpdate', async function deleteOldImage() {
    // @ts-ignore
    const updateImage = this.getUpdate().$set?.image
    const docToUpdate = await this.model.findOne(this.getQuery())
    if (updateImage && docToUpdate) {
        unlink(
            join(__dirname, `../public/${docToUpdate.image.fileName}`),
            (err) => console.log(err)
        )
    }
})

// Можно лучше: удалять файл с изображением после удаление сущности
cardsSchema.post('findOneAndDelete', async (doc: IProduct) => {
    unlink(join(__dirname, `../public/${doc.image.fileName}`), (err) =>
        console.log(err)
    )
})

export default mongoose.model<IProduct>('product', cardsSchema)
