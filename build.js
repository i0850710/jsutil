const esbuild = require('esbuild')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

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

		exec(
			'dts-bundle-generator -o dist/node.d.ts src/node.ts',
		).catch(error => {
			throw new Error(error)
		}),
	])

	console.log('node build succeed!!')
}

const buildBrowser = async () => {
	await Promise.all([
		esbuild.build({
			format: 'esm',
			target: 'es2020',
			bundle: true,
			outfile: 'dist/browser.mjs',
			entryPoints: ['./src/browser.ts'],
		}),

		exec(
			'dts-bundle-generator -o dist/browser.d.ts src/browser.ts',
		).catch(error => {
			throw new Error(error)
		}),
	])

	console.log('browser build succeed!!')
}

;(async () => {
	try {
		await Promise.all([buildNode(), buildBrowser()])
		console.log('---')
		console.log('all succeed!!')
	} catch (error) {
		console.error(error)
		process.exit(1)
	}
})()
