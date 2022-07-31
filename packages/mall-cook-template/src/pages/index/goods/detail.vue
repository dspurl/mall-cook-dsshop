<!--
 * @Description: What's this for
 * @Autor: Purl
 * @Date: 2022-07-19 09:07:45
 * @LastEditors: Purl
-->
<template>
  <global-page :loading="loading" bgColor="#FFFFFF">
    <custom-capsule></custom-capsule>
    <view class="carousel">
      <video v-if="video" id="showVideo" :src="video" :poster="poster" class="showVideo"/>
      <view v-if="video" class="showVideoClose" @click.stop="closeVideo">关闭</view>
      <swiper indicator-dots circular="true" duration="400" v-if="getList.resources_many" @change="imgCtu">
        <swiper-item class="swiper-item" v-for="(item, index) in resources_many" :key="index" @click="showVideo">
          <view v-if="item.type === 'img'" class="image-wrapper" @click="imgList()"><image :src="item.img" class="loaded" mode="aspectFill" lazy-load></image></view>
          <view v-else class="image-wrapper">
            <image :src="poster" lazy-load class="loaded" mode="aspectFill"></image>
          </view>
          <view v-if="item.type === 'video'" class="playVideo text-white cuIcon-videofill"></view>
        </swiper-item>
      </swiper>
    </view>
    <!-- 秒杀 -->
    <template v-if="isSeckill">
      <view class="seckill-box" :class="{'active': getList.state === 1}">
        <view class="info">
          <view class="price-box">
            <view class="name">秒杀价</view>
            <view class="price"><span>¥</span>
              <template v-if="getList.price_show.length > 1">{{ getList.price_show[0] }} - {{ getList.price_show[1] }}</template>
              <template v-else-if="getList.price_show.length === 1">{{ getList.price_show[0] }}</template>
            </view>
          </view>
          <view class="original-box">
            <view class="name" v-if="getList.state === 1">即将恢复¥
              <template v-if="getList.market_price_show.length > 1">{{ getList.market_price_show[1] }}</template>
              <template v-else-if="getList.market_price_show.length === 1">{{ getList.market_price_show[0] }}</template>
            </view>
            <view v-else class="name">
              即将开始
            </view>
          </view>
        </view>
        <view class="countdown-box">
          <view class="triangle"></view>
          <view class="name"><text class="cuIcon-countdown"></text>限时秒杀</view>
          <count-down-time :time="getList.seckillTime" @end="endTime()"></count-down-time>
        </view>
      </view>
      <view class="seckill-abstract">{{getList.abstract}}</view>
    </template>

    <!-- 拼团-->
    <template v-else-if="isGroupPurchase">
      <view class="group-purchase-box" :class="{'active': getList.state === 1}">
        <view class="info">
          <view class="price-box">
            <view class="name">拼单价</view>
            <view class="price"><span>¥</span>
              <template v-if="getList.price_show.length > 1">{{ getList.price_show[0] }} - {{ getList.price_show[1] }}</template>
              <template v-else-if="getList.price_show.length === 1">{{ getList.price_show[0] }}</template>
            </view>
          </view>
          <view class="original-box">
            <view class="name" v-if="getList.state === 1">即将恢复¥
              <template v-if="getList.market_price_show.length > 1">{{ getList.market_price_show[1] }}</template>
              <template v-else-if="getList.market_price_show.length === 1">{{ getList.market_price_show[0] }}</template>
            </view>
            <view v-else class="name">
              即将开始
            </view>
          </view>
        </view>
        <view class="countdown-box">
          <view class="triangle"></view>
          <view class="name"><text class="cuIcon-friend"></text>{{getList.group_purchase_number}}人成团</view>
          <count-down-time :time="getList.groupPurchaseTime" @end="endTime()"></count-down-time>
        </view>
      </view>
      <view class="group-purchase-abstract">{{getList.abstract}}</view>
      <!-- 拼团负责人列表 -->
      <template v-if="foremanTotal > 0">
        <view class="foreman-box">
          <view class="title-box">
            <view class="title">这些人刚刚拼单成功，可参与拼单</view>
            <view v-if="foremanTotal > 2" class="more" @click="setModal('foreman')">查看更多<text class="cuIcon-right"></text></view>
          </view>
          <view class="foreman-list" v-for="(item,index) in foremanList" :key="index">
            <template v-if="index < 2">
              <view class="user-box">
                <view class="cu-avatar-group">
                  <view v-for="(item2,index2) in item.user" :key="index2" class="cu-avatar round" :style="[{ backgroundImage:'url('+(item2.portrait ? item2.portrait : require('@/static/missing-face.png'))+')' }]"></view>
                </view>
                <view class="username"><span v-for="(item2,index2) in item.user" :key="index2">{{item2.nickname}}<template v-if="index2+1 < item.user.length">,</template></span></view>
              </view>
              <view class="residue">
                <button class="cu-btn bg-pink" @click="toggleSpec(true, item.id)">去拼单</button>
              </view>
            </template>
          </view>
        </view>
        <!-- 更多-->
        <view class="cu-modal" :class="modalName=='foreman'?'show':''">
          <view class="cu-dialog">
            <view class="cu-bar bg-white justify-end">
              <view class="content">可参与的拼团</view>
              <view class="action">
                <text class="cuIcon-close text-red" @tap="hideModal"></text>
              </view>
            </view>
            <view class="foreman-box" style="height: 400rpx;overflow-y: auto;">
              <view class="foreman-list" v-for="(item,index) in foremanList" :key="index">
                <template v-if="index < 2">
                  <view class="user-box">
                    <view class="cu-avatar-group">
                      <view v-for="(item2,index2) in item.user" :key="index2" class="cu-avatar round sm" :style="[{ backgroundImage:'url('+(item2.portrait ? item2.portrait : require('@/static/missing-face.png'))+')' }]"></view>
                    </view>
                    <view class="username"><span v-for="(item2,index2) in item.user" :key="index2">{{item2.nickname}}<template v-if="index2+1 < item.user.length">,</template></span></view>
                  </view>
                  <view class="residue">
                    <button class="cu-btn bg-pink sm" @click="toggleSpec(true, item.id)">去拼单</button>
                  </view>
                </template>
              </view>
            </view>
          </view>
        </view>
      </template>
    </template>
    <view class="introduce-section" v-if="!isSeckill && !isGroupPurchase">
      <text class="title">{{ getList.name }}</text>
      <view class="price-box" v-if="inventoryFlag">
        <text class="price-tip">¥</text>
        <template v-if="getList.price_show">
          <text class="price" v-if="getList.price_show.length > 1">{{ getList.price_show[0] }} - {{ getList.price_show[1] }}</text>
          <text class="price" v-else-if="getList.price_show.length === 1">{{ getList.price_show[0] }}</text>
        </template>
        <template v-if="getList.market_price_show">
          <text class="m-price" v-if="getList.market_price_show.length > 1">¥{{ getList.market_price_show[1] }}</text>
          <text class="m-price" v-else-if="getList.market_price_show.length === 1">¥{{ getList.market_price_show[0] }}</text>
        </template>
      </view>
      <view class="bot-row">
        <text>库存: {{ getList.inventory_show }}</text>
        <text>销量: {{ getList.sales}}</text>
      </view>
    </view>
    <view class="c-list">
      <block v-if="getList.is_delete || getList.is_show !== 1">
        <view v-if="specificationDefaultDisplay" class="c-row b-b">
          <text class="tit">购买类型</text>
          <view class="con">
            <text class="selected-text">{{ specificationDefaultDisplay }}</text>
          </view>
          <text class="yticon icon-you"></text>
        </view>
      </block>
      <block v-else>
        <view v-if="specificationDefaultDisplay && !isSeckill && !isGroupPurchase" class="c-row b-b" @click="toggleSpec(true)">
          <text class="tit">购买类型</text>
          <view class="con">
            <text class="selected-text">{{ specificationDefaultDisplay }}</text>
          </view>
          <text class="yticon icon-you"></text>
        </view>
      </block>
      <!-- 优惠券按钮 -->
      <view v-if="verify.coupon && !isSeckill && !isGroupPurchase" class="c-row b-b" @click="changeShow(true)">
        <text class="tit">优惠券</text>
        <text class="con t-r red"></text>
        <text class="yticon icon-you"></text>
      </view>
      <!-- 优惠券-模态层弹窗  -->
      <coupon v-if="verify.coupon" :getList="couponList" :show="couponShow" @changeShow="changeShow"/>
    </view>
    <!-- 评价 -->
    <view class="eva-section" v-if="verify.comment">
      <view class="e-header">
        <text class="tit">评价</text>
        <text>({{commentTotal}})</text>
        <navigator hover-class="none" class="tip" :url="'/pages/comment/list?id='+ id">查看全部</navigator>
        <text class="yticon icon-you"></text>
      </view>
      <view class="eva-box" v-for="(item,index) in commentList" :key="index">
        <image class="portrait" :src="item.comment.portrait || '/static/missing-face.png'"  mode="aspectFill" lazy-load></image>
        <view class="right">
          <text class="name">{{item.comment.name}}</text>
          <text class="con">{{item.comment.details}}</text>
          <view class="bot">
            <text class="attr">购买类型：<span v-for="(ite,ind) in item.good_sku.product_sku" :key="ind" class="padding-right-xs">{{ite.value}}</span></text>
            <text class="time">{{item.comment.created_at.split(' ')[0]}}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="detail-desc">
      <view class="d-header"><text>图文详情</text></view>
      <u-parse :content="getList.details" lazyLoad/>
    </view>

    <!-- 底部操作菜单 -->
    <view class="page-bottom">
      <navigator url="/pages/index/tabbar/home" open-type="switchTab" class="p-b-btn">
        <u-icon
            class="btn-icon"
            name="home"
            size="36"
        ></u-icon>
        <text>首页</text>
      </navigator>
      <navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
        <u-icon
            class="btn-icon"
            name="shopping-cart"
            size="36"
        ></u-icon>
        <text>购物车</text>
      </navigator>
      <view class="p-b-btn" :class="{ active: favorite }" @click="toFavorite">
        <u-icon
            class="btn-icon"
            name="heart"
            size="36"
        ></u-icon>
        <text>收藏</text>
      </view>
      <view class="action-btn-group" v-if="getList.is_delete  || getList.is_show !== 1 || !inventoryFlag">
        <button type="primary" class=" action-btn no-border buy-now-btn" disabled>立即购买</button>
        <button type="primary" class=" action-btn no-border add-cart-btn" disabled>加入购物车</button>
      </view>
      <view class="action-btn-group" v-else-if="isSeckill">
        <button type="primary" class=" action-btn no-border buy-now-btn" :disabled="getList.state === 0" @click="toggleSpec(true)">立即购买</button>
        <button type="primary" class=" action-btn no-border add-cart-btn" disabled>加入购物车</button>
      </view>
      <view class="action-btn-group" v-else-if="isGroupPurchase">
        <button type="primary" class=" action-btn no-border buy-now-btn" :disabled="getList.state === 0" @click="toggleSpec(true, -1)">发起拼单</button>
        <button type="primary" class=" action-btn no-border add-cart-btn" disabled>加入购物车</button>
      </view>
      <view class="action-btn-group" v-else>
        <button type="primary" class=" action-btn no-border buy-now-btn" @click="toggleSpec(true)">立即购买</button>
        <button type="primary" class=" action-btn no-border add-cart-btn" :disabled="getList.type === '卡密/网盘' || getList.type === '下载商品'" @click="toggleSpec(true)">加入购物车</button>
      </view>
    </view>

    <!-- 规格-模态层弹窗 -->
    <view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
      <view class="mask"></view>
      <view class="layer attr-content" @click.stop="stopPrevent"><sku ref="sku" :getList="getList" :buy="buy" @toggleSpec="toggleSpec" @purchasePattern="purchasePattern"></sku></view>
    </view>
    <!-- 已删除或还未发布-->
    <view v-if="getList.is_show === 0" class="sold-out padding-sm">商品已经下架了~</view>
    <view v-if="inventoryFlag == false" class="sold-out padding-sm">商品已经售完了~</view>
    <!-- 拼团分享 -->
    <view v-if="isGroupPurchase" class="cu-modal" :class="modalName=='foremanShare'?'show':''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">拼单</view>
          <view class="action" @tap="hideModal">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding-xl foreman-share-box">
          <template v-if="foremanShare.id">
            <view class="cu-avatar round xl" :style="[{ backgroundImage:'url('+(foremanShare.portrait ? foremanShare.portrait : require('@/static/missing-face.png'))+')' }]">
              <view class="cu-tag badge">拼主</view>
            </view>
            <view class="name">{{foremanShare.nickname}}</view>
            <view class="time">{{foremanShare.created_at}}发起拼单</view>
            <button class="cu-btn bg-pink" @click="toggleSpec(true, foremanShare.id)">立即拼单</button>
          </template>
          <template v-else>
            <view class="msg">拼单邀请已失效</view>
          </template>
        </view>
      </view>
    </view>
  </global-page>
