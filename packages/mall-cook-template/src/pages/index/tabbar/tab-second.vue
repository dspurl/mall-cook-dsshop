<!--
 * @Description: 首页后第二个tabbar页面
 * @Autor: WangYuan
 * @Date: 2022-03-22 10:32:43
 * @LastEditors: WangYuan
 * @LastEditTime: 2022-03-22 14:45:04
-->
<template>
  <tabbar-page v-if="flag" :location="2"></tabbar-page>
</template>

<script>
import tabbarPage from "@/components/tabbar-page";

export default {
  data(){
	  return {
		flag: false
	  }
  },
  components: {
    tabbarPage,
  },
  onShow() {
  	  this.flag = true
  },
  onHide(){
  	  this.flag = false
  },
};
</script>
