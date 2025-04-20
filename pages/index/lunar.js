// const lunisolar = require('../libs/lunisolar.min.js');

const lunar_tool = require('../../libs/lunar.js');
// const time_tool = require('../libs/time_tool.js');
const dayjs = require('../../libs/dayjs.min.js');

const solarTerm = [
  "小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至",
  "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"
];

const festivals = {
  "01-01": "春节",
  "01-15": "元宵节",
  "05-05": "端午节",
  "07-07": "七夕节",
  "08-15": "中秋节",
  "09-09": "重阳节",
  "12-08": "腊八节",
  "12-23": "小年"
};

function solarToLunar(date) {
  const targetDate = new Date(date)
  var lunarDate = lunar_tool.Lunar.fromDate(targetDate);
  const year = targetDate.getFullYear()
  const month = targetDate.getMonth()
  const day = targetDate.getDate()


  // 计算当前日期所属的节气
  const jieQiInfo = caculateJiQiInfo(date)

  // 计算当前日期所属的节日
  var festivalDays = []
  const holiday = lunar_tool.HolidayUtil.getHoliday(year, month + 1, day);
  const isFestivalDay = 
    holiday != null &&
    holiday.getTarget() === dayjs(targetDate).format('YYYY-MM-DD');
  if (isFestivalDay) {
    festivalDays.push(holiday.getName())
  }

  //添加农历节日
  if (lunarDate && lunarDate.getFestivals()) {
    festivalDays = festivalDays.concat(lunarDate.getFestivals())
  }

  // 添加传统节日
  var solarDate = lunar_tool.Solar.fromDate(targetDate)
  if (solarDate && solarDate.getFestivals()) {
    festivalDays = festivalDays.concat(solarDate.getFestivals())
  }

  // 节日排重
  var festivalSet = [...new Set(festivalDays)];
  
  return {
    year: lunarDate.getYear(),
    yearInChinese: lunarDate.getYearInChinese(),
    yearInGanZhi: lunarDate.getYearInGanZhi(),
    yearInShengXiao: lunarDate.getShengxiao(),
    month: lunarDate.getMonth(),
    monthInChinese: lunarDate.getMonthInChinese(),
    monthInGanZhi: lunarDate.getMonthInGanZhi(),
    day: lunarDate.getDay(),
    dayInChinese: lunarDate.getDayInChinese(),
    dayInGanZhi: lunarDate.getDayInGanZhi(),
    currentJieQi: jieQiInfo.currentJieQi,
    jieQiDaysOffset: jieQiInfo.jieQiDaysOffset,
    // text中文本换行
    //  1. text设置style="white-space: pre-line;"
    //  2. text文本一定要要是变量
    //  3. text文本中内容通过\n进行换行
    // pre-line: 合并连续空格，保留换行符。
    // pre-wrap: 保留空格和换行符。
    festivals: festivalSet.length > 0 ? festivalSet.join('\n') : null,
  };
}

// 获取当前所属
function caculateJiQiInfo(date) {
  
  var targetDate = new Date(date)

  var currentJieQi = ''
  var jieQiDaysOffset = 0

  while(true){
    var lunarDate = lunar_tool.Lunar.fromDate(targetDate);
    if (lunarDate.getJieQi() ) {
      currentJieQi = lunarDate.getJieQi();
      break
    }
    jieQiDaysOffset++
    // targetDate向前移动一天
    targetDate.setDate(targetDate.getDate() - 1);
  }

  return {
    currentJieQi,
    jieQiDaysOffset,
  }
}

  // const lsr = lunisolar(date);
  // const lunarMonth = lsr.lunar.month;
  // const lunarDay = lsr.lunar.day;
  
  // 新增节气判断逻辑
  // const currentDate = new Date(date)
  
  // const term = getSolarTerm(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
  // console.log('节气：', term);
  // return {
  //   lunarYear: currentDate.lunar.year,
  //   lunarMonth: lunarMonth,
  //   lunarDay: lunarDay,
  //   lunarMonthName: lunarMonthName[lunarMonth - 1],
  //   lunarDayName: lunarDayName[lunarDay - 1],
  //   festivalName: festival[`${String(lunarMonth).padStart(2, '0')}-${String(lunarDay).padStart(2, '0')}`],
  //   isFestival: !!festival[`${String(lunarMonth).padStart(2, '0')}-${String(lunarDay).padStart(2, '0')}`],
  //   isTerm: term !== null,
  //   termName: term || ''
  // };
// }

// 添加节气计算函数
function getSolarTerm(year, month, day) {
  const baseDate = new Date(1900, 0, 6, 2, 5); // 基准日期
  const targetDate = new Date(Date.UTC(year, month - 1, day));
  // 采用回归年的平均长度计算每个节气的时间间隔, 这种方式认为回归年的平均长度是准确的，并且可以通过计算得到每个节气的准确时间。
  // 这种计算方式精度较不够, 因此会出现误差
  // const termInterval = 21914.532; // 每个节气间隔分钟数 (365.2422天/年 ÷ 24节气 × 1440分钟/天)
  const termInterval = (((( 365 * 24 + 5 ) * 60 + 48 ) * 60 + 45 ) * 1000 + 975.36)/24// 根据1980—2100年的数据计算，回归年的平均长度为 ​365.24219879日，即 ​365天5小时48分45.97536秒
  
  // const diffMinutes = (targetDate - baseDate) / 60000;
  const diffMilliseconds = targetDate - baseDate;
  
  let termMilliseconds = diffMilliseconds
  let termIdx = 0
  while (termMilliseconds > termInterval){
    termMilliseconds = termMilliseconds - termInterval
    termIdx = termIdx + 1
  }
  if ( termMilliseconds < 24 * 60 * 60 * 1000){
    return solarTerm[termIdx % 24]
  }else{
    return null
  }
  
  // for (let i = 0; i < 24; i++) {
  //   const termTime = termInterval * i;
  //   if (diffMinutes >= termTime && diffMinutes < termTime + termInterval) {
  //     return solarTerm[i];
  //   }
  // }
  // return null;
}

// 模块导出
module.exports = { solarToLunar };