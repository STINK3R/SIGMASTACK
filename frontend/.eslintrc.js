module.exports = {
  root: true,
  extends: ['react-app'],
  plugins: ['react'],
  rules: {
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}; 