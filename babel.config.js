module.exports = {
	presets: ['module:metro-react-native-babel-preset'],
	plugins: [
		[
			'babel-plugin-root-import',
			{
				rootPathPrefix: '~',
				rootPathSuffix: 'src',
			},
		],
		'babel-plugin-styled-components',
		[
			'babel-plugin-inline-import',
			{
				extensions: ['.svg'],
			},
		],
	],
	env: {
		production: {
			plugins: ['react-native-paper/babel'],
		},
	},
};
