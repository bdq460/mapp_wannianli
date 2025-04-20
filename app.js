

// 配置全局分享
!function () {
  const PageTmp = Page;
  Page = function (pageConfig) {
    // 动态全局分享配置
    const globalShare = {
      // 分享给好友
      onShareAppMessage() {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        // 根据路由动态调整分享内容（如详情页）
        if (currentPage.route.includes('detail')) {
          return { title: "墨池笔锋-生活好帮手", path: '/pages/detail/detail' };
        }
        return { title: "墨池笔锋-生活好帮手", path: '/pages/index/index' };
      },
      // 分享到朋友圈（如果需要）
      onShareTimeline() {
        return {
          title: '墨池笔锋-生活好帮手',
          query: 'from=timeline', // 可选，携带参数
          //   imageUrl: '/images/share.jpg'
        };
      }
    };
    // 合并全局配置与页面配置
    pageConfig = Object.assign(globalShare, pageConfig);
    PageTmp(pageConfig);
  };
}();

App({
  onLaunch: function () {
    
    // 小程序初始化
    try {
      const deviceInfo = wx.getDeviceInfo();
      const windowInfo = wx.getWindowInfo();
      // 处理系统信息
      // 延迟执行pageScrollTo确保webview已初始化
      setTimeout(() => {
        // 禁止页面滚动
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        });
      }, 300);
    } catch (error) {
      console.error('获取系统信息失败:', error);
    }
  },
  // onShareAppMessage() {
  //   return {
  //     title: '墨池笔锋-生活好帮手',      // 自定义分享标题
  //     path: '/pages/index/index',     // 用户点击后跳转的页面路径
  //   };
  // },
  globalData: {
    // 全局数据
  }
})