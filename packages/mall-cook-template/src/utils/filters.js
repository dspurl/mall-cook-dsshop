/*
 * @Description: 全局过滤器
 * @Autor: WangYuan
 * @Date: 2021-09-15 19:48:43
 * @LastEditors: WangYuan
 * @LastEditTime: 2021-09-16 11:47:12
 */
import Vue from 'vue'

const filters = {
    // 价格显示 分 -> 元  （带两位小数）  
    moneyDec(target) {
        return (target / 100).toFixed(2)
    },

    // 价格显示 分 -> 元
    money(target) {
        return target / 100
    },
    //字符串转货币, 保留二位小数
    1000(val) {
        return (parseFloat(val)).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    },
    //显示小图片
    smallImage(img,size) {
        const index=img.lastIndexOf('.');
        if(!size)
            size=300;
        return img.substring(0,index) + '_'+ size +'.' + img.substring(index+1,img.length);
    }
}

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})