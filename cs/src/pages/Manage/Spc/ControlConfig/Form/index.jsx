import { Button, Col, Form, Input, Row, Select, DatePicker } from "antd";
import React, { useState } from "react";
import { selectList2Option } from "../../../../../utils/string";
import { ComputeFormCol } from "../../../../../utils/obj";
const { RangePicker } = DatePicker;
export const Form1 = ({}) => {
  const [form] = Form.useForm();
  const [opt_obj, setOptObj] = useState({});
  const param_list = [
    "规格线上限USL",
    "预警线上限UWL",
    "控制线上限UCL",
    "目标线Target",
    "控制线下限LCL",
    "预警线下限LWL",
    "规格线下限LSL",
  ];
  return (
    <Form
      form={form}
      style={{
        padding: 10,
        // display: "flex",
        // rowGap: 12,
        // flexDirection: "column",
      }}
      {...ComputeFormCol(8)}
    >
      <Row gutter={[16, 12]}>
        <Col span={16}>
          <Form.Item label="参数" name="参数">
            <Select options={selectList2Option(opt_obj["参数"])} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Button type="primary">加载</Button>
        </Col>
        {param_list.map((item, _) => (
          <>
            <Col span={16}>
              <Form.Item label={item} name={[item, "select"]}>
                <Select options={selectList2Option(opt_obj[item])} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={[item, "ipt"]} {...ComputeFormCol(0)}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          </>
        ))}
        <Col span={21}>
          <Form.Item label="时间范围" name="时间范围" {...ComputeFormCol(6)}>
            <RangePicker showTime allowClear={false} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export const Form2 = ({}) => {
  const [form] = Form.useForm();
  const [opt_obj, setOptObj] = useState({});
  const param_list = ["USL", "UWL", "UCL", "Target", "LCL", "LWL", "LSL"];

  return (
    <Form
      form={form}
      style={{
        padding: 10,
      }}
      {...ComputeFormCol(8)}
    >
      <Row gutter={[16, 12]}>
        <Col span={16}>
          <Form.Item label="自动更新基准" name="自动更新基准">
            <Select options={selectList2Option(opt_obj["自动更新基准"])} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Button type="primary">加载</Button>
        </Col>
        <Col span={16}>
          <Form.Item label="最小更新样本数" name="最小更新样本数">
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item label="最小计算周期" name="最小计算周期">
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item label="数据预处理算法" name="数据预处理算法">
            <Select options={selectList2Option(opt_obj["数据预处理算法"])} />
          </Form.Item>
        </Col>
        {param_list.map((item, _) => (
          <>
            <Col span={16}>
              <Form.Item label={item} name={[item, "select"]}>
                <Select options={selectList2Option(opt_obj[item])} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={[item, "ipt"]} {...ComputeFormCol(0)}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          </>
        ))}
        <Col span={21}>
          <Form.Item
            label="下次更新时间"
            name="下次更新时间"
            {...ComputeFormCol(6)}
          >
            <RangePicker showTime allowClear={false} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export const Form3 = ({}) => {
  const [form] = Form.useForm();
  const [opt_obj, setOptObj] = useState({});
  const param_list = ["USL", "UWL", "UCL", "Target", "LCL", "LWL", "LSL"];
  return (
    <Form
      form={form}
      style={{
        padding: 10,
      }}
      {...ComputeFormCol(6)}
    >
      <Row gutter={[16, 12]}>
        <Col span={16}>
          <Form.Item label="参数" name="参数">
            <Select options={selectList2Option(opt_obj["参数"])} />
          </Form.Item>
        </Col>
        {param_list.map((item, _) => (
          <>
            <Col span={16}>
              <Form.Item label={item} name={[item, "select"]}>
                <Select options={selectList2Option(opt_obj[item])} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={[item, "ipt"]} {...ComputeFormCol(0)}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
          </>
        ))}
      </Row>
    </Form>
  );
};
