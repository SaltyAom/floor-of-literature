import { RefObject } from "react"

import { TextFieldComponent } from "./types"

import "./textfield.styl"

const TextField: TextFieldComponent = ({
	name,
	ref,
	type = "text",
	onChange = () => null,
	placeholder = "Placeholder",
	className = ""
}) => (
	<div className={`text-field ${className}`}>
		<input
			className="input"
			value=""
			placeholder=" "
			{...{ type, onChange, name, ref }}
		/>
		<label className="label" htmlFor={name}>
			{placeholder}
		</label>
	</div>
)

export const get = (ref: RefObject<HTMLInputElement>): string =>
	/* @ts-ignore */
	ref.current.base.firstElementChild.value

export default TextField
