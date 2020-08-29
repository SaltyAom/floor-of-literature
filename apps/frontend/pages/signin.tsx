import { useRef } from 'react'

import SignLayout from '@frontend/layouts/sign'

import TextField, { get } from '@frontend/components/textfield'
import Button from '@frontend/components/button'

import { EventForm } from '@helpers/types'

const SignIn = () => {
	let usernameRef = useRef<HTMLInputElement>(),
		passwordRef = useRef<HTMLInputElement>()

	let signup: EventForm = (event) => {
		event.preventDefault()

		let username = get(usernameRef),
			password = get(passwordRef)

		if(!username || !password)
			return

		if(username.length < 5 || password.length < 5)
			return

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
			.then((data) => {
				console.log(data)
			})
	}

	return (
		<SignLayout onSubmit={signup}>
			<h2 className="title">Sign In</h2>
			<p className="sub-title">Floor of Literature</p>
			<TextField
				ref={usernameRef}
				name="username"
				placeholder="Username"
			/>
			<TextField
				ref={passwordRef}
				name="password"
				placeholder="Password"
				type="password"
			/>
			<Button primary fluid space>
				Signup
			</Button>
			<Button asLink href="/signup" fluid transparent>
				Signup
			</Button>
		</SignLayout>
	)
}

export default SignIn
