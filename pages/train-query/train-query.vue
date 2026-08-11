<template>
	<view class="page">
		<!-- 搜索表单 -->
		<view class="search-form">
			<view class="form-row">
				<view class="form-item">
					<text class="form-label">出发站</text>
					<input class="form-input" v-model="from" placeholder="如：北京南" @confirm="swapStation" />
				</view>
				<view class="swap-btn" @tap="swapStation">
					<text>⇄</text>
				</view>
				<view class="form-item">
					<text class="form-label">到达站</text>
					<input class="form-input" v-model="to" placeholder="如：上海虹桥" @confirm="searchTrains" />
				</view>
			</view>
			<view class="form-row date-row">
				<view class="form-item date-item">
					<text class="form-label">日期</text>
					<picker mode="date" :value="date" @change="onDateChange">
						<view class="date-picker">{{ date }}</view>
					</picker>
				</view>
				<button class="search-btn" @tap="searchTrains" :loading="loading">查 询</button>
			</view>
		</view>

		<!-- 历史/快捷选择 -->
		<view class="quick-stations" v-if="!searched">
			<view class="section-title">常用车站</view>
			<view class="station-tags">
				<view class="tag" v-for="(s, i) in quickStations" :key="i" @tap="fillStation(s)">{{ s }}</view>
			</view>
		</view>

		<!-- 查询结果 -->
		<view class="result-section" v-if="searched">
			<view class="result-header">
				<text class="result-route">{{ result.from }} → {{ result.to }}</text>
				<text class="result-date">{{ result.date }}</text>
			</view>
			<view class="result-count" v-if="result.total !== undefined">
				共查询到 <text class="count-num">{{ result.total }}</text> 个车次
			</view>
			<view class="train-list" v-if="trains.length > 0">
				<view class="train-card" v-for="(train, index) in trains" :key="index"
					@tap="goToTimetable(train.trainNo)">
					<view class="train-header">
						<text class="train-no">{{ train.trainNo }}</text>
						<text class="train-duration">{{ train.duration }}</text>
					</view>
					<view class="train-stations">
						<view class="station-item">
							<view class="station-dot"></view>
							<text class="station-name">{{ train.fromStation }}</text>
						</view>
						<view class="station-line"></view>
						<view class="station-item">
							<view class="station-dot arrival"></view>
							<text class="station-name">{{ train.toStation }}</text>
						</view>
					</view>
					<view class="train-time">
						<text class="time-value">{{ train.fromTime }}</text>
						<text class="time-sep">→</text>
						<text class="time-value">{{ train.toTime }}</text>
					</view>
				</view>
			</view>
			<view class="empty-state" v-if="trains.length === 0 && !loading">
				<text>未查询到车次信息</text>
			</view>
			<view class="elapsed" v-if="result.elapsed">
				查询耗时: {{ result.elapsed }}
			</view>
		</view>
	</view>
</template>

<script>
	import { getTrains } from '@/service/api.js'
	import { getName } from '@/common/station.js'

	export default {
		data() {
			return {
				from: '',
				to: '',
				date: '',
				loading: false,
				searched: false,
				result: {},
				trains: [],
				quickStations: ['北京南', '上海虹桥', '广州南', '深圳北', '杭州东', '成都东', '武汉', '南京南']
			}
		},
		onLoad() {
			const d = new Date()
			this.date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
		},
		methods: {
			swapStation() {
				const tmp = this.from
				this.from = this.to
				this.to = tmp
			},
			onDateChange(e) {
				this.date = e.detail.value
			},
			fillStation(name) {
				if (!this.from) {
					this.from = name
				} else if (!this.to) {
					this.to = name
				} else {
					this.from = name
					this.to = ''
				}
			},
			async searchTrains() {
				if (!this.from.trim()) {
					uni.showToast({ title: '请输入出发站', icon: 'none' })
					return
				}
				if (!this.to.trim()) {
					uni.showToast({ title: '请输入到达站', icon: 'none' })
					return
				}
				this.loading = true
				this.searched = true
				try {
					const res = await getTrains(this.from.trim(), this.to.trim(), this.date)
					if (res.success) {
						this.result = res
						const list = res.trains || []
						this.trains = await Promise.all(list.map(async (train) => ({
							...train,
							fromStation: (await getName(train.fromStation)) || train.fromStation,
							toStation: (await getName(train.toStation)) || train.toStation
						})))
					} else {
						this.trains = []
						uni.showToast({ title: '查询失败', icon: 'none' })
					}
				} catch (err) {
					this.trains = []
					uni.showToast({ title: '网络异常', icon: 'none' })
				} finally {
					this.loading = false
				}
			},
			goToTimetable(trainNo) {
				uni.navigateTo({
					url: `/pages/timetable/timetable?train=${trainNo}&date=${this.date}`
				})
			}
		}
	}
