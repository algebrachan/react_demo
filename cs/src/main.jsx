import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {BrowserRouter} from "react-router-dom";
import store from "./store";
import {Provider} from "react-redux";
import {ConfigProvider, message} from "antd";
import zh_CN from "antd/es/locale/zh_CN";
import "dayjs/locale/zh-cn";
import "./index.css";


message.config({
  top: 10,
  duration: 1, // 延时关闭时间
  maxCount: 1, // 最大显示数
  // rtl: true, // 感叹号显示在右边
  prefixCls: "ant-message",
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <ConfigProvider
    locale={zh_CN}
    theme={{
      components: {
        Layout: {
          headerBg: "#232f3e",
          bodyBg: "#e4e7f2",
          footerBg: "#e4e7f2",
          footerPadding:"16px 50px",
          headerPadding: "0 10px",
          headerHeight: 48,
        },
        Menu: {
          darkItemBg: "#232f3e",
        },
        Form: {
          itemMarginBottom: 0,
          labelColonMarginInlineEnd: 4,
          labelColonMarginInlineStart: 2,
        },
        Table: {
          borderColor: '#e0e0e0',
          headerBg: "#edf2fa",
          stickyScrollBarBg: "rgba(195, 211, 236, 0.5)",
          stickyScrollBarBorderRadius: 5,
          rowHoverBg: "", // 为空 鼠标移动标记颜色取消
        },
        Descriptions: {
          labelBg: "#edf2fa",
          titleMarginBottom: 10,
          // labelColor:"#333333"
        },
      },
      token: {
        colorPrimary: "#0070e0",
        borderRadius: 2,
        fontSize: 14,
        borderRadiusLG: 4,
      },
    }}
  >
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </ConfigProvider>
);
