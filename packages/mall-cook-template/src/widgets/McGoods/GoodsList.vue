<!--
 * @Description: What's this for
 * @Autor: WangYuan
 * @Date: 2021-06-07 11:19:03
 * @LastEditors: WangYuan
 * @LastEditTime: 2022-02-11 11:46:46
-->
<template>
  <div class="wrap" :style="[getWrapStyle()]">
    <div class="list" :style="[getStyle()]">
      <!-- 商品列表 -->
      <template v-if="mList.length">
        <goods-item
          v-for="(item, index) in mList"
          :key="index"
          :item="item"
        ></goods-item>
      </template>

      <div
        v-else
        class="flex-column row-center w-100 pt20 pb20 bg-white f14 f-grey"
        style="height: 320px"
      >
        <!-- 加载中 -->
        <template v-if="loading"></template>

        <!-- 空列表 -->
        <template v-else>
          <image
            width="180"
            src="http://110.42.184.128:8090/img/1638500391170.jpg"
          />
          <span class="mt20">暂无商品</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsItem from "./GoodsItem.vue";
import { getList } from "@/api/good";
import { mapGetters } from "vuex";

export default {
  name: "GoodsList",

  components: { GoodsItem },

  inject: ["tabs"],

  props: {
    list: {
      type: Array,
      default: [],
    },
  },

  data() {
    return {
      loading: false,
      mList: [],
    };
  },

  computed: {
    ...mapGetters(["project"]),

    attr() {
      return this.tabs.config.attrs;
    },
  },

  watch: {
    list: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        this.loadData();
      },
    },
  },

  methods: {
    async loadData() {
      this.loading = true;
      const that = this
      await getList({
        projectId: this.project.id,
        ids: this.list,
      },function(res){
        that.mList = res.data;
        that.loading = false;
      })
    },

    getWrapStyle() {
      this.attr.listModel == "roll" ? { overflowX: "auto" } : {};
    },

    getStyle() {
      if (this.attr.listModel == "roll") {
        return {
          display: "flex",
          width: this.$unit((375 / 2.5) * this.list.length),
        };
      } else {
        return {
          display: "flex",
          flexWrap: "wrap",
          padding: `${this.$unit(5)} 0`,
        };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.empty {
  height: 200px;
  margin: auto;
}

.wrap {
  // 隐藏滚动条
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}

::v-deep .slot-body {
  display: flex;
  justify-content: center;
  background: #fff;
}
</style>