import { Response } from 'express'
import { JWT_SECRET_KEY } from '../constants.js'
import jwt from 'jsonwebtoken'
export default async function authMiddleware(
    req: any,
    res: Response,
    next: any,
) {
    const token = req?.headers.authorization?.split(' ')[1]
    let verifiedToken
    try {
        if (token) {
            verifiedToken = await jwt.verify(token, JWT_SECRET_KEY)

            if (!verifiedToken) {
                res.json({ message: 'No token/token expired' })
            }
            req.user = verifiedToken
            next()
        } else {
            res.json({ message: 'No token/token expired' })
        }
    } catch (error) {
        res.json({ message: 'No token/token expired' })
        next(error)
    }
}
