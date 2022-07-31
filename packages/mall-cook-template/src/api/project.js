import Network from '@/utils/network'
export function detail(id, data,success,fail) {
	Network.setGet('project/' + id,data, function (res) {
		success(res)
	}, function (res) {
		uni.showToast({
			title: res.message,
			icon: 'none',
			duration: 2000
		})
	})
}