//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    nickName:'',
    stepInfoList: []
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    this.onGetOpenid()
    const db = wx.cloud.database()
    this.collection = db.collection('test')
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                nickName: res.userInfo.nickName
              })
            }
          })
        }
      }
    })
    let that = this
    
    wx.login({
      success(res) {
        if (res.code) {
          wx.getWeRunData({
            success: function (res) {
              that.onGetRunData(res)
              //获取数据库信息
              that.collection.get({
                success: function (res) {
                  that.setData({
                    userInfoList: res.data
                  })
                  app.globalData.userInfoList = res.data
                }
              })
            },
            fail: function (res) { },
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  onGetOpenid: function () {
    let that = this
    wx.cloud.callFunction({
      name: 'login',
      data: {
      },
      success: res => {
        this.setData({
          openid: res.result.openid
        })
      }
      
    })
  },
  onGetRunData: function (param) {
    //云函数获得当天微信运动步数
    let cloudId = wx.cloud.CloudID(param.cloudID)
    let that = this
    wx.cloud.callFunction({
      name: 'weRun',
      data: {
        weRunData: cloudId
      },
      success: res => {
        this.setData({
          stepInfoList: res.result && res.result.event && res.result.event.weRunData && res.result.event.weRunData.data.stepInfoList
        })
        let singleDayData = that.onGetSingleDayData()
        let thisWeekData = that.onGetWeekData('this')
        let preWeekData = that.onGetWeekData('pre')
        wx.cloud.callFunction({
          name: 'operatingDatabase',
          data: {
            type: "update",
            _openid: this.data.openid,
            singleDayData: singleDayData,
            thisWeekData: thisWeekData,
            preWeekData: preWeekData,
            avatarUrl: that.data.avatarUrl,
            nickName: that.data.nickName
          },
          success: res =>{
            console.log(res)
            console.log(that.collection.get())
          },
          fail: res => {
            console.log(res)
          }
        })
        // that.collection.where({
        //   _openid:this.openid
        // }).update({
        //   data: {
        //     singleDayData: singleDayData,
        //     thisWeekData: thisWeekData,
        //     preWeekData: preWeekData,
        //     avatarUrl: that.data.avatarUrl,
        //     nickName: that.data.nickName
        //   },
        //   success: res => {
        //     console.log(res)
           
        //   },
        //   fail: res => {
        //     console.log(res)
        //   }
        // })
        
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  onGetSingleDayData: function() {
    // switch(param) {
    //   case 0:

    // }
    let stepData = this.data.stepInfoList[this.data.stepInfoList.length-1]
    // this.setData({
    //   runData: stepData.step
    // })
    return stepData.step


  },
  onGetWeekData: function(param) {
    let today = this.data.stepInfoList && this.data.stepInfoList.length > 0 && this.data.stepInfoList[this.data.stepInfoList.length-1]
    let day = new Date(today.timestamp *1000).getDay()
    let count
    if(day === 0) {
      count = 7
    } else {
      count = day
    }
    let weekData
    if (param === 'this') {
      weekData = this.data.stepInfoList.slice(-count)
    } else {
      weekData = this.data.stepInfoList.slice((-count - 7), -count)
    }
    
    let stepSum = 0
    weekData.forEach(function(item){
      stepSum = stepSum + item.step
    })
    // this.setData({
    //   runData:stepSum
    // })
    return stepSum
  },
  
})
