// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let { singleDayData, thisWeekData, preWeekData, avatarUrl, nickName, _openid, type} = event
  if(type === "update") {
    return await db.collection('test').where({
      _openid : _openid
    }).update({
      data: {
        singleDayData: singleDayData,
        thisWeekData: thisWeekData,
        preWeekData: preWeekData,
        avatarUrl: avatarUrl,
        nickName: nickName
      }
    })
  }
}