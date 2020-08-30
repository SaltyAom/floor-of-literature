import { render } from '@testing-library/react'
import { act } from 'react-dom/test-utils'

import { Provider, useRouter } from '@frontend/test-helpers/index'

describe('Login Guard', () => {
	beforeEach(() => {
		// @ts-ignore
		fetch.resetMocks()
	})

	it('should fetch for refersh token', async () => {
		// @ts-ignore
		fetch.mockResponseOnce(JSON.stringify({ success: false }))

		await act(async () => {
			await render(
				<Provider>
					<h1>Hello World</h1>
				</Provider>
			)
		})

		expect(fetch).toHaveBeenCalledWith(
			'http://localhost:8080/api/refresh',
			{ credentials: 'include', method: 'POST' }
		)
	})

	// TODO: Test whitelist
	// it('should fetch for refersh token', async () => {
	// 	// @ts-ignore
	// 	fetch.mockResponseOnce(JSON.stringify({ success: false }))

	// 	await useRouter.mockImplementationOnce(() => ({
	// 		pathname: '/signout'
	// 	}))

	// 	await act(async () => {	
	// 		await render(
	// 			<Provider>
	// 				<h1>Hello World</h1>
	// 			</Provider>
	// 		)
	// 	})

	// 	expect(fetch).toHaveBeenCalledTimes(0)
	// })
})
