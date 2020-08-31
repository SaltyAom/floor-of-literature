import { render } from '@testing-library/react'
import { act } from 'react-dom/test-utils'

import { Provider } from '@frontend/test-helpers'

import Signout from '@frontend/pages/signout'

describe('Sign Out Page', () => {
	beforeEach(() => {
		// @ts-ignore
		fetch.resetMocks()
	})

	it('should fetch for signout', async () => {
		// @ts-ignore
		fetch.mockResponseOnce(JSON.stringify({ success: true }))

		await act(async () => {
			await render(
				<Provider>
					<Signout />
				</Provider>
			)
		})

		expect(fetch).toHaveBeenCalledWith(
			'http://localhost:8080/api/signout',
			{ credentials: 'include', method: 'POST' }
		)
	})
})
