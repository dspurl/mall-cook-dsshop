<!--
 * @Description: 首页后第二个tabbar页面
 * @Autor: WangYuan
 * @Date: 2022-03-22 10:32:43
 * @LastEditors: purl
 * @LastEditTime: 2022-07-23 14:44:50
-->
<template>
  <tabbar-page v-if="flag" :location="3"></tabbar-page>
</template>

<script>
import tabbarPage from "@/components/tabbar-page";
import {mapGetters} from "vuex";

export default {
  data(){
	return {
		flag: false
    }
  },
  components: {
    tabbarPage,
  },
  computed: {
    ...mapGetters(['hasLogin'])
  },
  onShow() {
	  this.flag = true
    // 每次进入页面，返回顶部
    uni.pageScrollTo({
      scrollTop: 0,
    });
  },
  onHide(){
	  this.flag = false
  },
  // #ifndef MP
  onNavigationBarButtonTap(e) {
    let url = '/pages/set/set'
    if(!this.hasLogin){
      url = '/pages/public/login';
    }
    uni.navigateTo({
      url
    })
  }
  // #endif
};
</script>

