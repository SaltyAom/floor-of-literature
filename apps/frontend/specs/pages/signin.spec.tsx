import { render, fireEvent, screen, waitFor } from '@testing-library/react'

import { Provider, push } from '@frontend/test-helpers'

import SignIn from '@frontend/pages/signin'

describe('Sign In Page', () => {
	beforeEach(() => {
		// @ts-ignore
		fetch.resetMocks()
	})

	it('should render successfully', () => {
		let { baseElement } = render(
			<Provider>
				<SignIn />
			</Provider>
		)

		expect(baseElement).toBeTruthy()
	})

	it("should render 'Floor of Literature'", () => {
		let { getByText } = render(
			<Provider>
				<SignIn />
			</Provider>
		)

		expect(getByText('Floor of Literature')).toBeTruthy()
	})

	it('should have username text-field', () => {
		let { baseElement } = render(
				<Provider>
					<SignIn />
				</Provider>
			),
			textField = baseElement.querySelector('.input[name="username"]')

		expect(textField).toBeTruthy()
	})

	it('should have text-field with "username" as placeholder', () => {
		let { baseElement } = render(
				<Provider>
					<SignIn />
				</Provider>
			),
			textField = baseElement.querySelector('.input[name="username"]'),
			placeholder = textField.nextElementSibling

		expect(placeholder.textContent).toBe('Username')
	})

	it('should have password text-field', () => {
		let { baseElement } = render(
				<Provider>
					<SignIn />
				</Provider>
			),
			textField = baseElement.querySelector('.input[name="password"]')

		expect(textField).toBeTruthy()
	})

	it('should have textfield with "password" as placeholder', () => {
		let { baseElement } = render(
				<Provider>
					<SignIn />
				</Provider>
			),
			textField = baseElement.querySelector('.input[name="password"]'),
			placeholder = textField.nextElementSibling

		expect(placeholder.textContent).toBe('Password')
	})

	it('should have submit button', () => {
		let { baseElement } = render(
				<Provider>
					<SignIn />
				</Provider>
			),
			button = baseElement.querySelector('button')

		expect(button).toBeTruthy()
	})

	it('should not be able to submit if form is blank', () => {
		let { baseElement } = render(
				<Provider>
					<SignIn />
				</Provider>
			),
			form = baseElement.querySelector('form')

		fireEvent.submit(form)

		expect(fetch).toHaveBeenCalledTimes(0)
	})

	it('should not be able to submit if username is less than 5 characters', () => {
		let { baseElement } = render(
				<Provider>
					<SignIn />
				</Provider>
			),
			form = baseElement.querySelector('form'),
			username = baseElement.querySelector('.input[name="username"]'),
			password = baseElement.querySelector('.input[name="password"]')

		fireEvent.change(username, {
			target: {
				value: '1234'
			}
		})
		fireEvent.change(password, {
			target: {
				value: '12345678'
			}
		})

		fireEvent.submit(form)

		expect(fetch).toHaveBeenCalledTimes(0)
	})

	it('should not be able to submit if password is less than 5 characters', () => {
		let { baseElement } = render(
				<Provider>
					<SignIn />
				</Provider>
			),
			form = baseElement.querySelector('form'),
			username = baseElement.querySelector('.input[name="username"]'),
			password = baseElement.querySelector('.input[name="password"]')

		fireEvent.change(username, {
			target: {
				value: '12345678'
			}
		})
		fireEvent.change(password, {
			target: {
				value: '1234'
			}
		})

		fireEvent.submit(form)

		expect(fetch).toHaveBeenCalledTimes(0)
	})

	it('should not be able to submit if username is more than 32 characters', () => {
		let { baseElement } = render(
				<Provider>
					<SignIn />
				</Provider>
			),
			form = baseElement.querySelector('form'),
			username = baseElement.querySelector('.input[name="username"]'),
			password = baseElement.querySelector('.input[name="password"]')

		fireEvent.change(username, {
			target: {
				value: '1234567890abcdefghijklmnopqrstuvwxyz'
			}
		})
		fireEvent.change(password, {
			target: {
				value: '12345678'
			}
		})

		fireEvent.submit(form)

		expect(fetch).toHaveBeenCalledTimes(0)
	})

	it('should not be able to submit if password is more than 32 characters', () => {
		let { baseElement } = render(
				<Provider>
					<SignIn />
				</Provider>
			),
			form = baseElement.querySelector('form'),
			username = baseElement.querySelector('.input[name="username"]'),
			password = baseElement.querySelector('.input[name="password"]')

		fireEvent.change(username, {
			target: {
				value: '12345678'
			}
		})
		fireEvent.change(password, {
			target: {
				value: '1234567890abcdefghijklmnopqrstuvwxyz'
			}
		})

		fireEvent.submit(form)

		expect(fetch).toHaveBeenCalledTimes(0)
	})

	it('should be able to submit form successfully', () => {
		// @ts-ignore
		fetch.mockResponseOnce(
			JSON.stringify({ success: true, detail: 'Successfully sign in' })
		)

		let { baseElement } = render(
				<Provider>
					<SignIn />
				</Provider>
			),
			form = baseElement.querySelector('form'),
			username = baseElement.querySelector('.input[name="username"]'),
			password = baseElement.querySelector('.input[name="password"]')

		fireEvent.change(username, {
			target: {
				value: '12345678'
			}
		})
		fireEvent.change(password, {
			target: {
				value: '12345678'
			}
		})

		fireEvent.submit(form)

		expect(fetch).toHaveBeenCalledTimes(1)
	})

	// TODO
	it('should be redirect to landing page after signed in', () => {
		// @ts-ignore
		fetch.mockResponseOnce(
			JSON.stringify({ success: true, detail: 'Successfully sign in' })
		)

		let { baseElement } = render(
				<Provider>
					<SignIn />
				</Provider>
			),
			form = baseElement.querySelector('form'),
			username = baseElement.querySelector('.input[name="username"]'),
			password = baseElement.querySelector('.input[name="password"]')

		fireEvent.change(username, {
			target: {
				value: '12345678'
			}
		})
		fireEvent.change(password, {
			target: {
				value: '12345678'
			}
		})

		fireEvent.submit(form)

		expect(push).toHaveBeenCalledTimes(1)
	})

	it('should show error if sign in failed', async () => {
		let errorStatus = 'Username or password is incorrect.'

		// @ts-ignore
		fetch.mockResponseOnce(
			JSON.stringify({
				success: false,
				detail: errorStatus.replace('.', '')
			})
		)

		let { baseElement } = render(
				<Provider>
					<SignIn />
				</Provider>
			),
			form = baseElement.querySelector('form'),
			username = baseElement.querySelector('.input[name="username"]'),
			password = baseElement.querySelector('.input[name="password"]')

		fireEvent.change(username, {
			target: {
				value: '12345678'
			}
		})
		fireEvent.change(password, {
			target: {
				value: '12345678'
			}
		})

		fireEvent.submit(form)

		await waitFor(() => expect(screen.getByText(errorStatus)).toBeTruthy())

		let error = baseElement.querySelector('.error')

		expect(error.textContent).toBe(errorStatus)
	})
})
