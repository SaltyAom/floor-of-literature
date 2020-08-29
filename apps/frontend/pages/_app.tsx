import { AppProps } from 'next/app'

import { RecoilRoot } from 'recoil'

import LoginGuard from '@frontend/layouts/loginGuard'

import '@frontend/styles/init.styl'

const App = ({ Component, pageProps }: AppProps) => (
	<RecoilRoot>
		<LoginGuard>
			<Component {...pageProps} />
		</LoginGuard>
	</RecoilRoot>
)

export default App
