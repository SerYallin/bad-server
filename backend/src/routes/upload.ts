import { Router } from 'express'
import { uploadFile } from '../controllers/upload'
import fileMiddleware, {
    checkFileSize,
} from '../middlewares/file'
import auth from '../middlewares/auth'

const uploadRouter = Router()
uploadRouter.post('/', fileMiddleware.single('file'), checkFileSize, auth, uploadFile)

export default uploadRouter
