if (res.data && res.data.length > 0) {
  wx.cloud.callFunction({
    name: 'updateDatabase',
    data: {
      singleDayData: singleDayData,
      thisWeekData: thisWeekData,
      preWeekData: preWeekData,
      avatarUrl: that.data.avatarUrl,
      nickName: that.data.nickName
    },

  })
} else {
  // that.collection.add({
  //   data: { data: {
  //     singleDayData: singleDayData,
  //     thisWeekData: thisWeekData,
  //     preWeekData: preWeekData,
  //     avatarUrl: that.data.avatarUrl,
  //     nickName: that.data.nickName
  //   }},
  //   success: function(res){
  //     console.log(res)
  //   }
  // })

}