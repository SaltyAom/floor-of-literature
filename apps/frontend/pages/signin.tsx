import { useState, useRef, useCallback, useEffect } from 'react'

import { useRecoilState } from 'recoil'
import tokenAtom from '@frontend/stores/token'

import { useRouter } from 'next/router'

import SignLayout from '@frontend/layouts/sign'

import TextField, { get } from '@frontend/components/textfield'
import Button from '@frontend/components/button'

import { EventForm } from '@helpers/types'

const SignIn = () => {
	let [error, updateError] = useState('')

	let usernameRef = useRef<HTMLInputElement>(),
		passwordRef = useRef<HTMLInputElement>()

	let router = useRouter()

	let [token] = useRecoilState(tokenAtom)

	useEffect(() => {
		if (token) router.push('/')
	}, [token])

	let signup: EventForm = useCallback((event) => {
		event.preventDefault()

		let username = get(usernameRef),
			password = get(passwordRef)

		if (username.length < 5)
			return updateError('Username has to be atleast 5 characters')

		if (password.length < 5)
			return updateError('Password has to be atleast 5 characters')

		if (username.length > 32)
			return updateError('Username can have maximum at 64 characters')

		if (password.length > 32)
			return updateError('Password can have maximum at 64 characters')

		fetch('http://localhost:8080/api/signin', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username,
				password
			})
		})
			.then((res) => res.json())
			.then(({ success, detail }) => {
				if (success) router.push('/')
				else updateError(detail)
			})
	}, [])

	return (
		<SignLayout onSubmit={signup}>
			<h2 className="title">Sign In</h2>
			<p className="sub-title">Floor of Literature</p>
			<TextField
				inputRef={usernameRef}
				name="username"
				placeholder="Username"
				autoComplete="username"
			/>
			<TextField
				inputRef={passwordRef}
				name="password"
				placeholder="Password"
				type="password"
				autoComplete="current-password"
			/>
			{error ? <p className="error">{error}.</p> : null}
			<Button primary fluid space>
				Sign in
			</Button>
			<Button asLink href="/signup" fluid transparent>
				Sign up
			</Button>
		</SignLayout>
	)
}

export default SignIn
