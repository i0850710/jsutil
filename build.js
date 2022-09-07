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
			entryPoints: ['./packages/node/index.ts'],
		}),

		esbuild.build({
			format: 'esm',
			target: 'es2020',
			bundle: true,
			outfile: 'dist/node.mjs',
			entryPoints: ['./packages/node/index.ts'],
		}),

		exec(
			'dts-bundle-generator -o dist/node.d.ts packages/node/index.ts',
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
			entryPoints: ['./packages/browser/index.ts'],
		}),

		exec(
			'dts-bundle-generator -o dist/browser.d.ts packages/browser/index.ts',
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
