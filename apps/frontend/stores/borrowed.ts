import { atom } from 'recoil'

const borrowedAtom = atom<number[] | undefined>({
	key: 'borrowed',
	default: undefined
})

export default borrowedAtom
