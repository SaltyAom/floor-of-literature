import { useEffect } from 'react'

import { useRecoilState } from 'recoil'
import tokenAtom from '@frontend/stores/token'

import { useRouter } from 'next/router'

const Logout = () => {
	let [, updateToken] = useRecoilState(tokenAtom)

	let router = useRouter()

	useEffect(() => {
		fetch(`http://localhost:8080/api/signout`, {
			method: 'POST',
			credentials: 'include'
		})
			.then((res) => res.json())
			.then(({ success }) => {
				updateToken(success)

				router.push('/')
			})
	}, [])

	return null
}

export default Logout
