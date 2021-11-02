/*
 * @Description:
 * @version:
 * @Author: sueRim
 * @Date: 2021-10-14 09:59:39
 * @LastEditors: sueRim
 * @LastEditTime: 2021-11-02 15:07:36
 */
module.exports = {
  title: "xuexue's blog",
  description: "编码旅程之旅",
  dest: "public",
  base:"/xuexueblog/",
  head: [
    [
      "link",
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
  ],
  theme: "reco",
  themeConfig: {
    nav: [
      {
        text: "主页",
        link: "/",
        icon: "reco-home",
      },
      {
        text: "时间轴",
        link: "/timeline/",
        icon: "reco-date",
      },
      {
        text: "工具推荐",
        icon: "reco-message",
        items: [
          {
            text: "vuepress-reco",
            link: "/docs/theme-reco/",
          },
        ],
      },
      {
        text: "关于",
        icon: "reco-message",
        items: [
          {
            text: "GitHub",
            link: "https://github.com/recoluan",
            icon: "reco-github",
          },
        ],
      },
    ],
    sidebar: {
      "/docs/theme-reco/": ["", "theme", "plugin", "api"],
    },
    type: "blog",
    blogConfig: {
      category: {
        location: 2,
        text: "category",
      },
      tag: {
        location: 3,
        text: "Tag",
      },
    },
    friendLink: [
      {
        title: "午后南杂",
        desc: "Enjoy when you can, and endure when you must.",
        email: "1156743527@qq.com",
        link: "https://www.recoluan.com",
      },
      {
        title: "暂无",
        desc: "A simple and beautiful vuepress Blog & Doc theme.",
        avatar:
          "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        link: "https://vuepress-theme-reco.recoluan.com",
      },
    ],
    logo: "/imgs/logo3.jpg",
    // logo: "/imgs/logo1.png",
    search: true,
    searchMaxSuggestions: 10,
    lastUpdated: "Last Updated",
    author: "xuexue",
    authorAvatar: "/avatar.jpg",
    record: "xxxx",
    startYear: "2017",
  },
  plugins: [
    [
      "@vuepress-reco/vuepress-plugin-kan-ban-niang",
      {
        theme: [
          "miku",
          "whiteCat",
          "haru1",
          "haru2",
          "haruto",
          "koharu",
          "izumi",
          "shizuku",
          "wanko",
          "blackCat",
          "z16",
        ],
        clean: false,
        messages: {
          welcome: "欢迎来到我的博客",
          home: "心里的花，我想要带你回家。",
          theme: "好吧，希望你能喜欢我的其他小伙伴。",
          close: "你不喜欢我了吗？痴痴地望着你。",
        },
        messageStyle: { right: "68px", bottom: "290px" },
        width: 250,
        height: 320,
      },
    ],
    [
      {
        // 鼠标点击特效
        "cursor-effects": {
          size: 2,
          shape: "circle", // 点击形状: 'star', 'star' | 'circle'
          zIndex: 999999999,
        },
      },
    ],
  ],
  markdown: {
    lineNumbers: true,
  },
};
