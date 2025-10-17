import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import store from "./store";
import { Provider } from "react-redux";
import { ConfigProvider, message } from "antd";
import zh_CN from "antd/es/locale/zh_CN";
import "dayjs/locale/zh-cn";
import "./index.css";

// 消息全局配置
message.config({
  top: 10,
  duration: 1,
  maxCount: 1,
  prefixCls: "ant-message",
});

// Ant Design 主题配置
const antdThemeConfig = {
  components: {
    Layout: {
      headerBg: "#232F3E",
      bodyBg: "#E4E7F2",
      footerBg: "#E4E7F2",
      headerPadding: "0 10px",
      headerHeight: 48,
    },
    Menu: {
      darkItemBg: "#232F3E",
    },
    Form: {
      itemMarginBottom: 0,
      labelColonMarginInlineEnd: 4,
      labelColonMarginInlineStart: 2,
    },
    Table: {
      headerBg: "#EDF2FA",
      borderColor: "#d6e4ff",
      stickyScrollBarBg: "rgba(195, 211, 236, 0.5)",
      stickyScrollBarBorderRadius: 5,
      rowHoverBg: "",
    },
    Descriptions: {
      labelBg: "#EDF2FA",
    },
    Collapse: {
      contentPadding: '0px',
      headerPadding: '10px 0px',
    },
  },
  token: {
    colorPrimary: "#0070E0",
    borderRadius: 2,
    fontSize: 14,
    borderRadiusLG: 4,
  },
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ConfigProvider locale={zh_CN} theme={antdThemeConfig}>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </ConfigProvider>
);
