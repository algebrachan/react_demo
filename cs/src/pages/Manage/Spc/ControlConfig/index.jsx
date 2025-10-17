import React, { useState } from "react";
import { GeneralCard, MyBreadcrumb } from "../../../../components/CommonCard";
import { Button, Col, DatePicker, Form, Row, Select } from "antd";
import { selectList2Option } from "../../../../utils/string";
import dayjs from "dayjs";
import { Form1, Form2, Form3 } from "./Form";
const { RangePicker } = DatePicker;

const default_query_form = {
  起止时间: [dayjs().subtract(7, "day"), dayjs()],
  工厂: "",
  车间: "",
  工序: "",
  机台: "",
  特征: "",
  控制图类型: "",
};

function ControlConfig() {
  const [query_form] = Form.useForm();
  const [query_opt, setQueryOpt] = useState({});
  return (
    <div>
      <MyBreadcrumb items={["创盛长晶智能集控系统", "控制图分析"]} />
      <div
        className="content_root"
        style={{
          display: "flex",
          rowGap: 20,
          flexDirection: "column",
        }}
      >
        <Form
          form={query_form}
          initialValues={default_query_form}
          layout="inline"
        >
          {Object.keys(default_query_form).map((e, _) => (
            <Form.Item name={e} label={e} key={_}>
              {e === "起止时间" ? (
                <RangePicker
                  showTime
                  style={{ width: 330 }}
                  allowClear={false}
                />
              ) : (
                <Select
                  options={selectList2Option(query_opt[e])}
                  style={{ width: 120 }}
                />
              )}
            </Form.Item>
          ))}
          <Button type="primary">查询</Button>
        </Form>
        <Row gutter={[16, 16]} style={{ minHeight: 500 }}>
          <Col span={8}>
            <GeneralCard name="手动阈值设定">
              <Form1 />
            </GeneralCard>
          </Col>
          <Col span={8}>
            <GeneralCard name="自动阈值更新">
              <Form2 />
            </GeneralCard>
          </Col>
          <Col span={8}>
            <GeneralCard name="控制图设定">
              <Form3 />
            </GeneralCard>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default ControlConfig;
