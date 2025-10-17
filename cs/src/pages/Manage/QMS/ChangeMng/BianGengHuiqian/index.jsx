import React, { useState, useEffect } from "react";
import { Form, Input, Radio, Button, Table, Space, message } from "antd";
import axios from "axios";
import { Flex } from "antd";
import { ComputeFormCol } from "../../../../../utils/obj";
import {
  qmsGetChangeCountersignature,
  qmsPostChangeCountersignature,
  qmsPutChangeCountersignature,
} from "../../../../../apis/qms_router";
import { Spin } from "antd";

const { TextArea } = Input;

const agreeOptions = [
  { label: "同意", value: "同意" },
  { label: "驳回", value: "驳回" },
];
const boolOptions = [
  { label: "同意", value: true },
  { label: "驳回", value: false },
];

// 定义影响相关的选项
const default_tb_data = [
  { 序号: 1, 部门: "研发技术部", 意见: "", 是否同意: "", 签名: "" },
  { 序号: 2, 部门: "长晶生产车间", 意见: "", 是否同意: "", 签名: "" },
  { 序号: 3, 部门: "原料合成车间", 意见: "", 是否同意: "", 签名: "" },
  { 序号: 4, 部门: "质量管理部", 意见: "", 是否同意: "", 签名: "" },
  { 序号: 5, 部门: "销售部", 意见: "", 是否同意: "", 签名: "" },
  { 序号: 6, 部门: "设备动力科", 意见: "", 是否同意: "", 签名: "" },
  { 序号: 7, 部门: "人力资源部", 意见: "", 是否同意: "", 签名: "" },
  { 序号: 8, 部门: "坩埚车间", 意见: "", 是否同意: "", 签名: "" },
  { 序号: 9, 部门: "制造部", 意见: "", 是否同意: "", 签名: "" },
  { 序号: 10, 部门: "采购部", 意见: "", 是否同意: "", 签名: "" },
  { 序号: 11, 部门: "PMC", 意见: "", 是否同意: "", 签名: "" },
  { 序号: 12, 部门: "安环部", 意见: "", 是否同意: "", 签名: "" },
  { 序号: 13, 部门: "财务部", 意见: "", 是否同意: "", 签名: "" },
  { 序号: 14, 部门: "计划部", 意见: "", 是否同意: "", 签名: "" },
];
const BianGengHuiqian = ({ activeKey }) => {
  const default_form_data = {
    number: "",
    RDOpinion: true,
    RDOpinionReason: "",
    GMOpinion: true,
    GMOpinionReason: "",
  };
  const [load, setLoad] = useState(false);
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState([]);

  const columns = [
    {
      title: "序号",
      dataIndex: "序号",
      key: "序号",
    },
    {
      title: "部门",
      dataIndex: "部门",
      key: "部门",
    },
    {
      title: "意见",
      dataIndex: "意见",
      key: "意见",
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleInputChange(e, record, "意见")}
        />
      ),
    },
    {
      title: "是否同意",
      dataIndex: "是否同意",
      key: "是否同意",
      render: (text, record) => (
        <Radio.Group
          value={text}
          onChange={(e) => handleRadioChange(e, record)}
          options={agreeOptions}
        />
      ),
    },
    {
      title: "签名",
      dataIndex: "签名",
      key: "签名",
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleInputChange(e, record, "签名")}
        />
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleAgree(record)}>
            同意
          </Button>
          <Button type="link" onClick={() => handleReject(record)}>
            驳回
          </Button>
        </Space>
      ),
    },
  ];

  const handleInputChange = (e, record, field) => {
    const newData = [...tableData];
    const index = newData.findIndex((item) => record.序号 === item.序号);
    if (index > -1) {
      newData[index][field] = e.target.value;
      setTableData(newData);
    }
  };

  const handleRadioChange = (e, record) => {
    const newData = [...tableData];
    const index = newData.findIndex((item) => record.序号 === item.序号);
    if (index > -1) {
      newData[index]["是否同意"] = e.target.value;
      setTableData(newData);
    }
  };

  const handleAgree = (record) => {
    message.success(`已同意 ${record.部门} 的会签`);
    const newData = [...tableData];
    const index = newData.findIndex((item) => record.序号 === item.序号);
    if (index > -1) {
      newData[index]["是否同意"] = "同意";
      setTableData(newData);
    }
  };

  const handleReject = (record) => {
    message.warning(`已驳回 ${record.部门} 的会签`);
    const newData = [...tableData];
    const index = newData.findIndex((item) => record.序号 === item.序号);
    if (index > -1) {
      newData[index]["是否同意"] = "驳回";
      setTableData(newData);
    }
  };

  const searchChangeCountersignature = () => {
    const { number } = form.getFieldsValue();
    setLoad(true);
    qmsGetChangeCountersignature(
      { number },
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 200 && data) {
          // message.success(msg);
          const { bodyData = [] } = data;
          form.setFieldsValue({ ...default_form_data, ...data, number });
          setTableData(bodyData);
        } else {
          form.setFieldsValue({ ...default_form_data, number });
          setTableData([]);
        }
      },
      () => {
        setLoad(false);
        message.error("查询失败");
        form.setFieldsValue({ ...default_form_data, number });
        setTableData([]);
      }
    );
  };

  const putChangeCountersignature = async () => {
    const values = await form.validateFields();
    const param = {
      ...default_form_data,
      ...values,
      bodyData: tableData,
    };
    qmsPutChangeCountersignature(
      param,
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("修改成功");
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("修改失败");
      }
    );
  };

  const postChangeCountersignature = async () => {
    const values = await form.validateFields();
    const param = {
      ...default_form_data,
      ...values,
      bodyData: tableData,
    };
    qmsPostChangeCountersignature(
      param,
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("修改成功");
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("修改失败");
      }
    );
  };
  useEffect(() => {
    form.setFieldsValue({ number: activeKey });
    if (activeKey) {
      searchChangeCountersignature();
    }
  }, [activeKey]);

  return (
    <Spin spinning={load}>
      <Form
        form={form}
        {...ComputeFormCol(2)}
        initialValues={default_form_data}
      >
        <Flex vertical gap={16}>
          <Form.Item
            label="变更单号"
            name="number"
            rules={[{ required: true, message: "请选择变更单号" }]}
          >
            <Input placeholder="请选择变更单号" disabled />
          </Form.Item>
          <Table
            columns={columns}
            dataSource={tableData}
            rowKey="序号"
            bordered
            pagination={false}
          />

          <Form.Item label="研发技术部" name="RDOpinion">
            <Radio.Group options={boolOptions} />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.RDOpinion !== currentValues.RDOpinion
            }
          >
            {({ getFieldValue }) =>
              !getFieldValue("RDOpinion") && (
                <Form.Item label=" " name="RDOpinionReason">
                  <TextArea placeholder="输入原因" />
                </Form.Item>
              )
            }
          </Form.Item>

          <Form.Item label="总经理" name="GMOpinion">
            <Radio.Group options={boolOptions} />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.GMOpinion !== currentValues.GMOpinion
            }
          >
            {({ getFieldValue }) =>
              !getFieldValue("GMOpinion") && (
                <Form.Item label=" " name="GMOpinionReason">
                  <TextArea placeholder="原因" />
                </Form.Item>
              )
            }
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            <Space size={20}>
              <Button type="primary" onClick={searchChangeCountersignature}>
                查询
              </Button>
              <Button onClick={putChangeCountersignature}>修改</Button>
              <Button onClick={postChangeCountersignature}>提交</Button>
            </Space>
          </Form.Item>
        </Flex>
      </Form>
    </Spin>
  );
};

export default BianGengHuiqian;