</template>

<script>

import { detail } from "@/api/good";
import uParse from '@/components/gaoyia-parse/parse.vue'
import share from '@/components/share';
import { param2Data } from '@/components/sku/sku2param';
import sku from '@/components/sku';
import Browse from '@/api/browse';
import Collect from '@/api/collect';
import {good as commentGood} from '@/api/comment'
import coupon from '@/pages/coupon/components/index'
import { getList as couponList } from '@/api/coupon'
import {verifyPlugin} from '@/api/plugin'
import CountDownTime from '@/pages/seckill/components/CountDownTime';
import {detail as seckillDetail} from '@/api/seckill'
import {detail as groupPurchaseDetail, foreman} from '@/api/groupPurchase'
import moment from 'moment'
import CustomCapsule from "@/components/custom-capsule";
import {
  mapMutations, mapGetters
} from 'vuex';
export default {
  components: {
    share,
    sku,
    uParse,
    coupon,
    CountDownTime,
    CustomCapsule
  },
  onLoad(options) {
    this.id = options.id
    if(options.gfid){
      this.gfid = options.gfid
    }
    this.getVerifyPlugin()
  },

  data() {
    return {
      loading: true,
      cartGood: {},
      id: '',
      specClass: 'none',
      specificationDefaultDisplay: '', // 规格默认显示
      getList:{
        is_delete:0,
        is_show:1
      },
      inventoryFlag: true, //true有货; false 无货
      shoppingAttributes: [], //购物属性
      favorite: false,
      shareList: [],
      poster: '',
      resources_many: [],
      video: '',
      index: 0,
      buy: false,
      commentList: [],
      commentTotal:0,
      couponList: [],
      couponShow: false,
      verify: {
        coupon: false,
        comment: false,
        seckill: false,
        groupPurchase: false
      },
      isSeckill: false,
      isGroupPurchase: false,
      foremanList: [],
      foremanTotal: 0,
      modalName: '',
      gfid: 0,
      foremanShare: {}
    };
  },

  computed: {
    ...mapGetters(['hasLogin'])
  },
  onReady: function (res) {
    this.videoContext = uni.createVideoContext('myVideo')
  },
  methods: {
    getVerifyPlugin(){
      const that = this
      verifyPlugin(['coupon','comment','seckill','groupPurchase'],function(res){
        that.verify = res
        if (that.id) {
          that.loadData(that.id);
          if(that.verify.comment){
            that.goodEvaluate()
          }
        }
        if (that.hasLogin){
          if(that.verify.coupon){
            that.getCoupon()
          }
        }
      })
    },
    //获取详情
    async loadData(id) {
      // 商品详情
      const that = this;
      await detail(id, {}, async function(res) {
        if (res.resources_many.length > 0) {
          res.resources_many.forEach((item,index)=>{
            if(item.depict.indexOf('_video') !== -1){
              item.type = 'video'
              that.resources_many.unshift(item)
            } else if(item.depict.indexOf('_poster') !== -1){
              that.poster = item.img
            } else {
              item.type = 'img'
              that.resources_many.push(item)
            }
          })
        }
        that.getList = res
        // 秒杀
        if(that.verify.seckill){
          await seckillDetail(id,{},function(response){
            if(response){
              that.isSeckill = true
              that.getList.name = response.name
              that.getList.abstract = response.abstract
              that.getList.details = response.details
              that.getList.state = response.state
              that.getList.resources_many = response.resources_many
              that.getList.seckill_time = response.time
              that.getList.seckill = true
              that.getList.seckill_id = response.id // 秒杀ID
              that.getList.price_show = response.price_show
              that.getList.market_price_show = response.market_price_show
              if(response.state){
                that.getList.seckillTime = (moment(response.end_time).valueOf()-moment().valueOf())/1000
              }else{
                that.getList.seckillTime = (moment(response.time).valueOf()-moment().valueOf())/1000
              }
              const good_sku = JSON.parse(JSON.stringify(that.getList.good_sku))
              let seckill_sku = {}
              that.getList.good_sku = []
              good_sku.forEach(item =>{
                seckill_sku = response.seckill_sku.find(items => items.good_sku_id === item.id)
                if(seckill_sku){
                  item.market_price = seckill_sku.price /100  // 售价
                  item.price = seckill_sku.seckill_price /100 // 原价
                  item.resources = seckill_sku.resources // sku图片
                  item.seckill_sku_id = seckill_sku.id // 秒杀SKU ID
                  item.inventory = seckill_sku.residue_limit // 库存
                  // 判断秒杀是不限制用户购买量
                  if(response.is_purchase_number === 1) {
                    that.getList.purchase_number = response.purchase_number
                  }
                  that.getList.good_sku.push(item)
                }
              })
              that.resources_many = []
              if (res.resources_many.length > 0) {
                res.resources_many.forEach((item,index)=>{
                  if(item.depict.indexOf('_video') !== -1){
                    item.type = 'video'
                    that.resources_many.unshift(item)
                  } else if(item.depict.indexOf('_poster') !== -1){
                    that.poster = item.img
                  } else {
                    item.type = 'img'
                    that.resources_many.push(item)
                  }
                })
              }
              that.$refs.sku._setData(that.getList.good_sku)
            }else{
              if(that.verify.groupPurchase){
                // 拼团
                groupPurchaseDetail(id,{},function(response){
                  if(response){
                    that.isGroupPurchase = true
                    that.getList.name = response.name
                    that.getList.abstract = response.abstract
                    that.getList.details = response.details
                    that.getList.state = response.state
                    that.getList.resources_many = response.resources_many
                    that.getList.group_purchase_time = response.time
                    that.getList.group_purchase = true
                    that.getList.group_purchase_id = response.id // 拼团ID
                    that.getList.group_purchase_number = response.number	// 拼团人数
                    that.getList.price_show = response.price_show
                    that.getList.market_price_show = response.market_price_show
                    if(response.state){
                      that.getList.groupPurchaseTime = (moment(response.end_time).valueOf()-moment().valueOf())/1000
                    }else{
                      that.getList.groupPurchaseTime = (moment(response.time).valueOf()-moment().valueOf())/1000
                    }
                    const good_sku = JSON.parse(JSON.stringify(that.getList.good_sku))
                    let group_purchase_sku = {}
                    that.getList.good_sku = []
                    good_sku.forEach(item =>{
                      group_purchase_sku = response.group_purchase_sku.find(items => items.good_sku_id === item.id)
                      if(group_purchase_sku){
                        item.market_price = group_purchase_sku.price /100  // 售价
                        item.price = group_purchase_sku.group_purchase_price /100 // 原价
                        item.resources = group_purchase_sku.resources // sku图片
                        item.group_purchase_sku_id = group_purchase_sku.id // 秒杀SKU ID
                        item.inventory = group_purchase_sku.residue_limit // 库存
                        that.getList.good_sku.push(item)
                      }
                    })
                    that.resources_many = []
                    if (res.resources_many.length > 0) {
                      res.resources_many.forEach((item,index)=>{
                        if(item.depict.indexOf('_video') !== -1){
                          item.type = 'video'
                          that.resources_many.unshift(item)
                        } else if(item.depict.indexOf('_poster') !== -1){
                          that.poster = item.img
                        } else {
                          item.type = 'img'
                          that.resources_many.push(item)
                        }
                      })
                    }
                    that.$refs.sku._setData(that.getList.good_sku)
                    // 获取拼团负责人列表
                    foreman(response.id,function(responses){
                      that.foremanList = responses.data
                      if(that.gfid){
                        that.modalName = 'foremanShare'
                        that.foremanShare = that.foremanList.find(item => item.id == that.gfid)
                        that.foremanShare = that.foremanShare ? that.foremanShare : {}
                      }
                      that.foremanTotal = responses.total
                    })

                  }
                })
              }
            }
          })
        }
        if(that.getList.good_sku.length<=0){
          that.inventoryFlag = false
        }
        if (that.hasLogin){
          that.browse()
        }
      })
      if (that.hasLogin){
        await Collect.detail(id, function(res) {
          if(res === 1){
            that.favorite = true
          } else {
            that.favorite = false
          }
        })
      }
      that.loading = false;
    },
    // 切换swiper
    imgCtu(item){
      this.index = item.target.current
    },
    // 点击视频弹出视频播放器（因swiper内套video无法点击播放按钮，故采用此解决方案）
    showVideo(){
      const resources_many = this.resources_many[this.index]
      if(resources_many.type === 'video'){
        this.video = resources_many.img
      }
    },
    // 关闭视频
    closeVideo(){
      this.video = ''
    },
    //访问记录
    browse() {
      const getList = this.getList
      Browse.create(getList, function(res) {})
    },
    // 图片预览
    imgList() {
      const img_lest = [];
      this.resources_many.forEach(item => {
        if (item.type !== 'video') {
          img_lest.push(item.img)
        }
      })
      uni.previewImage({
        urls: img_lest,
        longPressActions: {
          success: function(data) {},
          fail: function(err) {}
        }
      });
    },
    //规格弹窗开关
    toggleSpec(state, gropuPurchaseId) {
      if (!this.hasLogin && state === true){
        this.$api.msg('请先登录')
        return false
      }
      // 拼团
      if (gropuPurchaseId){
        this.getList.gropuPurchaseId = gropuPurchaseId
        this.modalName = null
      }
      if (typeof state === 'boolean'){
        this.buy=state
      }
      if (this.specClass === 'show') {
        this.specClass = 'hide';
        setTimeout(() => {
          this.specClass = 'none';
        }, 250);
      } else if (this.specClass === 'none') {
        this.specClass = 'show';
      }
    },
    //分享
    share() {
      this.$refs.share.toggleMask();
    },
    //收藏
    toFavorite() {
      if (this.hasLogin){
        const getList = this.getList
        if(this.favorite){	//移除
          Collect.destroy(getList.id,function(res){
          })
        }else{	//添加
          Collect.create(getList,function(res){

          })
        }
      }else{
        this.$api.msg('请先登录')
        return false
      }
      this.favorite = !this.favorite;
    },
    //购买类型展示
    purchasePattern(data) {
      this.specificationDefaultDisplay = data;
    },
    stopPrevent() {},
    // 获取评价列表
    goodEvaluate(){
      const that = this
      commentGood({
        limit: 2,
        page: 1,
        good_id:this.id,
        sort:'-created_at'
      },function(res){
        if(res.total>0){
          that.commentList = res.data
          that.commentTotal = res.total
        }
      })
    },
    // 优惠券显示隐藏
    changeShow(val){
      if (!this.hasLogin){
        this.$api.msg('请先登录')
        return false
      }
      this.couponShow = val
    },
    // 获取优惠券列表
    getCoupon(){
      const that = this
      couponList({}, function(res) {
        that.couponList = []
        res.data.forEach(item=>{
          let data = {
            id: item.id,
            money: item.cost/100,
            title: item.explain,
            type: item.type,
            time: item.start_time.split(' ')[0].replace(/-/g,".") + "-" + item.end_time.split(' ')[0].replace(/-/g,"."),
          }
          if(item.limit_get && item.user_coupon_count >= item.limit_get){
            data.state = "2"
          } else{
            data.state = "1"
          }
          that.couponList.push(data)
        })
      })
    },
    // 秒杀倒计时结束
    endTime(){
      this.loadData()
    },
    setModal(name) {
      this.modalName = name
    },
    hideModal(e) {
      this.modalName = null
    },
  },
};
</script>

