//index.js
//获取应用实例
import {goList, goRecharge, goInstruction, goMine, goProduct} from '../../router/routes'
import {request} from '../../api/request'
import { login } from '../../utils/login'
import { tip } from '../../utils/tip'
const app = getApp()
Page({
    data: {
        inputShowed: false, // 控制input初始化文字提示显示
        inputVal: "",
        disabledTrue: true, // 禁止input聚焦 
        painTrue: true,
        /* 坐标 */
        longitude: 114.207034,
        latitude: 30.550434,
        markers: [] // 需要做对应处理
    },
    // 路由
    goList,
    goRecharge,
    goInstruction,
    markersGo(e) {
      goProduct(e)
    },
    location() { // 悬浮按钮
      let that = this
      wx.getLocation({
        type: 'gcj02',
        success(res) {
          that.setData({
            longitude: res.longitude,
            latitude: res.latitude
          })
        }
      })
    },
    scan() { // 扫描
      wx.scanCode({
        success(res) {
          wx.navigateTo({
            url: '/' + res.path
          })
        }
      })
    },
    bindGetUserInfo(e) { // 跳转主页按钮
      tip.loading();
      login().then(res => {
        tip.loaded();
        if(res) {
          goMine();
        }
      });
    },
    onShow: function () {// 加载用户位置，并存入到全局变量
      // 打印url参数
      if (app.globalData.listInput) {
          this.setData({
              inputShowed: true,
              inputVal: app.globalData.listInput
          })
      } else {
          this.setData({
              inputShowed: false,
              inputVal: ""
          })
      }
      let that = this
      wx.getLocation({
          type: 'gcj02',
          success(res) {
              tip.loaded();
              // 存全局data中
              app.globalData.longitude = res.longitude
              app.globalData.latitude = res.latitude

              that.setData({
                  longitude: res.longitude,
                  latitude: res.latitude
              })
              request('POST','/api/Homepage/index',{
                data:{
                  lng: res.longitude,
                  lat: res.latitude
                }
              })
              .then(res => {
                res = res.data
                let i = 0
                res.forEach(item => {
                  let obj = { // 设置markers
                    ['markers[' + i + '].longitude']: parseFloat(item.lng),
                    ['markers[' + i + '].latitude']: parseFloat(item.lat),
                    ['markers[' + i + '].id']: item.id,
                    ['markers[' + i + '].iconPath']: '../../static/images/position_go.png',
                    ['markers[' + i + '].width']: 40,
                    ['markers[' + i + '].height']: 38
                  }
                  that.setData(obj)
                  i++
                })
              })
          },
          fail() {
              tip.alert('请打开位置授权，否则无法正确定位');
          }
      })
    },
    onLoad: function (options) {
      // tip.loading()
      if(options.key){ //通过分享进来，存入key值
        wx.setStorageSync('key',options.key)
      }
      wx.openSetting({
        success(res) {
          if(!res.authSetting['scope.userInfo']){
            wx.removeStorageSync('session3rd')
          }
        }
      })
    }
});