
const  webpack = require('webpack')
const HtmlWebapckPlugin = require('html-webpack-plugin')
const path = require('path')
const isProduction = process.env.NODE_ENV === 'production'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    mode: isProduction? 'production' : 'development',
    entry: './src/index.tsx',
    output: {
        path: path.join(__dirname, 'dist'), // 打包后的输出
        filename: 'main.js'// 打包后文件名 
    },
    devtool: isProduction ? 'source-map': false,
    devServer:{
        port: 8080,
        hot: true,
        contentBase: path.join(__dirname, 'public'), // 静态文件更目录
        historyApiFallback: { // 刷新重定向，回到首页
            index: './index.html'
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '~': path.resolve(__dirname, 'node_modules')
        },
        extensions: ['.ts','.tsx','.js','.jsx','.json']
    },
    module: {
        rules:[
            {
                test:/\.(j|t)sx?$/,
                loader: 'babel-loader', // ts-loader性能比较差
                options: {
                    presets: [
                        "@babel/preset-env", // 解析ES+
                        "@babel/preset-react", // 机械React Jsx语法
                        "@babel/preset-typescript"
                    ],
                    plugins: [// 按需加载
                        ['import',{libraryName: 'antd',style: 'css'}]
                    ]
                },
                include: path.resolve('src'),
                exclude: /node_modules/
            },
            {
                test:/\.css?$/,
                use:[
                    isProduction ? MiniCssExtractPlugin.loader : "style-loader",
                    {
                        loader:'css-loader'
                    }
                ]
            },
            {
                test:/\.less?$/,
                use:[
                    isProduction ? MiniCssExtractPlugin.loader : "style-loader",
                    {
                        loader:'css-loader',
                        options:{importLoaders: 3} // import导入前需要几个loader处理
                    },
                    {
                        loader: 'postcss-loader',
                        options:{
                            postcssOptions: {
                                plugins: ['autoprefixer']
                            }
                        }
                    },
                    {
                        loader: 'px2rem-loader', 
                        options: {
                            remUnit: 75,
                            remPrecesion: 8 // 计算后的小数精度8
                        }
                    },
                    "less-loader"
                ]
            },
            {
                test:/\.(jpg|png|gif|svg|jpeg)/,
                type: 'asset', // 以前url-loader或者file-loader, 现在不需要webpack5支持了
            }
        ]
    },
    plugins:[
        new HtmlWebapckPlugin({
            template: './src/index.html'
        })
    ]
}

