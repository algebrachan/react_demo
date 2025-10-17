import { Col, Row } from "antd";
import React from "react";
import { LineChart } from "../Chart";

function MeltingProcess() {
  return (
    <Row gutter={[10, 10]}>
      <Col span={8}>
        <LineChart title="模具真空压力" tab="总览" />
      </Col>
      <Col span={8}>
        <LineChart title="功率" tab="总览" />
      </Col>
      <Col span={8}>
        <LineChart title="电极开闭位置" tab="总览" />
      </Col>
      <Col span={8}>
        <LineChart title="电极升降位置" tab="总览" />
      </Col>
      <Col span={8}>
        <LineChart title="模具出水流量" tab="总览" />
      </Col>
      <Col span={8}>
        <LineChart title="下隔热板位置" tab="总览" />
      </Col>
      <Col span={8}>
        <LineChart title="A相电流偏差" tab="电流" />
      </Col>
      <Col span={8}>
        <LineChart title="B相电流偏差" tab="电流" />
      </Col>
      <Col span={8}>
        <LineChart title="C相电流偏差" tab="电流" />
      </Col>
      <Col span={8}>
        <LineChart title="A相电流" tab="电流" />
      </Col>
      <Col span={8}>
        <LineChart title="B相电流" tab="电流" />
      </Col>
      <Col span={8}>
        <LineChart title="C相电流" tab="电流" />
      </Col>
    </Row>
  );
}

export default MeltingProcess;
