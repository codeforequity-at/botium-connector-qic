import fs from 'fs'
import { builtinModules } from 'module'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'

const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf-8'))

const externals = [
  ...builtinModules,
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {})
]

export default {
  input: 'index.js',
  external: (id) => externals.some(dep => id === dep || id.startsWith(dep + '/')),
  output: [
    {
      file: 'dist/botium-connector-qic-es.js',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'dist/botium-connector-qic-cjs.js',
      format: 'cjs',
      exports: 'default',
      sourcemap: true
    }
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true
    }),
    json()
  ]
}
