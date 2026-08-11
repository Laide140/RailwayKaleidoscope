/**
 * 铁路万花筒 - API 服务层
 * 统一封装所有铁路信息查询接口
 */

import { getKey } from '@/common/keys.js'

const BASE_URL = 'https://rail.laide.asia'
const RG_BASE_URL = 'https://rail.laide.asia/api'

/**
 * 通用请求封装
 */
async function request(url, options = {}) {
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			method: options.method || 'GET',
			data: options.data || {},
			header: options.header || {},
			timeout: options.timeout || 15000,
			success: (res) => {
				resolve(res.data)
			},
			fail: (err) => {
				console.error('请求失败:', url, err)
				reject(err)
			}
		})
	})
}

/**
 * 1. 获取车站代码映射
 * GET /api/getStationCode/index.php
 * @returns {Promise<Array<string>>} 车站代码列表
 */
export function getStationCode() {
	return request(`${BASE_URL}/api/getStationCode/index.php`)
}

/**
 * 2. 查询车次
 * GET /api/getTrains
 * @param {string} from - 始发站名称
 * @param {string} to - 终点站名称
 * @param {string} [date] - 日期 YYYY-MM-DD，默认今天
 * @returns {Promise<Object>} 车次列表
 */
export function getTrains(from, to, date) {
	const data = { from, to }
	if (date) data.date = date
	return request(`${BASE_URL}/api/getTrains`, { data })
}

/**
 * 3. 获取车次时刻表
 * GET /api/getTrainTimeTable/index.php
 * @param {string} train - 车次号
 * @param {string} date - 日期 YYYY-MM-DD
 * @returns {Promise<Object>} 时刻表数据
 */
export function getTrainTimeTable(train, date) {
	return request(`${BASE_URL}/api/getTrainTimeTable/index.php`, {
		data: { train, date }
	})
}

/**
 * 4. 查询列车实时位置
 * GET /api/getTrainLocate/index.php
 * @param {string} train - 车次号
 * @returns {Promise<Object>} 实时位置数据
 */
export function getTrainLocate(train) {
	return request(`${BASE_URL}/api/getTrainLocate/index.php`, {
		data: { train }
	})
}

/**
 * 5. 生成纪念车票
 * GET /api/getTicket
 * @param {Object} params - 车票参数
 * @returns {Promise<ArrayBuffer>} 图片二进制数据
 */
export function getTicket(params) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${BASE_URL}/api/getTicket`,
			data: params,
			method: 'GET',
			responseType: 'arraybuffer',
			timeout: 30000,
			success: (res) => {
				resolve(res.data)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

/**
 * 6. 车站大屏
 * GET /api/v2/getStationBigScreen
 * @param {string} stationTelecode - 车站电报代码
 * @returns {Promise<Object>} 车站大屏数据
 */
export function getStationBigScreen(stationTelecode) {
	return request(`${RG_BASE_URL}/getStationBigScreen`, {
		data: { stationTelecode }
	})
}

/**
 * 7. 检票口/站台查询
 * GET /api/v2/getExit
 * @param {string} trainNum - 车次号
 * @param {string} stationTelecode - 车站电报代码
 * @returns {Promise<Object>} 检票口和站台信息
 */
export function getExit(trainNum, stationTelecode) {
	return request(`${RG_BASE_URL}/getExit`, {
		data: { trainNum, stationTelecode }
	})
}

/**
 * 8. 铁路线路图数据
 * GET /api/v2/mapLine
 * @param {string} train - 车次号
 * @returns {Promise<Object>} 线路图数据
 */
export function getMapLine(train) {
	return request(`${RG_BASE_URL}/mapLine`, {
		data: { train }
	})
}

/**
 * 9. 检票口查询（12306官方）
 * POST /index/otn/index12306/queryTicketCheck
 * @param {string} trainDate - 日期 YYYY-MM-DD
 * @param {string} station_train_code - 车次号
 * @param {string} from_station_telecode - 车站电报代码
 * @returns {Promise<Object>} 检票口信息
 */
export function queryTicketCheck(trainDate, station_train_code, from_station_telecode) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: 'https://www.12306.cn/index/otn/index12306/queryTicketCheck',
			method: 'POST',
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: {
				trainDate,
				station_train_code,
				from_station_telecode
			},
			success: (res) => {
				resolve(res.data)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

/**
 * 10. 获取铁路 GeoJSON 文件列表
 * GET /api/getTrainTimeTable/railway/index.php
 * @returns {Promise<Object>} { file_list: string[] }
 */
export function getRailwayIndex() {
	return request(`${BASE_URL}/api/getTrainTimeTable/railway/index.php`)
}

/**
 * 11. 获取铁路 GeoJSON 数据
 * GET /api/getTrainTimeTable/railway/{filename}
 * @param {string} filename - GeoJSON 文件名（如 110000.geojson）
 * @returns {Promise<Object>} GeoJSON FeatureCollection
 */
export function getRailwayGeoJSON(filename) {
	return request(`${BASE_URL}/api/getTrainTimeTable/railway/${filename}`, { timeout: 30000 })
}

/**
 * 12. 高德地图静态图（含路线路径和标记）
 * 不传 location/zoom，让高德自动根据 paths 计算合适的地图范围
 * @param {string} size - 图片尺寸 如 600*400（必须用 * 分隔）
 * @param {string} [markers] - 标记点，格式如 "mid,0xFF0000,0:lng,lat;lng,lat"
 * @param {string} [paths] - 路线路径，格式如 "3,0x3377FF,0.8,,:lng,lat;lng,lat"
 * @returns {string} 图片URL
 */
export function getAmapStaticMap(size, markers, paths) {
	const key = getKey('amap')
	let url = `https://restapi.amap.com/v3/staticmap?size=${size}&key=${key}`
	if (markers) url += `&markers=${encodeURIComponent(markers)}`
	if (paths) url += `&paths=${encodeURIComponent(paths)}`
	return url
}

