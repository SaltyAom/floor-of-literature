import { atom } from 'recoil'

const tokenAtom = atom<boolean | undefined>({
	key: 'token',
	default: undefined
})

export default tokenAtom
