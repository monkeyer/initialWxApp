// pages/mine/index.js
import {goOrder, goBack, goIndex, goRecord, goShare, goBind} from '../../router/routes'
import {request} from '../../api/request'
import {tip} from '../../utils/tip'
import {service} from '../../utils/service'

Page({
  // 数据
  data: {
    auth: false,
    bindPhone: false,
    phone:0,
    balance: 0
  },
  // 路由
  goOrder,
  goBack,
  goRecord,
  goShare,
  goBind,
  // 点击授权
  getUserInfo: function() {
    this.setAuth()
  },
  getPhoneNumber: function(e) {
    request('POST','/api/User/bindMobile',{
      header:{
        session3rd: wx.getStorageSync('session3rd')
      },
      data:{
        encryptedData:e.detail.encryptedData,
        iv:e.detail.iv
      }
    })
    .then((res) => {
      if(res.status === 1){
        res = res.data
        this.setData({
          bindPhone: true,
          phone:res.mobile
        })
        this.setPhoneAndBalance() //绑定后请求后台数据
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    this.setPhoneAndBalance()
  },
  // 客服
  service,
  // 自定义函数
  setPhoneAndBalance: function () {
    request('POST','/api/Center/personal',{
      header:{
        session3rd: wx.getStorageSync('session3rd')
      }
    })
    .then((res) => {
      if(res.status === 1){
        res = res.data
        this.setData({ // 设置金额
          balance:res.balance.toString()
        })
        if(res.isMobile === 1){
          this.setData({
            bindPhone: true,
            phone:res.mobile
          })
        }else{
          this.setData({
            bindPhone: false
          })
        }
      } else if (res.msg === '未登录'){
        wx.removeStorageSync('session3rd')
        tip.errorSync('网络异常，点击重试', 1500, goBack)
      }
    })
    
  }
})