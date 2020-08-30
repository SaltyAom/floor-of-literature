/* eslint-disable */
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

// ? Usage
// useRouter.mockImplementationOnce(() => ({
//     query: { product: 'coffee' },
// }))

export { 
    useRouter
}