<style lang="scss" scoped>
page {
  background: #f8f8f8;
  padding-bottom: 160rpx;
}
.icon-you {
  font-size: 30rpx;
  color: #888;
}
.carousel {
  height: 722rpx;
  position: relative;
  swiper {
    height: 100%;
  }
  .image-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .swiper-item {
    display: flex;
    justify-content: center;
    align-content: center;
    height: 750rpx;
    overflow: hidden;
    image {
      width: 100%;
      height: 100%;
    }
  }
}

/* 标题简介 */
.introduce-section {
  background: #fff;
  padding: 40rpx 30rpx;

  .title {
    font-size: 32rpx;
    color: #303133;
    height: 50rpx;
    line-height: 50rpx;
  }
  .price-box {
    display: flex;
    align-items: baseline;
    height: 64rpx;
    padding: 10rpx 0;
    font-size: 26rpx;
    color: #fa436a;
  }
  .price {
    font-size: 34rpx;
  }
  .m-price {
    margin: 0 12rpx;
    color: #909399;
    text-decoration: line-through;
  }
  .coupon-tip {
    align-items: center;
    padding: 4rpx 10rpx;
    background: #fa436a;
    font-size: 24rpx;
    color: #fff;
    border-radius: 6rpx;
    line-height: 1;
    transform: translateY(-4rpx);
  }
  .bot-row {
    display: flex;
    align-items: center;
    height: 50rpx;
    font-size: 24rpx;
    color: #909399;
    text {
      flex: 1;
    }
  }
}
/* 秒杀 */
.seckill-box{
  display: flex;
  .info{
    background: #E4E7ED;
    flex: 1;
    padding: 10rpx 30rpx;
    .price-box{
      display: flex;
      color: #fa524c;
      margin-bottom: 10rpx;
      .name{
        font-size: 24rpx;
        position: relative;
        top: 10rpx;
        margin-right: 8rpx;
      }
      .price{
        span{
          font-size:24rpx;
        }
        font-size: 40rpx;
        font-weight: bold;
      }
    }
    .original-box{
      .name{
        font-size:24rpx;
        color: #666;
      }
    }
  }
  .countdown-box{
    background: #d7dae1;
    padding: 10rpx 30rpx;
    position: relative;
    .name{
      margin-bottom: 10rpx;
    }
    .triangle{
      position: absolute;
      top: 45rpx;
      left: -15rpx;
      width: 0;
      height: 0;
      border-top: 10rpx solid transparent;
      border-right: 15rpx solid #d7dae1;
      border-bottom: 10rpx solid transparent;
    }
    .cuIcon-friend{
      font-size: 40rpx;
      position: relative;
    }
    font-size: 30rpx;
  }
  &.active{
    .info{
      background: #f42e90;
      .price-box{
        color: #fff;
      }
      .original-box{
        .name{
          font-size:24rpx;
          color:#e8e0e0;
        }
      }
    }
    .countdown-box{
      background: #fbbd08;
      .triangle{
        border-right: 15rpx solid #fbbd08;
      }
    }
  }
}
.seckill-abstract{
  background:#fa524c;
  color: #fff;
  font-size: 24rpx;
  padding: 10rpx 30rpx;
}
/* 拼团 */
.group-purchase-box{
  display: flex;
  .info{
    background: #E4E7ED;
    flex: 1;
    padding: 10rpx 30rpx;
    .price-box{
      display: flex;
      color: #fa524c;
      margin-bottom: 10rpx;
      .name{
        font-size: 24rpx;
        position: relative;
        top: 10rpx;
        margin-right: 8rpx;
      }
      .price{
        span{
          font-size:24rpx;
        }
        font-size: 40rpx;
        font-weight: bold;
      }
    }
    .original-box{
      .name{
        font-size:24rpx;
        color: #666;
      }
    }
  }
  .countdown-box{
    background: #d7dae1;
    padding: 10rpx 30rpx;
    position: relative;
    .name{
      margin-bottom: 10rpx;
    }
    .triangle{
      position: absolute;
      top: 45rpx;
      left: -15rpx;
      width: 0;
      height: 0;
      border-top: 10rpx solid transparent;
      border-right: 15rpx solid #d7dae1;
      border-bottom: 10rpx solid transparent;
    }
    .cuIcon-countdown{
      font-size: 40rpx;
      position: relative;
      top: 2rpx;
    }
    font-size: 30rpx;
  }
  &.active{
    .info{
      background: #D1478E;
      .price-box{
        color: #fff;
      }
      .original-box{
        .name{
          font-size:24rpx;
          color:#e8e0e0;
        }
      }
    }
    .countdown-box{
      background: #5BBAB4;
      .triangle{
        border-right: 15rpx solid #5BBAB4;
      }
    }
  }
}
.group-purchase-abstract{
  background:#835867;
  color: #fff;
  font-size: 24rpx;
  padding: 10rpx 30rpx;
}
.foreman-box{
  background-color: #fff;
  margin: 20rpx 0;
  .title-box{
    display: flex;
    padding: 10rpx 30rpx;
    border-bottom: 1px solid #F2F6FC;
    .title{
      flex:1;
    }
    .more{
      color: #aaaaaa;
    }
  }
  .foreman-list{
    display: flex;
    align-items:center;
    padding: 20rpx 30rpx 20rpx 10rpx;
    border-bottom: 1px solid #F2F6FC;
    .user-box{
      flex: 1;
      display: flex;
      align-items:center;
      min-width:0;
      .username{
        margin-left: 10rpx;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        width: 260rpx;
      }
    }
    .residue{
      display: flex;
      align-items:center;
    }
  }
}
.foreman-share-box{
  .name{
    margin: 10rpx 0;
  }
  .time{
    color: #aaaaaa;
    margin-bottom: 20rpx;
  }
  .msg{
    color: #aaaaaa;
    margin-top: 10rpx;
  }
}
.cu-modal{
  z-index: 100;
}
/* 分享 */
.share-section {
  display: flex;
  align-items: center;
  color: #606266;
  background: linear-gradient(to left, #fdf5f6, #fbebf6);
  padding: 12rpx 30rpx;
  .share-icon {
    display: flex;
    align-items: center;
    width: 70rpx;
    height: 30rpx;
    line-height: 1;
    border: 1px solid #fa436a;
    border-radius: 4rpx;
    position: relative;
    overflow: hidden;
    font-size: 22rpx;
    color: #fa436a;
    &:after {
      content: '';
      width: 50rpx;
      height: 50rpx;
      border-radius: 50%;
      left: -20rpx;
      top: -12rpx;
      position: absolute;
      background: #fa436a;
    }
  }
  .icon-xingxing {
    position: relative;
    z-index: 1;
    font-size: 24rpx;
    margin-left: 2rpx;
    margin-right: 10rpx;
    color: #fff;
    line-height: 1;
  }
  .tit {
    font-size: 28rpx;
    margin-left: 10rpx;
  }
  .icon-bangzhu1 {
    padding: 10rpx;
    font-size: 30rpx;
    line-height: 1;
  }
  .share-btn {
    flex: 1;
    text-align: right;
    font-size: 24rpx;
    color: #fa436a;
  }
  .icon-you {
    font-size: 24rpx;
    margin-left: 4rpx;
    color: #fa436a;
  }
}

.c-list {
  font-size: 26rpx;
  color: #606266;
  background: #fff;
  .c-row {
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;
    position: relative;
  }
  .tit {
    width: 140rpx;
  }
  .con {
    flex: 1;
    color: #303133;
    .selected-text {
      margin-right: 10rpx;
    }
  }
  .bz-list {
    height: 40rpx;
    font-size: 26rpx;
    color: #303133;
    text {
      display: inline-block;
      margin-right: 30rpx;
    }
  }
  .con-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    color: #303133;
    line-height: 40rpx;
  }
  .red {
    color: #fa436a;
  }
}

