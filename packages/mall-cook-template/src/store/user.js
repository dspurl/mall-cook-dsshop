/*
 * @Description: What's this for
 * @Autor: WangYuan
 * @Date: 2022-02-07 09:50:30
 * @LastEditors: purl
 * @LastEditTime: 2022-07-19 15:18:35
 */
export default {
  state: {
    hasLogin: false,
    userInfo: {},
    refresh: false
  },
  getters: {
    hasLogin: state => state.hasLogin,
    userInfo: state => state.userInfo,
    refresh: state => state.refresh
  },
  mutations: {
    login(state, provider) {
      state.hasLogin = true
      state.userInfo = provider;
      if(!provider.update){
        uni.setStorageSync('dsshopApplytoken', provider.access_token)
        uni.setStorageSync('dsshopExpiresIn', (new Date()).getTime() + provider.expires_in * 1000)
        uni.setStorageSync('dsshopRefreshToken', provider.refresh_token)
        uni.setStorageSync('dsshopTokenType', provider.token_type)
        uni.setStorageSync('dsshopUserInfo', provider)
      }
      // console.log(state.userInfo);
    },
    logout(state) {
      uni.removeStorageSync('dsshopApplytoken')
      uni.removeStorageSync('dsshopExpiresIn')
      uni.removeStorageSync('dsshopRefreshToken')
      uni.removeStorageSync('dsshopTokenType')
      uni.removeStorageSync('applyDsshopSession_key')
      uni.removeStorageSync('applyDsshopOpenid')
      uni.removeStorageSync('dsshopUserInfo')
      uni.removeStorageSync('dsshopCartList')
      state.hasLogin = false;
      state.userInfo = {};
    },
    // 登录验证
    loginCheck(state){
      if(!state.hasLogin){
        uni.navigateTo({
          url:'/pages/public/login'
        })
      }else{
        if(new Date().getTime() >= uni.getStorageSync('dsshopExpiresIn')){
          uni.navigateTo({
            url:'/pages/public/login'
          })
        }
      }
    },
    // 刷新状态
    setRefresh(state, provider) {
      state.refresh = provider
    }
  }
}
