import { composeClass } from '@helpers/compose'

import Link from 'next/link'

import { ButtonComponent } from './types'

import './button.styl'

const Button: ButtonComponent = ({
	children,
	fluid = false,
	primary = false,
	space = false,
	asLink = false,
	href = '',
	transparent = false,
	onClick = () => null
}) => {
	let className = `button ${composeClass(fluid, '-fluid')} ${
		primary ? '-primary' : ''
	} ${composeClass(space, '-space')} ${composeClass(
		transparent,
		'-transparent'
	)}`

	return asLink ? (
		<Link href={href}>
			<a className={className}>{children}</a>
		</Link>
	) : (
		<button {...{ className, onClick }}>{children}</button>
	)
}

export default Button
