import { customAlphabet } from 'nanoid'

export const generateId = () => {
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    const id = customAlphabet(alphabet, 9);
    return id()
}