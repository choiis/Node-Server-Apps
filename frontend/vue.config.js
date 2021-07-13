module.exports = {
    devServer: {
        proxy: {
            '/api/*': {
                target: 'https://localhost:9443/',
                changeOrigin: true,
                pathRewrite: { "^/api": "/" },
            }
        }
    }
}