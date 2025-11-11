import { NextFunction, Request, Response } from 'express';

// GET /csrf-token
export const getCsrfToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.send({csrfToken: req.csrfToken()})
    } catch (err) {
        return next(err)
    }
}

export default {}
