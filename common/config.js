/**
 * 本地配置文件
 * 集中放置 App 密钥等配置。修改后重新编译生效。
 * 运行时读取优先级：设置页覆盖值（本地存储）> 本文件配置 > keys.js 内建默认值
 */
export default {
	keys: {
		amap: '你自己的key', // 高德 Web服务（静态地图、定位）
		amap_js: '你自己的key', // 高德 JS API（路网地图）
		amap_sec: '你自己的key' // 高德 JS API 安全密钥
	}
}
