import React, { useEffect, useState } from "react";
import "./tpm.less";
import { Col, Flex, Row, Spin, message } from "antd";
import {
  DevStatus,
  FaultBarChart,
  LineBarChart,
  ReLifeBarChart,
  RepairTable,
  StatusBar,
  TrendChart,
} from "./comp";
import { getTpmPresentData } from "../../apis/tpm_api.jsx";

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

function Tpm() {
  const [menu, setMenu] = useState("A01");
  const [load, setLoad] = useState(false);

  const [tpm_data, setTpmData] = useState({});
  const menu_list = [
    { name: "设备", cls: "menu1", value: "A01" },
    { name: "动力", cls: "menu2", value: "B01" },
    { name: "高压", cls: "menu3", value: "C01" },
    { name: "工装", cls: "menu4", value: "D01" },
  ];

  const requestData = () => {
    // setLoad(true);
    getTpmPresentData(
      { partitionId: menu },
      (res) => {
        // setLoad(false);
        const { data, code, isSuccess, message: msg } = res.data;
        if (code === 200 && isSuccess) {
          setTpmData(data);
        } else {
          message.error(msg);
          setTpmData({});
        }
      },
      () => {
        // setLoad(false);
        setTpmData({});
      }
    );
  };
  useEffect(() => {
    requestData();
    const intervalId = setInterval(() => {
      requestData();
    }, 60 * 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [menu]);

  return (
    <div className="tpm_root">
      <Spin spinning={load}>
        <div className="tpm_head">
          <div className="title">设备数字运维中心</div>
          {menu_list.map((item, _) => (
            <div
              key={_}
              className={`${item.cls} ${
                menu === item.value ? "active" + _ : ""
              }`}
              onClick={() => setMenu(item.value)}
            >
              {item.name}
            </div>
          ))}
        </div>
        <div className="tpm_content">
          <Row gutter={[20, 20]}>
            <Col span={5}>
              <CommonBox name="设备状态分布">
                <DevStatus data={tpm_data["deviceStateInfo"] || {}} />
              </CommonBox>
            </Col>
            <Col span={14}>
              <StatusBar data={tpm_data || {}} />
            </Col>
            <Col span={5}>
              <CommonBox name="设备完好率趋势图">
                <TrendChart
                  data={tpm_data["perfectnessRateData"] || []}
                  target={98}
                />
              </CommonBox>
            </Col>
            <Col span={5}>
              {/* <CommonBox name="设备故障排行">
                <FaultBarChart data={tpm_data["breakdownCountData"]} />
              </CommonBox> */}
              <CommonBox name="剩余寿命排行">
                <ReLifeBarChart
                  data={{
                    componentRemainLifeData:
                      tpm_data["componentRemainLifeData"] || [],
                    deviceRemainLifeData:
                      tpm_data["deviceRemainLifeData"] || [],
                  }}
                />
              </CommonBox>
            </Col>
            <Col span={14}>
              <CommonBox name="报修中心">
                <RepairTable data={tpm_data["repairRequests"] || []} />
              </CommonBox>
            </Col>
            <Col span={5}>
              <CommonBox name="保养达成率趋势图">
                <TrendChart
                  data={tpm_data["maintainAchievingRateData"] || []}
                  target={99}
                />
              </CommonBox>
            </Col>
            <Col span={12}>
              <CommonBox name="故障频次统计图">
                <LineBarChart data={tpm_data["breakdownCountData"]} />
              </CommonBox>
            </Col>
            <Col span={12}>
              <CommonBox name="故障工时统计图">
                <LineBarChart
                  name_type="工时"
                  data={tpm_data["breakdownTimeData"]}
                />
              </CommonBox>
            </Col>
          </Row>
        </div>
      </Spin>
    </div>
  );
}

export default Tpm;
