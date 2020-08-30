import { render, fireEvent } from '@testing-library/react'

import TextField from '@frontend/components/textfield'

describe('Textfield', () => {
	it('should be render successfully', () => {
		// eslint-disable-next-line
		let inputRef: any = {
			current: {}
		}

		let { baseElement } = render(
			<TextField inputRef={inputRef} name="Textfield" />
		)

		expect(baseElement).toBeTruthy()
	})

	it('should show label correctly', () => {
		// eslint-disable-next-line
		let inputRef: any = {
			current: {}
		}

		let { baseElement } = render(
				<TextField
					inputRef={inputRef}
					name="Textfield"
					placeholder="Hello Textfield"
				/>
			),
			label = baseElement.querySelector('.label')

		expect(label.textContent).toBe('Hello Textfield')
	})

	it('should be able to change type', () => {
		// eslint-disable-next-line
		let inputRef: any = {
			current: {}
		}

		let { baseElement } = render(
				<TextField
					inputRef={inputRef}
					name="Textfield"
					type="password"
				/>
			),
			input = baseElement.querySelector('.input')

		expect(input.getAttribute('type')).toBe('password')
	})

	it('should be able to accept className', () => {
		// eslint-disable-next-line
		let inputRef: any = {
			current: {}
		}

		let { baseElement } = render(
				<TextField
					inputRef={inputRef}
					name="Textfield"
					className="custom-class-name"
				/>
			),
			textField = baseElement.querySelector('.text-field'),
			acceptedClass = textField.classList.contains('custom-class-name')

		expect(acceptedClass).toBeTruthy()
	})

	it('should be able to accept auto-complete', () => {
		// eslint-disable-next-line
		let inputRef: any = {
			current: {}
		}

		let { baseElement } = render(
				<TextField
					inputRef={inputRef}
					name="Textfield"
					autoComplete="new-password"
				/>
			),
			input = baseElement.querySelector('.input')

		expect(input.getAttribute('autocomplete')).toBe('new-password')
	})

	it('should be able to accept input', () => {
		// eslint-disable-next-line
		let inputRef: any = {
			current: {}
		}

		let { baseElement } = render (
			<TextField
				inputRef={inputRef}
				name="Textfield"
			/>
		),
		input: HTMLInputElement = baseElement.querySelector(".input")

		fireEvent.change(input, {
			target: {
				value: "Hello World"
			}
		})

		expect(input.value).toBe("Hello World")
	})
})
