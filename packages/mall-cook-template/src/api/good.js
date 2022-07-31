import Network from '@/utils/network'
export function getList(data,success,fail) {
	Network.setGet('good',data, function (res) {
		success(res)
	}, function (res) {
		uni.showToast({
			title: res.message,
			icon: 'none',
			duration: 2000
		})
	})
}
export function detail(id, data,success,fail) {
	Network.setGet('good/' + id,data, function (res) {
		success(res)
	}, function (res) {
		uni.showToast({
			title: res.message,
			icon: 'none',
			duration: 2000
		})
	})
}
export function goodCategory(data,success,fail) {
	Network.setGet('goodCategory',data, function (res) {
		success(res)
	}, function (res) {
		uni.showToast({
			title: res.message,
			icon: 'none',
			duration: 2000
		})
	})
}