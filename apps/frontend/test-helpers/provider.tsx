import { RecoilRoot } from 'recoil'

const Provider = ({ children }) => (
	<RecoilRoot>
		{children}
	</RecoilRoot>
)

export default Provider
