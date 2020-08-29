import { AppProps } from "next/app"

import "@frontend/styles/init.styl"

const CustomApp = ({ Component, pageProps }: AppProps) => {
	return <Component {...pageProps} />
}

export default CustomApp