/* 评价 */
.eva-section {
  display: flex;
  flex-direction: column;
  padding: 20rpx 30rpx;
  background: #fff;
  margin-top: 16rpx;
  .e-header {
    display: flex;
    align-items: center;
    height: 70rpx;
    font-size: 26rpx;
    color: #909399;
    .tit {
      font-size: 30rpx;
      color: #303133;
      margin-right: 4rpx;
    }
    .tip {
      flex: 1;
      text-align: right;
    }
    .icon-you {
      margin-left: 10rpx;
    }
  }
}
.eva-box {
  display: flex;
  padding: 20rpx 0;
  .portrait {
    flex-shrink: 0;
    width: 80rpx;
    height: 80rpx;
    border-radius: 100px;
  }
  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: 28rpx;
    color: #606266;
    padding-left: 26rpx;
    .con {
      font-size: 28rpx;
      color: #303133;
      padding: 20rpx 0;
    }
    .bot {
      display: flex;
      justify-content: space-between;
      font-size: 24rpx;
      color: #909399;
    }
  }
}
/*  详情 */
.detail-desc {
  background: #fff;
  margin-top: 16rpx;
  .d-header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80rpx;
    font-size: 30rpx;
    color: #303133;
    position: relative;
    text {
      padding: 0 20rpx;
      background: #fff;
      position: relative;
    }
  }
}

