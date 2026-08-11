/**
 * 功能数据集中定义
 * 首页宫格 / 自定义卡片托盘 / 分区详情页 统一从这里取数据
 */

export const FEATURES = [
	{ id: 'train-query', icon: 'fa-train', label: '车次查询', path: 'train-query', color: '#007aff', group: 'travel' },
	{ id: 'timetable', icon: 'fa-calendar-alt', label: '时刻表', path: 'timetable', color: '#34c759', group: 'travel' },
	{ id: 'train-locate', icon: 'fa-map-marker-alt', label: '实时位置', path: 'train-locate', color: '#ff2d55', group: 'travel' },
	{ id: 'line-map', icon: 'fa-map', label: '铁路线路图', path: 'line-map', color: '#a2845e', group: 'travel' },

	{ id: 'station-screen', icon: 'fa-desktop', label: '车站大屏', path: 'station-screen', color: '#5856d6', group: 'station' },
	{ id: 'ticket-gate', icon: 'fa-ticket-alt', label: '检票口', path: 'ticket-gate', color: '#ff3b30', group: 'station' },
	{ id: 'traffic-query', icon: 'fa-bus', label: '交通查询', path: 'traffic-query', color: '#5ac8fa', group: 'station' },
	{ id: 'station-code', icon: 'fa-building', label: '车站代码', path: 'station-code', color: '#34c759', group: 'station' },

	{ id: 'emu-query', icon: 'fa-subway', label: '运用担当', path: 'emu-query', color: '#af52de', group: 'tracking' },
	{ id: 'rail-network-map', icon: 'fa-map', label: '路网地图', path: 'rail-network-map', color: '#ff9500', group: 'tracking' },

	{ id: 'souvenir-ticket', icon: 'fa-print', label: '纪念车票', path: 'souvenir-ticket', color: '#ff9500', group: 'fun' },
	{ id: 'train-broadcast', icon: 'fa-bullhorn', label: '列车广播', path: 'train-broadcast', color: '#007aff', group: 'fun' },
]

export const SECTIONS = [
	{
		id: 'travel',
		title: '出行服务',
		subtitle: '查询列车车次、时刻表与实时运行位置',
		icon: 'fa-train',
		badgeColor: '#007aff',
		bgImage: '../../static/section-travel.jpg',
		features: ['train-query', 'timetable', 'train-locate', 'line-map'],
	},
	{
		id: 'station',
		title: '车站服务',
		subtitle: '车站信息、检票口查询及交通接驳指南',
		icon: 'fa-building',
		badgeColor: '#5856d6',
		bgImage: '../../static/section-station.jpg',
		features: ['station-screen', 'ticket-gate', 'traffic-query', 'station-code'],
	},
	{
		id: 'tracking',
		title: '路网查询',
		subtitle: '车组担当与全国路网查询',
		icon: 'fa-satellite',
		badgeColor: '#af52de',
		bgImage: '../../static/section-tracking.jpg',
		features: ['emu-query', 'rail-network-map'],
	},
	{
		id: 'fun',
		title: '趣味工具',
		subtitle: '生成纪念车票与体验列车语音广播',
		icon: 'fa-gift',
		badgeColor: '#ff9500',
		bgImage: '../../static/section-fun.jpg',
		features: ['souvenir-ticket', 'train-broadcast'],
	},
]

/**
 * 按 id 取功能
 */
export function getFeature(id) {
	return FEATURES.find(f => f.id === id)
}

/**
 * 由功能 id 列表解析出完整功能对象
 */
export function getFeaturesByIds(ids) {
	return (ids || [])
		.map(id => getFeature(id))
		.filter(Boolean)
}
