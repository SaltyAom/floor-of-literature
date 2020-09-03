import { useEffect } from 'react'

import { useRecoilState } from 'recoil'
import borrowedAtom from '@frontend/stores/borrowed'

import useSWR from 'swr'

import fetcher from '@helpers/fetcher'

import { Literatures } from '@data'
import Literature from '@frontend/components/literature'

const Landing = () => {
	let [, updateBorrowed] = useRecoilState(borrowedAtom)

	let { data: literatures, error } = useSWR<Literatures>(
		'http://localhost:8081/api/literature/list/0',
		fetcher
	)

	useEffect(() => {
		fetch('http://localhost:8081/api/literature/list_borrow', {
			credentials: 'include'
		})
			.then((res) => res.json())
			.then((borrowed) => {
				let borrowedList = borrowed.map(({ literature }) => literature)

				updateBorrowed(borrowedList)
			})
	}, [])

	if (error)
		return (
			<div>
				<h1>{error}</h1>
			</div>
		)

	if (!literatures)
		return (
			<div>
				<h1>Loading</h1>
			</div>
		)

	return (
		<main
			id="literatures"
			className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
		>
			{literatures.map(({ id, title, author }) => (
				<Literature key={id} {...{ id, title, author }} />
			))}
		</main>
	)
}

export default Landing
