const path = require('path')

module.exports = {
  webpack: {
    eslint: {
      enable: true
    },
    alias: {
      '@': path.resolve(__dirname, 'src/')
    },
    configure: {
      ignoreWarnings: [/Failed to parse source map/],
      resolve: {
        fallback: {
          https: false,
          http: false,
          path: false,
          zlib: false
        }
      }
    }
  },
  jest: {
    configure: {
      verbose: true,
      moduleNameMapper: {
        '^@Components/(.*)$': '<rootDir>/src/Components/$1',
        '^@State/(.*)$': '<rootDir>/src/State/$1'
      }
    }
  },
  plugins: []
}
