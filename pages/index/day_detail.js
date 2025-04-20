
// 引入日期时间工具
const dayjs = require('../../libs/dayjs.min.js')
// 引入农历计算工具
const lunar = require('./lunar.js')
// 引入wx工具
const wxjs = require('../../utils/wx.js')
// 引入静态数据
const constants = require('./constants.js')

const POPUP_WINDOW_WIDTH_RATIO = 0.44; // 浮层宽度占屏幕宽度的比例
const POPUP_WINDOW_HEIGHT_RATIO = 0.30; // 浮层宽度占屏幕宽度的比例
const POPUP_WINDOW_WIDTH_RPX = 300;
const POPUP_WINDOW_HEIGHT_RPX = 300;
const POPUP_WINDOW_PADDING_RPX = 15; // 浮层边距

const dayDetailJs = {
    // 弹出日期详情浮层
    popupDetail: function (page, selectDay) {

        // 获取日期对象
        const date = dayjs(selectDay, 'YYYY-MM-DD').toDate();

        // 获取农历日期信息
        const lunarDate = lunar.solarToLunar(date);

        // 公历日期格式：YYYY年MM月DD日
        const solarDateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

        // 农历日期格式：天干地支年 农历X月X日
        const lunarDateStr = `${lunarDate.yearInChinese}年${lunarDate.monthInChinese}月${lunarDate.dayInChinese}日`;

        // 天干地格式: 天干地支年
        const ganzhiDateStr = `${lunarDate.yearInGanZhi}年${lunarDate.monthInGanZhi}月${lunarDate.dayInGanZhi}日`;

        // 获取点击位置信息
        const query = wx.createSelectorQuery();
        // 在微信小程序的 wx.createSelectorQuery() 中
        // ​**query.select() 和 query.selectAll() 不支持直接使用 CSS 属性选择器​（如 [data-id="123"]）。
        // 它们的参数仅支持 ​简单的 CSS 选择器**​（如 #id、.class、tag元素名）
        query.select(`#day_${selectDay}`).boundingClientRect();
        query.exec((res) => {

            const dayRect = res[0];

            // 获取屏幕尺寸信息, 单位为px
            const windowInfo = wx.getWindowInfo();
            const windowWidth =  windowInfo.windowWidth;
            const windowHeight = windowInfo.windowHeight;

            // 获取点击格子的位置信息, 单位为px
            const dayLeft = dayRect.left;
            const dayTop = dayRect.top;

            // 计算点击点所属日期格子的中心点
            const dayCenterX = dayLeft + dayRect.width / 2;
            const dayCenterY = dayTop + dayRect.height / 2;

            // 计算日期格子的中心点在页面中的布局方位
            // 页面原点位于左上角, 水平向右为X轴正方向, 垂直向下为Y轴正方向
            const dayCenterPositionX = dayCenterX / windowWidth;
            const dayCenterPositionY = dayCenterY / windowHeight;

            // 计算弹层宽度和高度, 要包含四周padding
            const popupWindowWidth = wxjs.rpx2px(POPUP_WINDOW_WIDTH_RPX + POPUP_WINDOW_PADDING_RPX * 2);
            const popupWindowHeight = wxjs.rpx2px(POPUP_WINDOW_HEIGHT_RPX + POPUP_WINDOW_PADDING_RPX * 2);

            var dayCenterPosition = null;
            var popupLeft = dayCenterX;
            var popupTop = dayCenterY;
            if (dayCenterPositionX <= 0.5 && dayCenterPositionY <= 0.5) {
                dayCenterPosition = 'TopLeft';
                // 向右下展开
                popupLeft = dayCenterX;
                popupTop = dayCenterY;
            } else if (dayCenterPositionX >= 0.5 && dayCenterPositionY <= 0.5) {
                dayCenterPosition = 'TopRight';
                // 向左侧展开
                popupLeft = dayCenterX - popupWindowWidth;
                popupTop = dayCenterY;
            } else if (dayCenterPositionX <= 0.5 && dayCenterPositionY >= 0.5) {
                dayCenterPosition = 'BottomLeft';
                // 向上展开
                popupLeft = dayCenterX;
                popupTop = dayCenterY - popupWindowHeight;
            } else if (dayCenterPositionX >= 0.5 && dayCenterPositionY >= 0.5) {
                dayCenterPosition = 'BottomRight';
                // 向左上展开
                popupLeft = dayCenterX - popupWindowWidth;
                popupTop = dayCenterY - popupWindowHeight;
            }

            // 防止浮层超出屏幕边界
            popupLeft = Math.min(popupLeft, windowWidth - popupWindowWidth);
            popupTop = Math.min(popupTop, windowHeight - popupWindowHeight);

            page.setData({
                selectedDay: {
                    solarDate: solarDateStr,
                    // selectDay对应的weekDay用中文表示
                    weekDay: constants.WEEK_DAY_NAMES[date.getDay()],
                    lunarDate: lunarDateStr,
                    shengxiao: `${lunarDate.yearInShengXiao}年`,
                    ganzhiDate: ganzhiDateStr,
                    // 节气
                    currentJieQi: lunarDate.currentJieQi,
                    jieQiDaysOffset: lunarDate.jieQiDaysOffset,
                    // 节日
                    festivals: lunarDate.festivals
                },
                showPopup: true,
                popupLeft: popupLeft,
                popupTop: popupTop
            });
        });
    },

    // 关闭日期浮层
    closeDetail: function (page) {
        page.setData({
            showPopup: false
        })
    }
}

module.exports = dayDetailJs;