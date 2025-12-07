import { Request, Response, Express, NextFunction } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { join } from 'path'
import fs from 'fs';
import sharp from 'sharp';
import BadRequestError from '../errors/bad-request-error';

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        cb(
            null,
            join(
                __dirname,
                process.env.UPLOAD_PATH_TEMP
                    ? `../public/${process.env.UPLOAD_PATH_TEMP}`
                    : '../public'
            )
        )
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        const uniqueSuffix = `${Date.now()}'-'${Math.round(Math.random() * 1E9)}`
        cb(null, file.originalname + uniqueSuffix)
    },
})

// const storage = multer.memoryStorage();

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!types.includes(file.mimetype)) {
        return cb(null, false)
    }

    return cb(null, true)
}

export default multer({ storage, fileFilter })

export const checkFileSize = async (req: Request, _res: Response, next: NextFunction) => {
    if (req.file) {
        try {
            const buffer = await fs.readFileSync(req.file.path)
            const metadata = await sharp(buffer).metadata();
            if (!metadata.format || !types.includes(`image/${metadata.format}`)) {
                return next(new BadRequestError('Invalid file type'));
            }
        }
        catch (_error) {
            return next(new BadRequestError('Invalid file type'));
        }
 
        if (req.file.size < 2 * 1024 ) {
            return next(new BadRequestError('Invalid file size must be more than 2MB'));
        }
        if (req.file.size > 10 * 1024 * 1024 ) {
            return next(new BadRequestError('Invalid file size must be less than 10MB'))
        }
    }
    next()
}
