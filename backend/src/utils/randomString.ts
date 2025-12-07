
import bcrypt from 'bcryptjs'

export const randomString = async (length: number) => {
    const hash = await bcrypt.hash(Math.random().toString() + Date.now(), length);
    return hash.replace(/\//g, '').replace(/\$/g, '').replace(/\./g, '').substring(0, length);
}
