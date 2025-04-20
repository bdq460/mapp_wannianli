
// 引入日期时间工具
const dayjs = require('../../libs/dayjs.min.js')
// 引入农历计算工具
const lunar = require('./lunar.js')
// 引入弹窗层工具
const dayDetailJs = require('./day_detail.js')
// 引入静态数据
const constants = require('./constants.js')

Page({
  data: {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    weekdays: constants.WEEK_DAY_NAMES,
    days: [],
    birthdays: [],
    showPopup: false, // 新增控制浮层显示的变量
    selectedDay: null, // 新增选中的日期
    touchStartX: 0, // 触摸开始坐标, 用于支持滑动
    touchStartY: 0  // 触摸结束坐标, 用于支持滑动
  },

  onLoad() {
    this.renderCalendar()
    this.loadBirthdays()
  },

  renderCalendar() {
    const { year, month } = this.data
    const days = []

    // 获取当月第一天和最后一天
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const firstDayOfWeek = firstDay.getDay()
    const totalDays = lastDay.getDate()

    // 获取上个月共多少天
    const prevMonthLastDay = new Date(year, month, 0);
    const preMonthDaysCount = prevMonthLastDay.getDate();

    // 添加上个月的几天
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, preMonthDaysCount - i);
      const dayObj = this.buildDayObj(date);
      days.push(dayObj);
    }

    // 填充日期
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const dayObj = this.buildDayObj(date);
      days.push(dayObj)
    }

    // 添加下个月的几天
    const nextMonthFirstDay = new Date(year, month + 1, 1);
    const nextMonthFirstDayOfWeek = nextMonthFirstDay.getDay();
    for (let i = 0; i < 7 - nextMonthFirstDayOfWeek; i++) {
      const date = new Date(year, month + 1, i + 1);
      const dayObj = this.buildDayObj(date);
      days.push(dayObj);
    }

    this.setData({ days })
  },

  isToday(date) {
    const today = new Date()
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  },

  // 构建日期对象
  buildDayObj(date) {
    var day = date.getDate();
    var isToday = this.isToday(date);
    const lunarInfo = lunar.solarToLunar(date);
    return {
      solarDate: dayjs(date).format('YYYY-MM-DD'),
      day,
      isToday,
      lunarInfo,
      class: this.getDayClass(date, lunarInfo)
    }
  },

  getDayClass(date, lunarInfo) {

    const today = new Date()
    const classes = []

    classes.push('day')

    // 判断是否为目标
    if (date.getMonth() === this.data.month &&
      date.getFullYear() == this.data.year) {
      classes.push('"target-month')
    } else {
      classes.push('other-month')
    }

    // 判断今天
    if (date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()) {
      classes.push('today-cell')
    }

    // 判断节日
    // if (lunarInfo.isFestival) {
    //   classes.push('holiday');

    // }

    // 判断节气
    // if (lunarInfo.isTerm) {
    //   classes.push('solar-term')
    // }

    return classes.join(' ')
  },

  loadBirthdays() {
    // 从缓存加载生日数据
    const birthdays = wx.getStorageSync('birthdays') || []
    this.setData({ birthdays })
    this.checkBirthdayReminders()
  },

  checkBirthdayReminders() {
    // 检查即将到来的生日并发送提醒
    const now = new Date()
    const upcomingBirthdays = this.data.birthdays.filter(birthday => {
      const nextDate = this.getNextBirthdayDate(birthday)
      const diffDays = Math.floor((nextDate - now) / (1000 * 60 * 60 * 24))
      return diffDays >= 0 && diffDays <= 7
    })

    if (upcomingBirthdays.length > 0) {
      this.sendBirthdayReminders(upcomingBirthdays)
    }
  },

  getNextBirthdayDate(birthday) {
    // 计算下一个生日日期
    // 实现逻辑...
  },

  sendBirthdayReminders(birthdays) {
    // 发送微信提醒
    // 实现逻辑...
  },

  changeYearOrMonth(changeFunc) {
    this.setData({ flashClass: 'flash-animation' });

    setTimeout(() => {
      changeFunc();
      // this.setData的作用是设置数据, 这个方法接受两个参数
      // 第一个参数 ：要设置的数据对象
      // 第二个参数 ：回调函数，在数据更新和页面渲染完成后调用
      this.setData({
        flashClass: ''
      }, this.renderCalendar);
    }, 300);
  },

  prevMonth() {
    this.changeYearOrMonth(this.changeToPrevMonth);
  },

  nextMonth() {
    this.changeYearOrMonth(this.changeToNextMonth);
  },

  prevYear() {
    this.changeYearOrMonth(this.changeToPrevYear);
  },

  nextYear() {
    this.changeYearOrMonth(this.changeToNextYear);
  },

  moveToToday() {
    this.changeYearOrMonth(this.changeToToday);
  },

  changeToPrevMonth() {
    let { year, month } = this.data
    if (month === 0) {
      month = 11
      year--
    } else {
      month--
    }
    this.setData({ year, month })
    // this.renderCalendar()
  },
  changeToNextMonth() {
    let { year, month } = this.data
    if (month === 11) {
      month = 0
      year++
    } else {
      month++
    }
    this.setData({ year, month })
    // this.renderCalendar()
  },

  changeToPrevYear() {
    let { year } = this.data
    year--
    this.setData({ year })
    // this.renderCalendar()
  },

  changeToNextYear() {
    let { year } = this.data
    year++
    this.setData({ year })
    // this.renderCalendar()
  },

  changeToToday() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    this.setData({ year, month });
  },

  selectDay(e) {
    // day格式为 YYYY-MM-DD
    const selectDay = e.currentTarget.dataset.date
    if (!selectDay) return

    // 弹出详情
    dayDetailJs.popupDetail(this, selectDay)
  },

  // 关闭浮层
  closePopup() {
    dayDetailJs.closeDetail(this)
  },

  // 添加触摸事件处理
  handleTouchStart(e) {
    this.setData({
      touchStartX: e.touches[0].clientX,
      touchStartY: e.touches[0].clientY
    });
  },

  handleTouchEnd(e) {
    const { touchStartX, touchStartY } = this.data;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // 判断滑动方向
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 水平滑动
      if (deltaX > 50) {
        this.prevMonth(); // 向右滑动
      } else if (deltaX < -50) {
        this.nextMonth(); // 向左滑动
      }
    } else {
      // 垂直滑动
      if (deltaY > 50) {
        this.prevYear(); // 向下滑动
      } else if (deltaY < -50) {
        this.nextYear(); // 向上滑动
      }
    }
  },
})