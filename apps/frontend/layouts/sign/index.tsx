import "./sign.styl"

import { SignLayoutComponent } from "./types"

const SignLayout: SignLayoutComponent = ({
	children,
	onSubmit,
	action = ""
}) => (
	<form id="sign-layout" method="POST" {...{ onSubmit, action }}>
		{children}
	</form>
)

export default SignLayout
