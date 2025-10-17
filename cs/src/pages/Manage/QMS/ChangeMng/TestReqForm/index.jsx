import React, { useState, useEffect } from "react";
import { Form, Input, Radio, DatePicker, Button, Table } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { Flex } from "antd";
import { ComputeFormCol } from "../../../../../utils/obj";
import { EditTable } from "../Common";
import { Space } from "antd";
import {
  qmsGetProcessRequirements,
  qmsPostProcessRequirements,
  qmsPutProcessRequirements,
} from "../../../../../apis/qms_router";
import { message } from "antd";
import { dateFormat, timeFormat } from "../../../../../utils/string";
import { Spin } from "antd";

const TestReqForm = ({ activeKey }) => {
  const default_form_data = {
    // number: "",
    experimentCategory: "",
    test_number: "", // 测试编号
    edition: "",
    plannedDate: "",
    testOrderNumber: "",
    experimentName: "",
    applicationDepartment: "",
    applicant: "",
    applicationDate: "",
    productName: "",
    specification: "",
    customers: "",
    experimentPurpose: "",
    requiredMaterials: "",
    requiredTools: "",
    GMOpinion: true,
    GMOpinionReason: "",
    developPerson: true,
    developPersonReason: "",
  };
  const [form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const [data, setData] = useState({});
  const verificationHeadData = ["验证项目", "验证方法标准", "判定标准"];
  const [verificationBodyData, setVerificationBodyData] = useState([]);
  const testProcessHeadData = ["相关部门", "意见", "签名", "日期"];
  const [testProcessBodyData, setTestProcessBodyData] = useState([]);

  const searchProcessRequirements = () => {
    const { number } = form.getFieldsValue();
    if (!number) return message.error("请选择变更单号");
    setLoad(true);
    qmsGetProcessRequirements(
      { number },
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 200 && data) {
          setData(data);
        } else {
          setData({})
          form.setFieldsValue({ ...default_form_data });
          setVerificationBodyData([]);
          setTestProcessBodyData([]);
        }
      },
      () => {
        setLoad(false);
        form.setFieldsValue({ ...default_form_data });
        setVerificationBodyData([]);
        setTestProcessBodyData([]);
        message.error("查询失败");
      }
    );
  };

  const putProcessRequirements = async () => {
    const values = await form.validateFields();
    const param = {
      ...default_form_data,
      ...values,
      verification_bodyData: verificationBodyData,
      changeHuiqian_bodyData: testProcessBodyData,
    };
    qmsPutProcessRequirements(
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

  const postProcessRequirements = async () => {
    const values = await form.validateFields();
    const param = {
      ...default_form_data,
      ...values,
      verification_bodyData: verificationBodyData,
      changeHuiqian_bodyData: testProcessBodyData,
    };
    qmsPostProcessRequirements(
      param,
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("提交成功");
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("提交失败");
      }
    );
  };

  const chgCategory = (value) => {
    if (data[value]) {
      const { verification_bodyData = [], changeHuiqian_bodyData = [] } =
        data[value];
      form.setFieldsValue({
        ...default_form_data,
        ...data[value],
        experimentCategory: value,
      });
      setVerificationBodyData(
        verification_bodyData.map((item, index) => ({
          ...item,
          key: index + 1,
        }))
      );
      setTestProcessBodyData(
        changeHuiqian_bodyData.map((item, index) => ({
          ...item,
          key: index + 1,
        }))
      );
    } else {
      form.setFieldsValue({ ...default_form_data, experimentCategory: value });
      setVerificationBodyData([]);
      setTestProcessBodyData([]);
    }
  };

  useEffect(() => {
    if (data) {
      const { experimentCategory } = form.getFieldsValue();
      chgCategory(experimentCategory || "试样");
    }
  }, [data]);

  useEffect(() => {
    form.setFieldsValue({ number: activeKey });
    if (activeKey) {
      searchProcessRequirements();
    }
  }, [activeKey]);

  return (
    <Spin spinning={load}>
      <Form
        form={form}
        initialValues={default_form_data}
        {...ComputeFormCol(2)}
      >
        <Flex vertical gap={16}>
          <Form.Item
            label="变更单号"
            name="number"
            rules={[{ required: true, message: "请选择变更单号" }]}
          >
            <Input placeholder="请选择变更单号" disabled />
          </Form.Item>
          <Form.Item label="测试阶段" name="experimentCategory">
            <Radio.Group
              options={["试样", "小批量", "批量"]}
              onChange={(e) => chgCategory(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="测试编号" name="test_number">
            <Input placeholder="自动生成" disabled />
          </Form.Item>
          <Form.Item label="版本" name="edition">
            <Input placeholder="请输入版本" />
          </Form.Item>
          <Form.Item
            label="计划测试时间"
            name="plannedDate"
            getValueProps={(value) => {
              return {
                value: value && value.map((e) => dayjs(e)),
              };
            }}
            normalize={(value) =>
              value && value.map((e) => dayjs(e).format(timeFormat))
            }
          >
            <DatePicker.RangePicker showTime placeholder="选择日期" />
          </Form.Item>
          <Form.Item label="测试单号" name="testOrderNumber">
            <Input placeholder="请输入测试单号" />
          </Form.Item>
          <Form.Item label="测试名称" name="experimentName">
            <Input placeholder="请输入测试名称" />
          </Form.Item>
          <Form.Item label="申请部门" name="applicationDepartment">
            <Input placeholder="请输入部门" />
          </Form.Item>
          <Form.Item label="变更负责人" name="applicant">
            <Input placeholder="请输入实验名称" />
          </Form.Item>
          <Form.Item
            label="申请时间"
            name="applicationDate"
            getValueProps={(value) => {
              return {
                value: value && dayjs(value),
              };
            }}
            normalize={(value) => value && dayjs(value).format(dateFormat)}
          >
            <DatePicker placeholder="选择日期" />
          </Form.Item>
          <Form.Item label="产品名称" name="productName">
            <Input placeholder="请输入产品名称" />
          </Form.Item>
          <Form.Item label="规格" name="specification">
            <Input placeholder="请输入规格" />
          </Form.Item>
          <Form.Item label="涉及顾客" name="customers">
            <Input placeholder="请输入涉及顾客" />
          </Form.Item>
          <h3>主要内容</h3>
          <Form.Item label="实验目的" name="experimentPurpose">
            <Input />
          </Form.Item>
          <div>
            <h4>验证内容</h4>
            <EditTable
              add_name="添加验证项目"
              dataSource={verificationBodyData}
              columns_text={verificationHeadData}
              setTbData={setVerificationBodyData}
            />
          </div>
          <Form.Item label="重要原辅材料要求" name="requiredMaterials">
            <Input />
          </Form.Item>
          <Form.Item label="设施、设备及工装要求" name="requiredTools">
            <Input />
          </Form.Item>
          <div>
            <h4>部门会签</h4>
            <EditTable
              add_name="添加测试流程"
              dataSource={testProcessBodyData}
              columns_text={testProcessHeadData}
              setTbData={setTestProcessBodyData}
            />
          </div>

          <Form.Item label="研发负责人" name="developPerson">
            <Radio.Group
              options={[
                { label: "同意", value: true },
                { label: "不同意", value: false },
              ]}
            />
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.developPerson !== currentValues.developPerson
            }
          >
            {({ getFieldValue }) =>
              !getFieldValue("developPerson") && (
                <Form.Item label=" " name="developPersonReason">
                  <Input.TextArea placeholder="请输入原因" />
                </Form.Item>
              )
            }
          </Form.Item>
          <Form.Item label="总经理" name="GMOpinion">
            <Radio.Group
              options={[
                { label: "同意", value: true },
                { label: "不同意", value: false },
              ]}
            />
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
                  <Input.TextArea placeholder="请输入原因" />
                </Form.Item>
              )
            }
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 2, span: 16 }}>
            <Space size={20}>
              <Button type="primary" onClick={searchProcessRequirements}>
                查询
              </Button>
              <Button onClick={putProcessRequirements}>修改</Button>
              <Button onClick={postProcessRequirements}>提交</Button>
            </Space>
          </Form.Item>
        </Flex>
      </Form>
    </Spin>
  );
};

export default TestReqForm;