</script>

<style lang="scss">
.page { background: #f2f2f7; min-height: 100vh; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", sans-serif; -webkit-font-smoothing: antialiased; }

.search-form { background: rgba(255,255,255,0.8); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 14px; padding: 20px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 0.5px solid rgba(60,60,67,0.06); }
.form-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.form-row:last-child { margin-bottom: 0; }
.form-item { flex: 1; }
.form-label { font-size: 13px; font-weight: 600; color: #8e8e93; margin-bottom: 4px; display: block; text-transform: uppercase; letter-spacing: 0.5px; }
.form-input { width: 100%; font-size: 17px; color: #1c1c1e; padding: 10px 12px; background: #f5f7fa; border-radius: 10px; border: none; outline: none; box-sizing: border-box; }

.swap-btn { flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%; background: #f2f2f7; display: flex; align-items: center; justify-content: center; margin-top: 18px; font-size: 18px; color: #007aff; }
.swap-btn:active { background: #e5e5ea; }
.date-row { align-items: flex-end; }
.date-item { flex: 1; }
.date-picker { font-size: 17px; color: #1c1c1e; padding: 10px 12px; background: #f5f7fa; border-radius: 10px; }

.search-btn { flex-shrink: 0; background: #007aff; color: #fff; font-size: 16px; font-weight: 600; padding: 0 28px; height: 44px; line-height: 44px; border-radius: 22px; border: none; margin: 0; }
.search-btn:active { opacity: 0.8; }

.section-title { font-size: 13px; font-weight: 600; color: #8e8e93; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; padding-left: 4px; }
.station-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.tag { padding: 8px 16px; background: rgba(255,255,255,0.8); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 20px; font-size: 14px; color: #1c1c1e; font-weight: 500; box-shadow: 0 1px 3px rgba(0,0,0,0.04); border: 0.5px solid rgba(60,60,67,0.06); }
.tag:active { background: rgba(255,255,255,0.5); }

.result-section { margin-top: 8px; }
.result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 0 4px; }
.result-route { font-size: 17px; font-weight: 700; color: #1c1c1e; }
.result-date { font-size: 14px; color: #8e8e93; }
.result-count { font-size: 13px; color: #8e8e93; margin-bottom: 12px; padding: 0 4px; }
.count-num { color: #007aff; font-weight: 600; }

.train-list { display: flex; flex-direction: column; gap: 10px; }
.train-card { background: rgba(255,255,255,0.8); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 14px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 0.5px solid rgba(60,60,67,0.06); }
.train-card:active { opacity: 0.7; }
.train-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.train-no { font-size: 20px; font-weight: 700; color: #007aff; }
.train-duration { font-size: 14px; color: #8e8e93; background: #f2f2f7; padding: 2px 10px; border-radius: 10px; }

.train-stations { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.station-item { display: flex; align-items: center; gap: 6px; }
.station-dot { width: 8px; height: 8px; border-radius: 50%; background: #007aff; }
.station-dot.arrival { background: #ff3b30; }
.station-line { flex: 1; height: 1px; border-top: 1px dashed #c6c6c8; }
.station-name { font-size: 14px; color: #3a3a3c; font-weight: 500; }

.train-time { display: flex; align-items: center; gap: 8px; padding-left: 14px; }
.time-value { font-size: 15px; color: #1c1c1e; font-weight: 600; }
.time-sep { font-size: 12px; color: #c6c6c8; }

.empty-state { text-align: center; padding: 60px 0; color: #8e8e93; font-size: 15px; }
.elapsed { text-align: center; padding: 12px 0; font-size: 12px; color: #c6c6c8; }
</style>
