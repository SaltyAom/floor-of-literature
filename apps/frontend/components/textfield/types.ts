import { RefObject, FunctionComponent, ChangeEvent } from 'react'

export interface TextFieldProps {
	inputRef: RefObject<HTMLInputElement>
	name: string
	type?: string
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void
	placeholder?: string
	className?: string
	autoComplete?: string
}

export type TextFieldComponent = FunctionComponent<TextFieldProps>
