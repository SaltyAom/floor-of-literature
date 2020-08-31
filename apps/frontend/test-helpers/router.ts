/* eslint-disable */
import * as router from 'next/router'

const push = jest.fn()

// @ts-ignore
router.useRouter = jest.fn()
// @ts-ignore
router.useRouter.mockImplementation(() => ({ route: '/', push }))

// ? Usage
// useRouter.mockImplementationOnce(() => ({
//     query: { product: 'coffee' },
// }))

const useRouter = router.useRouter

export { router, useRouter, push }
