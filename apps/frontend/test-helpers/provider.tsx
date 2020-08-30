import { RecoilRoot } from 'recoil'

import LoginGuard from '@frontend/layouts/loginGuard'

const Provider = ({ children }) => (
	<RecoilRoot>
		<LoginGuard>{children}</LoginGuard>
	</RecoilRoot>
)

export default Provider
