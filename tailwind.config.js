const { colors } = require('tailwindcss/defaultTheme')

module.exports = {
	// ? For some reason, purge doesn't work with nx.
	// purge: [
	//     'apps/liliya/[pages|layouts|components/styles]/**/*.[js|jsx|ts|tsx|css|styl|html]',
	//     'dist/apps/liliya/**/*.[html|css|js]',
	//     'node_modules/tailwindcss/*.css'
	// ],
	theme: {
		colors: {
			...colors,
			primary: {
				default: '#007aff',
				text: '#fff'
			}
		},
		extend: {}
	},
	variants: {},
	plugins: [],
	future: {
		removeDeprecatedGapUtilities: true
	}
}
