if (typeof document === 'object') {
  console.warn('Secret envars used client side')
}

const env = {
  PAGE_PASSWORD_COOKIE_NAME: process.env.PAGE_PASSWORD_COOKIE_NAME || 'mf-password-protected',
  PAGE_PASSWORD: process.env.PAGE_PASSWORD || '12345',
}

export default env
