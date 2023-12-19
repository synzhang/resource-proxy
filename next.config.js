/** @type {import('next').NextConfig} */

module.exports = {
  async rewrites() {
    return [
      {
        source: '/gemini',
        destination: 'https://generativelanguage.googleapis.com',
      },
    ]
  },
}