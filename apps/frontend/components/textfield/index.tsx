import { RefObject } from 'react'

import { TextFieldComponent } from './types'

import './textfield.styl'

const TextField: TextFieldComponent = ({
	name,
	inputRef,
	type = 'text',
	onChange = () => null,
	placeholder = 'Placeholder',
	className = '',
	autoComplete = ''
}) => (
	<div className={`text-field ${className}`}>
		<input
			className="input"
			placeholder=" "
			ref={inputRef}
			{...{ type, onChange, name, autoComplete }}
		/>
		<label className="label" htmlFor={name}>
			{placeholder}
		</label>
	</div>
)

export const get = (ref: RefObject<HTMLInputElement>): string =>
	ref.current.value

export default TextField
