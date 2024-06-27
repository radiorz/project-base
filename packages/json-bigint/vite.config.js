import { defineConfig } from 'vite'
import path from 'path'

/** 工具方法 */
const resolve = dir => path.join(__dirname, dir)

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': resolve('src')
		}
	},
	build: {
		lib: {
			// 库打包入口文件
			entry: resolve('src/index.js'),
			// 库暴露的全局变量
			name: 'JSONbig'
		}
	}
})
