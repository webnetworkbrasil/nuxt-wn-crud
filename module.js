const { resolve, join } = require('path')
const { readdirSync } = require('fs')

export default function (moduleOptions) {
  const options = {
    ...moduleOptions,
    ...this.options.wnCrud
  }

  if (!options.namespace) options.namespace = 'WnCrud'
  const { namespace } = options

  const pluginsToSync = [
    'components/index.js'
  ]
  for (const pathString of pluginsToSync) {
    this.addPlugin({
      src: resolve(__dirname, pathString),
      fileName: join(namespace, pathString),
      options
    })
  }
  const foldersToSync = ['components/lib']
  for (const pathString of foldersToSync) {
    const path = resolve(__dirname, pathString)
    for (const file of readdirSync(path)) {
      this.addTemplate({
        src: resolve(path, file),
        fileName: join(namespace, pathString, file),
        options
      })
    }
  }
}

module.exports.meta = require('./package.json')