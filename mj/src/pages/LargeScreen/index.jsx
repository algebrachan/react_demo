import React, { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import "./ls.less";
import { Col, Row, Flex, Table, ConfigProvider } from "antd";
import { EchartsBarChart, EchartsLineChart } from "./Chart";
import useWebSocket from "../../utils/websocket";
dayjs.locale("zh-cn");

const NowTime = () => {
  const [time, setTime] = useState("");
  const timer = useRef(-1);
  useEffect(() => {
    timer.current = setInterval(() => {
      let t = dayjs().format("YYYY.MM.DD dddd HH:mm:ss");
      setTime(t);
    }, 500);
    return () => {
      clearInterval(timer.current);
    };
  }, []);
  return <div className="time">{time}</div>;
};
const DevItem1 = ({ status = false, name = "设备名", style = {} }) => {
  return (
    <div className={status ? "dev1_on" : "dev1_off"} style={style}>
      <div className="text">{name}</div>
    </div>
  );
};
const DevItem2 = ({ status = false, name = "设备名", style = {} }) => {
  return (
    <div className={status ? "dev2_on" : "dev2_off"} style={style}>
      <div className="text">{name}</div>
    </div>
  );
};

const CommonBox = ({ name = "", children }) => (
  <div className="common_box_root">
    <div className="header">
      <div className="icon1" />
      <div className="icon2" />
      <div className="title">{name}</div>
    </div>
    <div className="body">{children}</div>
  </div>
);
const DevStatus = ({ name = "", open_num = 0, total = 0 }) => {
  return (
    <Flex justify="space-between" align="center" className="dev_status_item">
      <div className="icon" />
      <div>{name}</div>
      <div className="count">
        <span>{open_num}</span>/<span>{total}</span>
      </div>
    </Flex>
  );
};
const tableTheme = {
  token: {
    colorPrimary: "#1A2E4F", // 主色（影响选中态等）
    colorBgContainer: "transparent", // 背景色
    colorTextHeading: "#fff",
    colorText: "#fff",
    colorIcon: "#fff",
    colorTextDisabled: "#fff",
    colorTextPlaceholder: "#fff",
    colorBorder: "#fff",
    colorBgTextActive: "#fff",
    colorTextDescription: "#fff",
    opacityImage:0.2
  },
  components: {
    Table: {
      headerBg: "transparent", // 表头背景
      footerBg: "transparent", // 表头背景
      bodySortBg: "red",
      borderColor: "#1A2E4F",
      headerSplitColor: "#1A2E4F",
      footerColor: "#fff",
    },
    Pagination: {
      // itemActiveBg: "#1A2E4F",
      itemActiveColorDisabled: "#fff",
      itemBg: "transparent",
    },
  },
};
function LargeScreen() {
  const [data, setData] = useState({});
  const {
    flat_pattern_making,
    dev_status_list = [
      { name: "熔融", open_num: 0, total: 0 },
      { name: "酸洗", open_num: 0, total: 0 },
      { name: "烘烤", open_num: 0, total: 0 },
      { name: "研磨", open_num: 0, total: 0 },
      { name: "预水洗", open_num: 0, total: 0 },
      // { name: "喷钡", open_num: 0, total: 0 },
      { name: "尺寸检验", open_num: 0, total: 0 },
      { name: "高压水洗", open_num: 0, total: 0 },
      { name: "埚口研磨", open_num: 0, total: 0 },
      { name: "高压预清洗", open_num: 0, total: 0 },
      { name: "超声清洗", open_num: 0, total: 0 },
      { name: "终检", open_num: 0, total: 0 },
    ],
    manufacturing_statistics,
    finish_status,
    machine_condition = [],
    utilization_rate,
    monitor = [[], [], [], []],
  } = data;
  const [webSocket, sendMessage, lastMessage, isConnected] = useWebSocket({
    url: `ws://10.161.162.241:9122/api/large_screen/get_large_screen_data`, //这里放长链接
    // url: `ws://10.60.36.166:9122/api/large_screen/get_large_screen_data`, //这里放长链接
    onOpen: () => {
      //连接成功
      console.log("WebSocket connected");
    },
    onClose: () => {
      //连接关闭
      console.log("WebSocket disconnected");
    },
    onError: (event) => {
      //连接异常
      console.error("WebSocket error:", event);
    },
    onMessage: (message) => {
      //收到消息
      const { code, data, msg } = message;

      if (code === 200) {
        console.log("数据", data);
        setData(data);
      }
    },
  });
  // const dev_status_list = [
  //   { name: "熔融", open_num: 2, total: 7 },
  //   { name: "酸洗", open_num: 6, total: 8 },
  //   { name: "烘烤", open_num: 6, total: 10 },
  //   { name: "研磨", open_num: 3, total: 3 },
  //   { name: "预水洗", open_num: 1, total: 2 },
  //   { name: "喷钡", open_num: 1, total: 1 },
  //   { name: "尺寸检验", open_num: 2, total: 2 },
  //   { name: "高压水洗", open_num: 2, total: 4 },
  //   { name: "锅口研磨", open_num: 2, total: 2 },
  //   { name: "高压预清洗", open_num: 2, total: 2 },
  //   { name: "超声清洗", open_num: 3, total: 4 },
  //   { name: "终检", open_num: 1, total: 2 },
  // ];
  //
  const columns = [
    "工序",
    "机台",
    "主操",
    "辅操",
    "班次",
    "加工批次",
    "累计加工",
  ].map((item) => ({
    title: item,
    key: item,
    dataIndex: item,
  }));
  useEffect(() => {
    return () => {
      if (webSocket) {
        webSocket.close();
      }
    };
  }, []);

  return (
    <div className="large_screen_root">
      <div className="large_screen_header">
        <div className="title">美晶车间集控驾驶舱</div>
        {NowTime()}
      </div>
      <div className="large_screen_dev_content">
        <div className="dev_box1">
          <div className="title">熔融</div>
          <DevItem1
            name="熔融机11"
            status={flat_pattern_making?.["熔融机11"]}
            style={{ top: 76, left: 35 }}
          />
          <DevItem1
            name="熔融机12"
            style={{ top: 76, left: 115 }}
            status={flat_pattern_making?.["熔融机12"]}
          />
          <DevItem1
            name="熔融机13"
            status={flat_pattern_making?.["熔融机13"]}
            style={{ top: 76, left: 195 }}
          />
          <DevItem1
            name="熔融机14"
            style={{ top: 76, left: 275 }}
            status={flat_pattern_making?.["熔融机14"]}
          />
          <DevItem1
            name="熔融机15"
            style={{ top: 76, left: 355 }}
            status={flat_pattern_making?.["熔融机15"]}
          />
        </div>
        <div className="arrow1" />
        <div className="arrow2" />
        <div className="arrow3" />
        <div className="arrow4" />
        <div className="arrow5" />
        <div className="arrow6" />
        <div className="arrow7" />
        <div className="arrow8" />
        <div className="arrow9" />
        <div className="dev_box2">
          <div className="title">研磨切割</div>
          <DevItem1
            name="3号研磨上料线"
            status={flat_pattern_making?.["3号研磨上料线"]}
            style={{ top: 88, left: 122 }}
          />
          <DevItem1
            name="3号研磨机"
            status={flat_pattern_making?.["3号研磨机"]}
            style={{ top: 88, left: 202 }}
          />
          <DevItem1
            name="3号研磨下料线"
            status={flat_pattern_making?.["3号研磨下料线"]}
            style={{ top: 88, left: 282 }}
          />
          <DevItem1
            name="3号切割机"
            status={flat_pattern_making?.["3号切割机"]}
            style={{ top: 88, left: 362 }}
          />
          <DevItem1
            name="3号切割下料线"
            status={flat_pattern_making?.["3号切割下料线"]}
            style={{ top: 88, left: 442 }}
          />

          <DevItem1
            name="2号研磨上料线"
            status={flat_pattern_making?.["2号研磨上料线"]}
            style={{ top: 200, left: 85 }}
          />
          <DevItem1
            name="2号研磨机"
            status={flat_pattern_making?.["2号研磨机"]}
            style={{ top: 200, left: 165 }}
          />
          <DevItem1
            name="3号研磨下料线"
            status={flat_pattern_making?.["3号研磨下料线"]}
            style={{ top: 200, left: 245 }}
          />
          <DevItem1
            name="2号切割机"
            status={flat_pattern_making?.["2号切割机"]}
            style={{ top: 200, left: 325 }}
          />
          <DevItem1
            name="2号切割下料线"
            status={flat_pattern_making?.["2号切割下料线"]}
            style={{ top: 200, left: 405 }}
          />

          <DevItem1
            name="1号研磨上料线"
            status={flat_pattern_making?.["1号研磨上料线"]}
            style={{ top: 312, left: 50 }}
          />
          <DevItem1
            name="1号研磨机"
            status={flat_pattern_making?.["1号研磨机"]}
            style={{ top: 312, left: 130 }}
          />
          <DevItem1
            name="1号研磨下料线"
            status={flat_pattern_making?.["1号研磨下料线"]}
            style={{ top: 312, left: 210 }}
          />
          <DevItem1
            name="1号切割机"
            status={flat_pattern_making?.["1号切割机"]}
            style={{ top: 312, left: 290 }}
          />
          <DevItem1
            name="1号切割下料线"
            status={flat_pattern_making?.["1号切割下料线"]}
            style={{ top: 312, left: 370 }}
          />
        </div>
        <div className="process1">
          <DevItem1
            name="尺寸检测1"
            status={flat_pattern_making?.["尺寸检测1"]}
            style={{ top: 190, left: -20 }}
          />
          <DevItem1
            name="JH24"
            status={flat_pattern_making?.["JH24"]}
            style={{ top: 190, left: 64 }}
          />
          <DevItem1
            name="称重线体1"
            status={flat_pattern_making?.["称重线体1"]}
            style={{ top: 120, left: 82 }}
          />
          <DevItem1
            name="视觉缺陷检测1"
            status={flat_pattern_making?.["视觉缺陷检测1"]}
            style={{ top: 50, left: 100 }}
          />
          <DevItem1
            name="JH23"
            status={flat_pattern_making?.["JH23"]}
            style={{ top: -20, left: 118 }}
          />
          <DevItem1
            name="JH27人工检"
            status={flat_pattern_making?.["JH27人工检"]}
            style={{ top: -20, left: 200 }}
          />
          <DevItem2
            name="JH14"
            status={flat_pattern_making?.["JH14"]}
            style={{ top: 190, left: 350 }}
          />
          <DevItem1
            name="高压预清洗"
            status={flat_pattern_making?.["高压预清洗"]}
            style={{ top: 190, left: 405 }}
          />
          <DevItem2
            name="酸洗2"
            status={flat_pattern_making?.["酸洗2"]}
            style={{ top: 190, left: 480 }}
          />
          <DevItem2
            name="酸洗3"
            status={flat_pattern_making?.["酸洗3"]}
            style={{ top: 190, left: 535 }}
          />
          <DevItem2
            name="酸洗4"
            status={flat_pattern_making?.["酸洗4"]}
            style={{ top: 190, left: 590 }}
          />
          <DevItem2
            name="酸洗5"
            status={flat_pattern_making?.["酸洗5"]}
            style={{ top: 190, left: 645 }}
          />
          <DevItem2
            name="预水洗"
            status={flat_pattern_making?.["预水洗"]}
            style={{ top: 190, left: 700 }}
          />
          <DevItem1
            name="高压水洗"
            status={flat_pattern_making?.["高压水洗"]}
            style={{ top: 190, left: 755 }}
          />
          <DevItem1
            name="超声料台"
            status={flat_pattern_making?.["超声料台"]}
            style={{ top: 190, left: 840 }}
          />
          <DevItem1
            name="高压水洗2"
            status={flat_pattern_making?.["高压水洗2"]}
            style={{ top: 190, left: 920 }}
          />
          <DevItem1
            name="超声清洗A"
            status={flat_pattern_making?.["超声清洗A"]}
            style={{ top: 110, left: 860 }}
          />
          <DevItem1
            name="超声清洗B"
            status={flat_pattern_making?.["超声清洗B"]}
            style={{ top: 30, left: 880 }}
          />
          <DevItem2
            name="静置"
            status={flat_pattern_making?.["静置"]}
            style={{ top: 200, left: 1099 }}
          />
          <DevItem2
            name="烘烤1"
            status={flat_pattern_making?.["烘烤1"]}
            style={{ top: 200, left: 1153 }}
          />
          <DevItem2
            name="烘烤2"
            status={flat_pattern_making?.["烘烤2"]}
            style={{ top: 200, left: 1207 }}
          />
          <DevItem2
            name="烘烤3"
            status={flat_pattern_making?.["烘烤3"]}
            style={{ top: 200, left: 1262 }}
          />
          <DevItem2
            name="烘烤4"
            status={flat_pattern_making?.["烘烤4"]}
            style={{ top: 200, left: 1315 }}
          />
          <DevItem2
            name="缓存1"
            status={flat_pattern_making?.["缓存1"]}
            style={{ top: 200, left: 1369 }}
          />
          <DevItem2
            name="缓存2"
            status={flat_pattern_making?.["缓存2"]}
            style={{ top: 200, left: 1423 }}
          />
          <DevItem2
            name="喷钡"
            status={flat_pattern_making?.["喷钡"]}
            style={{ top: 200, left: 1477 }}
          />
          <DevItem2
            name="烘烤5"
            status={flat_pattern_making?.["烘烤5"]}
            style={{ top: 200, left: 1531 }}
          />
          <DevItem2
            name="烘烤6"
            status={flat_pattern_making?.["烘烤6"]}
            style={{ top: 200, left: 1585 }}
          />
          <DevItem2
            name="冷却1"
            status={flat_pattern_making?.["冷却1"]}
            style={{ top: 200, left: 1639 }}
          />
          <DevItem2
            name="冷却2"
            status={flat_pattern_making?.["冷却2"]}
            style={{ top: 200, left: 1693 }}
          />
          <DevItem2
            name="冷却3"
            status={flat_pattern_making?.["冷却3"]}
            style={{ top: 200, left: 1747 }}
          />
          <DevItem2
            name="冷却4"
            status={flat_pattern_making?.["冷却4"]}
            style={{ top: 125, left: 1762 }}
          />
          <DevItem2
            name="冷却5"
            status={flat_pattern_making?.["冷却5"]}
            style={{ top: 50, left: 1777 }}
          />
          <DevItem2
            name="冷却6"
            status={flat_pattern_making?.["冷却6"]}
            style={{ top: -20, left: 1792 }}
          />
          <DevItem2
            name="冷却7"
            status={flat_pattern_making?.["冷却7"]}
            style={{ top: -20, left: 1847 }}
          />
          <DevItem2
            name="冷却8"
            status={flat_pattern_making?.["冷却8"]}
            style={{ top: -20, left: 1900 }}
          />
          <DevItem1
            name="JH32终检"
            status={flat_pattern_making?.["JH32终检"]}
            style={{ top: 50, left: 1875 }}
          />
          <DevItem2
            name="JH33"
            status={flat_pattern_making?.["JH33"]}
            style={{ top: 125, left: 1875 }}
          />
          <DevItem2
            name="JH35"
            status={flat_pattern_making?.["JH35"]}
            style={{ top: 200, left: 1865 }}
          />
          <DevItem1
            name="埚口研磨"
            status={flat_pattern_making?.["埚口研磨"]}
            style={{ top: -20, left: 2000 }}
          />
          <DevItem2
            name="JH36"
            status={flat_pattern_making?.["JH36"]}
            style={{ top: 200, left: 1990 }}
          />
          <DevItem1
            name="JH37--架"
            status={flat_pattern_making?.["JH37--架"]}
            style={{ top: 200, left: 2045 }}
          />
          <DevItem2
            name="JH38"
            status={flat_pattern_making?.["JH38"]}
            style={{ top: 200, left: 2120 }}
          />
          <DevItem2
            name="JH52"
            status={flat_pattern_making?.["JH52"]}
            style={{ top: 200, left: 2175 }}
          />
          <DevItem2
            name="JH55"
            status={flat_pattern_making?.["JH55"]}
            style={{ top: 200, left: 2230 }}
          />
          <DevItem2
            name="JH53"
            status={flat_pattern_making?.["JH53"]}
            style={{ top: 125, left: 2195 }}
          />
          <DevItem2
            name="JH54"
            status={flat_pattern_making?.["JH54"]}
            style={{ top: 125, left: 2250 }}
          />
          <DevItem2
            name="JH51"
            status={flat_pattern_making?.["JH51"]}
            style={{ top: 275, left: 2155 }}
          />
          <DevItem2
            name="JH56"
            status={flat_pattern_making?.["JH56"]}
            style={{ top: 275, left: 2210 }}
          />
          <DevItem2
            name="JH50"
            status={flat_pattern_making?.["JH50"]}
            style={{ top: 350, left: 2135 }}
          />
          <DevItem2
            name="JH57"
            status={flat_pattern_making?.["JH57"]}
            style={{ top: 350, left: 2190 }}
          />
        </div>
        <div className="process2">
          <DevItem1
            name="尺寸检测2"
            status={flat_pattern_making?.["尺寸检测2"]}
            style={{ top: -20, left: -8 }}
          />
          <DevItem1
            name="JH25"
            status={flat_pattern_making?.["JH25"]}
            style={{ top: -20, left: 76 }}
          />
          <DevItem1
            name="称重线体2"
            status={flat_pattern_making?.["称重线体2"]}
            style={{ top: 52, left: 56 }}
          />
          <DevItem1
            name="视觉缺陷检测2"
            status={flat_pattern_making?.["视觉缺陷检测2"]}
            style={{ top: 125, left: 36 }}
          />
          <DevItem1
            name="JH28人工检"
            status={flat_pattern_making?.["JH28人工检"]}
            style={{ top: 125, left: 120 }}
          />
          <DevItem1
            name="JH21"
            status={flat_pattern_making?.["JH21"]}
            style={{ top: 200, left: -66 }}
          />
          <DevItem1
            name="JH26"
            status={flat_pattern_making?.["JH26"]}
            style={{ top: 200, left: 16 }}
          />
          <DevItem1
            name="JH22"
            status={flat_pattern_making?.["JH22"]}
            style={{ top: 200, left: 100 }}
          />
          <DevItem2
            name="JH15"
            status={flat_pattern_making?.["JH15"]}
            style={{ top: 180, left: 300 }}
          />
          <DevItem1
            name="高压预清洗"
            status={flat_pattern_making?.["高压预清洗_"]}
            style={{ top: 180, left: 355 }}
          />
          <DevItem2
            name="酸洗2"
            status={flat_pattern_making?.["酸洗2_"]}
            style={{ top: 180, left: 435 }}
          />
          <DevItem2
            name="酸洗3"
            status={flat_pattern_making?.["酸洗3_"]}
            style={{ top: 180, left: 490 }}
          />
          <DevItem2
            name="酸洗4"
            status={flat_pattern_making?.["酸洗4_"]}
            style={{ top: 180, left: 545 }}
          />
          <DevItem2
            name="酸洗5"
            status={flat_pattern_making?.["酸洗5_"]}
            style={{ top: 180, left: 600 }}
          />
          <DevItem2
            name="预水洗"
            status={flat_pattern_making?.["预水洗_"]}
            style={{ top: 180, left: 655 }}
          />
          <DevItem1
            name="高压水洗1"
            status={flat_pattern_making?.["高压水洗1_"]}
            style={{ top: 180, left: 720 }}
          />
          <DevItem1
            name="超声料台"
            status={flat_pattern_making?.["超声料台_"]}
            style={{ top: 180, left: 800 }}
          />
          <DevItem1
            name="高压水洗2"
            status={flat_pattern_making?.["高压水洗2_"]}
            style={{ top: 180, left: 880 }}
          />
          <DevItem1
            name="超声清洗A"
            status={flat_pattern_making?.["超声清洗A_"]}
            style={{ top: 100, left: 820 }}
          />
          <DevItem1
            name="超声清洗B"
            status={flat_pattern_making?.["超声清洗B_"]}
            style={{ top: 20, left: 840 }}
          />
          <DevItem2
            name="静置"
            status={flat_pattern_making?.["静置_"]}
            style={{ top: 180, left: 1050 }}
          />
          <DevItem2
            name="烘烤1"
            status={flat_pattern_making?.["烘烤1_"]}
            style={{ top: 180, left: 1105 }}
          />
          <DevItem2
            name="烘烤2"
            status={flat_pattern_making?.["烘烤2_"]}
            style={{ top: 180, left: 1160 }}
          />
          <DevItem2
            name="烘烤3"
            status={flat_pattern_making?.["烘烤3_"]}
            style={{ top: 180, left: 1215 }}
          />
          <DevItem2
            name="烘烤4"
            status={flat_pattern_making?.["烘烤4_"]}
            style={{ top: 180, left: 1270 }}
          />
          <DevItem2
            name="冷却1"
            status={flat_pattern_making?.["冷却1_"]}
            style={{ top: 180, left: 1325 }}
          />
          <DevItem2
            name="冷却2"
            status={flat_pattern_making?.["冷却2_"]}
            style={{ top: 180, left: 1380 }}
          />
          <DevItem2
            name="冷却3"
            status={flat_pattern_making?.["冷却3_"]}
            style={{ top: 180, left: 1435 }}
          />
          <DevItem2
            name="冷却4"
            status={flat_pattern_making?.["冷却4_"]}
            style={{ top: 180, left: 1490 }}
          />
          <DevItem2
            name="冷却5"
            status={flat_pattern_making?.["冷却5_"]}
            style={{ top: 180, left: 1545 }}
          />
          <DevItem2
            name="埚口研磨"
            status={flat_pattern_making?.["埚口研磨"]}
            style={{ top: 186, left: 1675 }}
          />
          <DevItem1
            name="JH43终检"
            status={flat_pattern_making?.["JH43终检"]}
            style={{ top: 186, left: 1730 }}
          />
          <DevItem2
            name="JH42"
            status={flat_pattern_making?.["JH42"]}
            style={{ top: 186, left: 1805 }}
          />
          <DevItem2
            name="JH47-1"
            status={flat_pattern_making?.["JH47-1"]}
            style={{ top: 186, left: 1860 }}
          />
          <DevItem2
            name="JH45"
            status={flat_pattern_making?.["JH45"]}
            style={{ top: 186, left: 1915 }}
          />
          <DevItem2
            name="JH46"
            status={flat_pattern_making?.["JH46"]}
            style={{ top: 108, left: 1936 }}
          />
          <DevItem1
            name="JH47--架"
            status={flat_pattern_making?.["JH47--架"]}
            style={{ top: 108, left: 2000 }}
          />
          <DevItem2
            name="JH48"
            status={flat_pattern_making?.["JH48"]}
            style={{ top: 108, left: 2090 }}
          />
          <DevItem2
            name="JH49"
            status={flat_pattern_making?.["JH49"]}
            style={{ top: 108, left: 2155 }}
          />
        </div>
        <div className="dev_box3">
          <div className="title">清洗</div>
        </div>
        <div className="dev_box4">
          <div className="title">烘烤冷涂</div>
        </div>
      </div>
      <Row gutter={[32, 32]} className="large_screen_chart_content">
        <Col span={8}>
          <Flex vertical gap={36}>
            <CommonBox name="设备状态">
              <Row gutter={[50, 20]} style={{ height: 280, marginTop: 20 }}>
                {dev_status_list?.map((item, index) => (
                  <Col span={8} key={index}>
                    <DevStatus {...item} />
                  </Col>
                ))}
              </Row>
            </CommonBox>
            <CommonBox name="机台人员表格">
              {/* 后面需要封装 */}
              {/* <div className="table_root">
                <Flex
                  className="tb_header"
                  justify="space-between"
                  align="center"
                >
                  {[
                    "工序",
                    "机台",
                    "主操",
                    "辅操",
                    "班次",
                    "加工批次",
                    "累计加工",
                  ].map((item, index) => (
                    <div className="tb_ceil" key={index}>
                      {item}
                    </div>
                  ))}
                </Flex>
                <Flex
                  vertical
                  gap={5}
                  style={{ overflow: "auto", height: 260 }}
                >
                  {machine_condition?.map((row,_) => {
                    <Flex
                      className="tb_row"
                      justify="space-between"
                      align="center"
                      key={_}
                    >
                      {[
                        "工序",
                        "机台",
                        "主操",
                        "辅操",
                        "班次",
                        "加工批次",
                        "累计加工",
                      ].map((item, index) => {
                        console.log(row[item]);
                        return (
                          <div className="tb_ceil" key={index}>
                            {row[item]}
                          </div>
                        );
                      })}
                    </Flex>;
                  })}
                </Flex>
              </div> */}
              <div className="table_root">
                <ConfigProvider theme={tableTheme}>
                  <Table
                    size="small"
                    columns={columns}
                    dataSource={machine_condition || []}
                    // pagination={false}
                    onRow={() => ({
                      style: {
                        background:
                          "linear-gradient( 270deg, rgba(61,159,255,0.2) 0%, rgba(0,59,159,0.4) 100%)",
                      },
                    })}
                  />
                </ConfigProvider>
              </div>
            </CommonBox>
          </Flex>
        </Col>
        <Col span={8}>
          <Row gutter={[36, 36]}>
            <Col span={12}>
              <CommonBox name="制造统计">
                <Flex className="finish_situation" justify="space-between">
                  <Flex vertical justify="space-around">
                    <div className="situation_item">
                      <span>计划生产</span>
                      <span>{manufacturing_statistics?.["计划生产"] || 0}</span>
                    </div>
                    <div className="situation_item">
                      <span>计划实际完成</span>
                      <span>
                        {manufacturing_statistics?.["计划实际完成"] || 0}
                      </span>
                    </div>
                  </Flex>
                  <div className="situation_chart">
                    <div>完成率</div>
                    <div style={{ fontSize: 24, fontWeight: "bold" }}>
                      {manufacturing_statistics?.["完成率"] || 0}%
                    </div>
                  </div>
                </Flex>
              </CommonBox>
            </Col>
            <Col span={12}>
              <CommonBox name="完成情况">
                <EchartsBarChart chart_data={finish_status} />
              </CommonBox>
            </Col>
            <Col span={24}>
              <CommonBox name="设备稼动率图">
                <EchartsLineChart chart_data={utilization_rate} />
              </CommonBox>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <CommonBox name="后道监控">
            <Row gutter={[16, 16]} className="monitor_root">
              {monitor?.map((item, _) => (
                <Col span={12} key={_}>
                  <div className="monitor">
                    {Object.entries(item)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join("\r\n")}
                  </div>
                </Col>
              ))}
            </Row>
          </CommonBox>
        </Col>
      </Row>
    </div>
  );
}

export default LargeScreen;
