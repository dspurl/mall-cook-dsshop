<!--
 * @Description: 处理初始化逻辑
 * @Autor: WangYuan
 * @Date: 2022-01-11 14:40:06
 * @LastEditors: WangYuan
 * @LastEditTime: 2022-02-09 10:08:04
-->

<script>
import { mapMutations } from "vuex";
import { getPlatform,getLogin } from 'utils'
import Login from '@/api/login.js'
import store from '@/store'
export default {
  created() {
    this.getSystemInfo();
  },
  onLaunch: function(options) {
    // uni.clearStorage()
    this.setSecret(options);
    // #ifdef MP
    if (uni.getStorageSync('applyDsshopOpenid')) {
      this.checkSession();
    } else {
      getLogin();
    }
    // #endif

  },
  methods: {
    ...mapMutations(["setStatusHeight", "setSystemInfo", "login"]),

    // 获取并设置状态栏高度
    getSystemInfo() {
      let that = this;

      uni.getSystemInfo({
        success: function (res) {
          let height = res.statusBarHeight;
          that.setStatusHeight(height);
          that.setSystemInfo(res);
        },
      });
    },
    setSecret(options) {
      let userInfo = uni.getStorageSync('dsshopUserInfo') || '';
      if (userInfo && uni.getStorageSync('dsshopApplytoken')) {
        //更新登陆状态
        userInfo.update = 1
        this.login(userInfo)
      }
    },
    // 检测登录状态是否过期
    checkSession() {
      let that = this;
      uni.checkSession({
        success() {},
        fail() {
          getLogin();
        }
      });
    },
    // 获取购物车角标
    showDsshopCartNumber(){
      const dsshopCartNumber = uni.getStorageSync('dsshopCartList') ? Object.keys(uni.getStorageSync('dsshopCartList')).length + '' : ''
      if(dsshopCartNumber && dsshopCartNumber != '0'){
        uni.setTabBarBadge({
          index: 2,
          text: dsshopCartNumber
        })
      }else{
        uni.removeTabBarBadge({
          index: 2
        })
      }
    }
  },
  onShow: function() {
    this.showDsshopCartNumber()
    uni.addInterceptor('request', {
      invoke(args) {
        if(args.url.indexOf('refreshToken') === -1){
          if(uni.getStorageSync('dsshopExpiresIn') && !store.state.refresh){
            if ((new Date()).getTime() >= uni.getStorageSync('dsshopExpiresIn') - 300 * 1000) { // token失效前5分钟会自动刷新token
              store.commit('setRefresh',true)
              // 计时器的作用是防止刷新token早于其它接口触发前触发导致接口数据获取失效，可用vue-router或是服务端配置token的时间
              setTimeout(function(){
                Login.refreshToken({
                  refresh_token: uni.getStorageSync('dsshopRefreshToken')
                },function(res){
                  store.commit('login',res)
                  store.commit('setRefresh',false)
                })
              },5000);

            }
          }
        }
      }
    })
  },
};
</script>

<style lang="scss">
@import "./static/font/iconfont.css";
</style>
