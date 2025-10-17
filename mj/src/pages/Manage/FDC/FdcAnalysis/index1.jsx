import React, { useEffect, useState } from "react";
import { GeneralCard, MyBreadcrumb } from "../../../../components/CommonCard";
import { Col, Flex, Row, Spin, Table, Tree, message } from "antd";
import { MemoLineChart } from "./Chart";
import useWebSocket from "../../../../utils/websocket";
import { getFdcDevice } from "../../../../apis/fdc_api";
import { Radio } from "antd";
import { Tabs } from "antd";
import MjSpcMain from "./MjSpcMain";
import { getEvalution } from "../../../../apis/anls_api";
import AiPush from "./AiPush";

const FdcChart = ({ chart_load = false, chart_list = [] }) => {
  return (
    <Spin spinning={chart_load}>
      <GeneralCard name="实时曲线区域">
        {!chart_load && (
          <div style={{ width: "100%", padding: 10 }} className="of">
            <Row gutter={[10, 10]}>
              {chart_list.map((item, _) => (
                <Col span={12} key={_}>
                  <MemoLineChart chart_data={item} />
                </Col>
              ))}
            </Row>
          </div>
        )}
      </GeneralCard>
    </Spin>
  );
};

function FdcAnalysis() {
  const [webSocket, sendMessage, lastMessage, isConnected] = useWebSocket({
    url: `${
      import.meta.env.VITE_FDC_WS_API
    }/api/home_analysis/parameter_monitoring_new`, //这里放长链接
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
      // console.log("WebSocket received message:", message);
      const { code, data, msg } = message;
      if (code === 200) {
        setChartLoad(false);
        setChartList(data);
      }
    },
  });
  const [dev, setDev] = useState("");
  const [tree, setTree] = useState([]); //树状图
  const [chart_load, setChartLoad] = useState(false);
  const [chart_list, setChartList] = useState([]);

  const tabItems = [
    ...["熔融机11", "熔融机12", "熔融机13", "熔融机14", "熔融机15"].map(
      (item) => ({
        label: item,
        key: item,
        children: (
          <Flex vertical gap={16}>
            <FdcChart
              chart_load={chart_load}
              chart_list={chart_list}
              key={item}
            />
            <AiPush dev={item} />
            {/* <Spin spinning={desc_load}>
              <div>
                <h3>配方详情</h3>
                <div
                  style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                  {desc}
                </div>
              </div>
            </Spin> */}
          </Flex>
        ),
      })
    ),
    {
      label: "制造现场SPC",
      key: "制造现场SPC",
      children: <MjSpcMain />,
    },
  ];

  const getDev = () => {
    let val = {
      factory: "美晶",
      workshop: "熔融",
      process: "熔融",
    };
    getFdcDevice(
      val,
      (res) => {
        const { data, code, msg } = res.data;
        if (code === 200 && data) {
          setDev("熔融机11");
          setTree(data);
        } else {
          setTree([]);
        }
      },
      () => {
        setTree([]);
      }
    );
  };
  useEffect(() => {
    if (dev.includes("熔融机")) {
      setChartLoad(true);
      setTimeout(() => {
        setChartLoad(false);
      }, 10000);
      const obj = tree.find((e) => e.title === dev);
      const device_infos = obj?.children || [];
      sendMessage({ device_infos });
    }
  }, [dev]);

  useEffect(() => {
    getDev();

    return () => {
      if (webSocket) {
        webSocket.close();
      }
    };
  }, []);

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "FDC分析"]} />
      <div className="content_root">
        <Flex vertical gap={16}>
          <Tabs
            onChange={setDev}
            type="card"
            items={tabItems}
            destroyOnHidden={true}
          />
          {/* <Radio.Group
            buttonStyle="solid"
            optionType="button"
            value={dev}
            onChange={(e) => setDev(e.target.value)}
            options={[
              { label: "熔融机11", value: "熔融机11" },
              { label: "熔融机12", value: "熔融机12" },
              { label: "熔融机13", value: "熔融机13" },
              { label: "熔融机14", value: "熔融机14" },
              { label: "熔融机15", value: "熔融机15" },
              { label: "制造现场spc", value: "制造现场spc" },
            ]}
          /> */}
        </Flex>
      </div>
    </div>
  );
}

export default FdcAnalysis;
