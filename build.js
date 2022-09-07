const esbuild = require('esbuild')
// const childProcess = require('child_process')

// tsc .\src\browser.ts --declaration --emitDeclarationOnly --outDir dist

const buildNode = async () => {
	await Promise.all([
		esbuild.build({
			format: 'cjs',
			target: 'node12',
			bundle: true,
			outfile: 'dist/node.cjs',
			entryPoints: ['./src/node.ts'],
		}),

		esbuild.build({
			format: 'esm',
			target: 'es2020',
			bundle: true,
			outfile: 'dist/node.mjs',
			entryPoints: ['./src/node.ts'],
		}),
	])
}

const buildBrowser = async () => {
	await esbuild.build({
		format: 'esm',
		target: 'es2020',
		bundle: true,
		outfile: 'dist/browser.mjs',
		entryPoints: ['./src/browser.ts'],
	})
}

;(async () => {
	try {
		await buildNode()
		await buildBrowser()
		console.log('build succeed!!')
	} catch (error) {
		console.error(error)
		process.exit(1)
	}
})()
