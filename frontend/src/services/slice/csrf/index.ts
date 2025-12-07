import { getCsrfToken as getToken } from './thunk'
import { csrfSlice } from './csrf-slice'

export const getCsrfToken = getToken
export const selectCsrfToken = csrfSlice.selectors.selectCsrfToken

export type { TCsrfState } from './type'
export default csrfSlice
