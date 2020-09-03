/* eslint-disable */
const withStylus = require('@zeit/next-stylus'),
	withPurge = require('next-purgecss')

const withPlugins = require('next-compose-plugins')

const { join } = require('path')

module.exports = withPlugins(
	[
		[withStylus],
		// [
		// 	withPurge,
		// 	{
		// 		purgeCssPaths: ['pages/**/*', 'components/**/*', 'layouts/**/*']
		// 	}
		// ]
	],
	{
		webpack(config, options) {
			const splitChunks =
				config.optimization && config.optimization.splitChunks

			if (splitChunks) {
				const cacheGroups = splitChunks.cacheGroups
				const preactModules = /[\\/]node_modules[\\/](preact|preact-render-to-string|preact-context-provider)[\\/]/

				if (cacheGroups.framework) {
					cacheGroups.preact = Object.assign(
						{},
						cacheGroups.framework,
						{
							test: preactModules
						}
					)
					cacheGroups.commons.name = 'framework'
				} else
					cacheGroups.preact = {
						name: 'commons',
						chunks: 'all',
						test: preactModules
					}
			}

			config.resolve.alias = {
				...config.resolve.alias,
				react: 'preact/compat',
				'react-dom': 'preact/compat',
				'react-render-to-string': 'preact-render-to-stirng',
				'@frontend/pages': join(__dirname, 'pages'),
				'@frontend/styles': join(__dirname, 'styles'),
				'@frontend/fonts': join(__dirname, 'public/fonts'),
				'@frontend/components': join(__dirname, 'components'),
				'@frontend/libs': join(__dirname, 'libs'),
				'@frontend/stores': join(__dirname, 'stores'),
				'@frontend/layouts': join(__dirname, 'layouts'),
				'@frontend/test-helpers': join(__dirname, 'test-helpers'),
				'@icons': join(__dirname, '../../', 'libs/icons/src'),
				'@helpers': join(__dirname, 'libs/helpers/src'),
				'@data': join(__dirname, 'libs/data/src'),
				'@types': join(__dirname, 'libs/types/src')
			}

			return config
		}
	}
)
