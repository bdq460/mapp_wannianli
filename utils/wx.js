const wxjs = {
  
    // 转换rpx与px
    rpx2px: function (rpx) {
        const windowInfo = wx.getWindowInfo();
        const windowWidth =  windowInfo.windowWidth;
        var px = rpx * (windowWidth / 750);
        return px;
    },
    // 转换px与rpx
    px2rpx: function (px) {
        const windowInfo = wx.getWindowInfo();
        const windowWidth =  windowInfo.windowWidth;
        var rpx = px * (750 / windowWidth);
        return rpx;
    }
}

// 将 CommonJS 模块导出转换为 ES 模块导出
module.exports = wxjs;
