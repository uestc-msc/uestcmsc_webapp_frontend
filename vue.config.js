const { verbose_name } = require('./package.json');

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],

  pwa: {
		name: verbose_name,
		manifestPath: 'static/icons/manifest.json',
		iconPaths: {
			favicon32: 'static/icons/favicon-32x32.png',
			favicon16: 'static/icons/favicon-16x16.png',
			appleTouchIcon: 'static/icons/apple-icon-152x152.png',
			maskIcon: 'static/icons/apple-icon-152x152.png',
			msTileImage: 'static/icons/ms-icon-144x144.png',
		},
		themeColor: '#1E88E5',
		msTileColor: '#2B5797',
		appleMobileWebAppCapable: 'yes',
		appleMobileWebAppStatusBarStyle: 'black',
		workboxOptions: {
			swDest: 'static/js/service-worker.js',
			importsDirectory: 'static/js/',
		},
	},

	outputDir: undefined,
	assetsDir: 'static',
	runtimeCompiler: undefined,
	productionSourceMap: undefined,
	parallel: undefined,
  css: undefined,

  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title=verbose_name;
        return args;
      })
  }
}
