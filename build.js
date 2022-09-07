const esbuild = require('esbuild')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

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

		exec(
			'tsc ./src/node.ts --declaration --emitDeclarationOnly --outDir dist',
		).catch(error => {
			throw new Error(error)
		}),
	])
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
			'tsc ./src/browser.ts --declaration --emitDeclarationOnly --outDir dist',
		).catch(error => {
			throw new Error(error)
		}),
	])
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