/**
 * 解析车站代码数据
 * @param {Array<string>} rawData - 原始车站代码数据
 * @returns {Array<Object>} 解析后的车站列表
 */
export function parseStationCode(rawData) {
	if (!Array.isArray(rawData)) return []
	return rawData.map(item => {
		const parts = item.split('|')
		return {
			code: parts[0] ? parts[0].replace('@', '') : '',
			name: parts[1] || '',
			telecode: parts[2] || '',
			pinyin: parts[3] || '',
			abbr: parts[4] || '',
			cityCode: parts[6] || '',
			city: parts[7] || ''
		}
	})
}

/**
 * 13. 列车广播 TTS 语音合成 - 讯飞（自有接口）
 * GET /api/getXiaoYanTTS/
 * @param {string} text - 广播文本内容
 * @param {Object} [opts] - 可选参数
 * @param {number} [opts.speed] - 语速，默认 1.0
 * @param {number} [opts.pitch] - 音调，默认 1.0
 * @returns {string} 音频流 URL（可直接用于 audioContext.src）
 */
export function getTrainBroadcastUrl(text, opts = {}) {
	const _t = Date.now()
	const speed = opts.speed ? '&speed=' + opts.speed : ''
	const pitch = opts.pitch ? '&pitch=' + opts.pitch : ''
	return BASE_URL + '/api/getXiaoYanTTS/?context=' + encodeURIComponent(text) + speed + pitch + '&_t=' + _t
}

/**
 * 14. 列车广播 TTS 语音合成 - 百度
 * GET https://fanyi.baidu.com/gettts
 * @param {string} text - 广播文本内容
 * @param {number} [speed=5] - 语速 1-9
 * @returns {string} 音频流 URL
 */
export function getBaiduTtsUrl(text, speed = 5) {
	const _t = Date.now()
	return 'https://fanyi.baidu.com/gettts?lan=zh&text=' + encodeURIComponent(text) + '&spd=' + speed + '&source=web&_t=' + _t
}

export default {
	getStationCode,
	getTrains,
	getTrainTimeTable,
	getTrainLocate,
	getTicket,
	getStationBigScreen,
	getExit,
	getMapLine,
	queryTicketCheck,
	getRailwayIndex,
	getRailwayGeoJSON,
	getAmapStaticMap,
	parseStationCode,
	getTrainBroadcastUrl,
	getBaiduTtsUrl
}
