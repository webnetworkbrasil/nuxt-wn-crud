const { resolve, join } = require('path')
const { readdirSync } = require('fs')

export default function (moduleOptions) {
  const options = {
    ...moduleOptions
  }
  if (!options.namespace) options.namespace = 'WnCrud'

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