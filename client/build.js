require("dotenv").config()
const { build } = require("esbuild")
const path = require("path")

const options = {
  entryPoints: [
    path.resolve(__dirname, 'src/index.jsx')
  ],
  minify: process.env.NODE_ENV === 'production',
  bundle: true,
  target: 'es2016',
  platform: 'browser',
  outfile: path.resolve(__dirname, 'dist/build.min.js'),
}

build(options).catch(err => {
  process.stderr.write(err.stderr)
  process.exit(1)
})