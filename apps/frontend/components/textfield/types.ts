import { RefObject, FunctionComponent, ChangeEvent } from "react"

export interface TextFieldProps {
	ref: RefObject<HTMLInputElement>
	name: string
	type?: string
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void
	placeholder?: string
	className?: string
}

export type TextFieldComponent = FunctionComponent<TextFieldProps>