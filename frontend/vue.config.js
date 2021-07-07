module.exports = {
    devServer: {
        proxy: {
            '/': {
                target: 'https://localhost:9443/',
                changeOrigin: true
            }
        }
    }
}