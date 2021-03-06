import { ReactNode, FunctionComponent } from 'react'

export interface ButtonProps {
    children: ReactNode | string
    fluid?: boolean
    primary?: boolean
    space?: boolean
    asLink?: boolean
    href?: string
    transparent?: boolean
    onClick?: () => void
}

export type ButtonComponent = FunctionComponent<ButtonProps>