/* 规格选择弹窗 */
.attr-content {
  padding: 10rpx 30rpx;
  .a-t {
    display: flex;
    image {
      width: 170rpx;
      height: 170rpx;
      flex-shrink: 0;
      margin-top: -40rpx;
      border-radius: 8rpx;
    }
    .right {
      display: flex;
      flex-direction: column;
      padding-left: 24rpx;
      font-size: 26rpx;
      color: #606266;
      line-height: 42rpx;
      .price {
        font-size: 32rpx;
        color: #fa436a;
        margin-bottom: 10rpx;
      }
      .selected-text {
        margin-right: 10rpx;
      }
    }
  }
  .specification {
    max-height: 700rpx;
    overflow-y: auto;
  }
  .attr-list {
    position: relative;
    display: flex;
    flex-direction: column;
    font-size: 30rpx;
    color: #606266;
    padding-top: 30rpx;
    padding-left: 10rpx;
  }
  .item-left {
    display: flex;
    width: 120rpx;
    margin-bottom: 60rpx;
  }
  .item-right .step {
    right: 0rpx;
    left: auto;
    bottom: 50rpx;
  }
  .item-list {
    padding: 20rpx 0 0;
    display: flex;
    flex-wrap: wrap;
    text {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #eee;
      margin-right: 20rpx;
      margin-bottom: 20rpx;
      border-radius: 100rpx;
      min-width: 60rpx;
      height: 60rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
      color: #303133;
    }
    .selected {
      background: #fbebee;
      color: #fa436a;
    }
    .disabled {
      color: #C0C4CC;
    }
  }
}
.popup {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 99;

  &.show {
    display: block;
    .mask {
      animation: showPopup 0.2s linear both;
    }
    .layer {
      animation: showLayer 0.2s linear both;
    }
  }
  &.hide {
    .mask {
      animation: hidePopup 0.2s linear both;
    }
    .layer {
      animation: hideLayer 0.2s linear both;
    }
  }
  &.none {
    display: none;
  }
  .mask {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.4);
  }
  .layer {
    position: fixed;
    z-index: 99;
    bottom: 0;
    width: 100%;
    min-height: 40vh;
    border-radius: 10rpx 10rpx 0 0;
    background-color: #fff;
    .btn {
      height: 66rpx;
      line-height: 66rpx;
      border-radius: 100rpx;
      background: #fa436a;
      font-size: 30rpx;
      color: #fff;
      margin: 30rpx auto 20rpx;
    }
  }
  @keyframes showPopup {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes hidePopup {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  @keyframes showLayer {
    0% {
      transform: translateY(120%);
    }
    100% {
      transform: translateY(0%);
    }
  }
  @keyframes hideLayer {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(120%);
    }
  }
}

