import { FunctionComponent, ReactNode } from 'react'

import { EventForm } from '@helpers/types'

export interface SignLayoutProps {
    children?: ReactNode
    onSubmit?: EventForm
    action?: string
}

export type SignLayoutComponent = FunctionComponent<SignLayoutProps>