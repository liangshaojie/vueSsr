
require('babel-core/register')({
  'presets': [
    'stage-3',
    'latest-node'
  ],
  'plugins': [

  ]
})

require('babel-polyfill')
require('./server')