/* 底部操作菜单 */
.page-bottom {
  position: fixed;
  left: 30rpx;
  bottom: 30rpx;
  z-index: 95;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 690rpx;
  height: 100rpx;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.5);
  border-radius: 16rpx;
  .btn-icon{
    margin-bottom: 8rpx;
  }
  .p-b-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
    color: #606266;
    width: 96rpx;
    height: 80rpx;
    .yticon {
      font-size: 40rpx;
      line-height: 48rpx;
      color: #909399;
    }
    &.active,
    &.active .yticon {
      color: #fa436a;
    }
    .icon-fenxiang2 {
      font-size: 42rpx;
      transform: translateY(-2rpx);
    }
    .icon-shoucang {
      font-size: 46rpx;
    }
  }
  .action-btn-group {
    display: flex;
    height: 76rpx;
    border-radius: 100px;
    overflow: hidden;
    box-shadow: 0 20rpx 40rpx -16rpx #fa436a;
    box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
    background: linear-gradient(to right, #ffac30, #fa436a, #f56c6c);
    margin-left: 20rpx;
    position: relative;
    &:after {
      content: '';
      position: absolute;
      top: 50%;
      right: 50%;
      transform: translateY(-50%);
      height: 28rpx;
      width: 0;
      border-right: 1px solid rgba(255, 255, 255, 0.5);
    }
    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 180rpx;
      height: 100%;
      font-size: 28rpx;
      padding: 0;
      border-radius: 0;
      background: transparent;
      &:after{
        border: none;
      }
    }
  }
}
.showVideo{
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height: 722rpx;
  z-index: 999;
}
.showVideoClose{
  position: fixed;
  right:10rpx;
  top:20rpx;
  background-color: #FFFFFF;
  padding:20rpx;
  z-index: 1000;
}
.playVideo{
  position: absolute;
  top:300rpx;
  opacity: 1;
  font-size: 120rpx;
}
.sold-out{
  text-align: center;
  position: fixed;
  left:0;
  bottom: 140rpx;
  width: 100%;
  background-color: #999999;
  color: #FFFFFF;
  z-index: 3;
}
</style>