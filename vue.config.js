module.exports = {
    configureWebpack: {
        devServer: {
            host: "localhost", //要设置当前访问的ip 否则失效
            open: true, //浏览器自动打开页面
            port: 8081,
            proxy: {
                //名字可以自定义，这里我用的是api
                '/api': {
                    target: 'http://localhost:8080', //设置你调用的接口域名和端口号 别忘了加http
                    changeOrigin: true, //这里设置是否跨域
                    pathRewrite: {
                        '^/api': ''
                    }
                }
            }
        }
    },
}