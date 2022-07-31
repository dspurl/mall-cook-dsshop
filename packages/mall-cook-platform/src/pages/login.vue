<!--
 * @Description: iframe加载页
-->
<template>
  <div class="login">
    <span class="el-icon-loading"></span>加载中
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { getProjectById } from "@/api/project";

export default {
  name: "login",

  created() {
    this.login()
  },

  data() {
    return {
    };
  },
  methods: {
    ...mapMutations(["setToken", "setProject"]),
    // 登录
    async login() {
      const that = this;
      window.addEventListener("message", async function (e) {
        if (e.source != window.parent) return;
        if (e.data) {
          let { even, params } = e.data;
          if (even == "init") {
            that.setToken(params.Authorization)
            const {message} = await getProjectById();
            that.setProject(message);
            that.$router.push({ name: "mall" });
          }
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
  .login{
    margin-top:20%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #999999;
    .el-icon-loading{
      font-size: 24px;
      margin-right: 5px;
    }
  }
</style>
