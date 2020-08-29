const { colors } = require("tailwindcss/defaultTheme")

module.exports = {
	purge: [],
	theme: {
		colors: {
			...colors,
			primary: {
				default: "#007aff",
				text: "#fff"
			}
		},
		extend: {}
	},
	variants: {},
	plugins: []
}
