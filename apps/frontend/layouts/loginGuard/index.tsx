import { useEffect } from 'react'

import { useRecoilState } from 'recoil'
import tokenAtom from '@frontend/stores/token'

import { useRouter } from 'next/router'

const LoginGuard = ({ children }) => {
	let [, updateToken] = useRecoilState(tokenAtom)

	let { pathname } = useRouter() || { pathname: '/' }

	useEffect(() => {
		let whitelist = ['/signout']

		if (!whitelist.includes(pathname))
			fetch('http://localhost:8080/api/refresh', {
				method: 'POST',
				credentials: 'include'
			})
				.then((res) => res.json())
				.then(({ success }) => {
					updateToken(success)
				})
	}, [])

	return children
}

export default LoginGuard
