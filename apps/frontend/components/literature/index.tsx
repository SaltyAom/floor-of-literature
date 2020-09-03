import { useCallback } from 'react'

import { useRecoilState } from 'recoil'
import borrowedAtom from '@frontend/stores/borrowed'

import { Heart, Bookmark } from '@icons'

import { composeClass } from '@helpers/compose'

import { LiteratureComponent } from './types'

import './literature.styl'

const Literature: LiteratureComponent = ({ title, id, author }) => {
	let [borrowed] = useRecoilState(borrowedAtom)

	let borrow = useCallback(() => {
		fetch('http://localhost:8081/api/literature/borrow', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id
			})
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data)
			})
	}, [])

	let isBorrowed = typeof borrowed === "undefined" || borrowed.includes(id)

	return (
		<article className="literature">
			<section className="detail">
				<h1 className="title">{title}</h1>
				<p className="author">{author}</p>
			</section>
			<footer className="footer">
				<button
					className={`borrow ${composeClass(isBorrowed, '-disabled')}`}
					disabled={isBorrowed}
					onClick={borrow}
				>
					Borrow
				</button>
				<div className="actions">
					<button className="action -heart">
						<Heart />
					</button>
					<button className="action -bookmar">
						<Bookmark />
					</button>
				</div>
			</footer>
		</article>
	)
}

export default Literature
