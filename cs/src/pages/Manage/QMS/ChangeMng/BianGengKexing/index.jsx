import React, { useState, useEffect } from "react";
import { Form, Input, Radio, Button, Space, message, Row, Col } from "antd";
import dayjs from "dayjs";
import { EditTable } from "../Common";
import { Flex } from "antd";
import { ComputeFormCol } from "../../../../../utils/obj";
// 导入新的接口函数
import {
  qmsGetFeasibilityAssessment,
  qmsPutFeasibilityAssessment,
  qmsPostFeasibilityAssessment,
} from "../../../../../apis/qms_router.jsx";
import { Spin } from "antd";

const { TextArea } = Input;

// 定义通用的布尔类型选项
const booleanOptions = [
  { label: "是", value: true },
  { label: "否", value: false },
];

// 定义影响相关的选项
const impactOptions = [
  { label: "有影响", value: true },
  { label: "无影响", value: false },
];

// 定义通知客户的选项
const informCustomerOptions = [
  { label: "需要", value: true },
  { label: "不需要", value: false },
];

// 定义库存品处理方式选项
const inventoryMethodOptions = [
  { label: "旧品可以继续使用，与新品自然切换", value: "continue" },
  { label: "新旧品可以混合使用", value: "mixed" },
  { label: "旧品无法使用，旧品库存报废处理", value: "disposal" },
  { label: "其他", value: "other" },
];

const BianGengKexing = ({ activeKey }) => {
  const default_form_data = {
    number: "",
    changeFeasibility: true,
    experimentCategory:"试样",
    infeasiblReason: "",
    trialProductionPlan: "",
    impactLawReason: "",
    inventoryMethod: "",
    impactCostReason: "",
    impactQualityReason: "",
    informCustomerReason: "",
    inventoryMethodOther: "",
    prodSpecImpactReason: "",
    specialCharImpactReason: "",
    processFlowchartImpactReason: "",
    cpImpactReason: "",
    pfemaImpactReason: "",
    bomImpactReason: "",
    trialProduction: false,
    impactLaw: false,
    impactCost: false,
    impactQuality: false,
    informCustomer: true,
    bomImpact: false,
    pfemaImpact: false,
    cpImpact: false,
    processFlowchartImpact: false,
    specialCharImpact: false,
    prodSpecImpact: false,
    other: "",
  };
  const [load, setLoad] = useState(false);
  const [form] = Form.useForm();
  const [inventoryData, setInventoryData] = useState([]);
  const [sopData, setSopData] = useState([]);
  const [sipData, setSipData] = useState([]);

  // 库存品表格列定义
  const inventoryColumns = [
    "库存品物料编号",
    "库存品名称",
    "规格",
    "数量",
    "处理方式",
  ];
  // SOP表格列定义
  const sopColumns = ["SOP文件", "是否影响", "具体影响"];
  // SIP表格列定义
  const sipColumns = ["SIP文件", "是否影响", "具体影响"];

  const getFeasibilityAssessment = () => {
    const { number = "" } = form.getFieldsValue();
    setLoad(true);
    // 使用新的接口函数
    qmsGetFeasibilityAssessment(
      { number },
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 200 && data) {
          const {
            inventoryBodyData = [],
            sopBodyData = [],
            sipBodyData = [],
          } = data;
          // message.success(msg);
          form.setFieldsValue({
            ...default_form_data,
            ...data,
            number,
          });
          setInventoryData(
            inventoryBodyData.map((item, index) => ({
              ...item,
              key: index + 1,
            }))
          );
          setSopData(
            sopBodyData.map((item, index) => ({ ...item, key: index + 1 }))
          );
          setSipData(
            sipBodyData.map((item, index) => ({ ...item, key: index + 1 }))
          );
        } else {
          form.setFieldsValue({
            ...default_form_data,
            number,
          });
          setInventoryData([]);
          setSopData([]);
          setSipData([]);
        }
      },
      () => {
        setLoad(false);
        form.setFieldsValue({
          ...default_form_data,
          number,
        });
        setInventoryData([]);
        setSopData([]);
        setSipData([]);
        message.error("查询失败");
      }
    );
  };

  const putFeasibilityAssessment = async () => {
    const values = await form.validateFields();
    const param = {
      ...default_form_data,
      ...values,
      inventoryBodyData: inventoryData,
      sopBodyData: sopData,
      sipBodyData: sipData,
    };
    qmsPutFeasibilityAssessment(
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

  const postFeasibilityAssessment = async () => {
    const values = await form.validateFields();
    const param = {
      ...default_form_data,
      ...values,
      inventoryBodyData: inventoryData,
      sopBodyData: sopData,
      sipBodyData: sipData,
    };
    qmsPostFeasibilityAssessment(
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
  useEffect(() => {
    form.setFieldsValue({ number: activeKey });
    if (activeKey) {
      getFeasibilityAssessment();
    }
  }, [activeKey]);
  return (
    <Spin spinning={load}>
      <Row gutter={[20, 20]}>
        <Col span={12}>
          <Form
            form={form}
            {...ComputeFormCol(4)}
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
              <Form.Item label="变更可行性" name="changeFeasibility">
                <Radio.Group
                  options={[
                    { label: "可行", value: true },
                    { label: "不可行", value: false },
                  ]}
                />
              </Form.Item>
              <Form.Item label="测试阶段" name="experimentCategory">
                <Radio.Group options={["试样", "小批量", "批量"]} />
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prev, current) =>
                  prev.changeFeasibility !== current.changeFeasibility
                }
              >
                {({ getFieldValue }) =>
                  !getFieldValue("changeFeasibility") && (
                    <Form.Item
                      label="不可行原因"
                      name="infeasiblReason"
                      rules={[{ required: true }]}
                    >
                      <TextArea placeholder="请输入原因" />
                    </Form.Item>
                  )
                }
              </Form.Item>
              <Form.Item label="试生产验证" name="trialProduction">
                <Radio.Group options={booleanOptions} />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prev, current) =>
                  prev.trialProduction !== current.trialProduction
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue("trialProduction") && (
                    <Form.Item
                      label="试生产验证方案"
                      name="trialProductionPlan"
                      rules={[{ required: true }]}
                    >
                      <TextArea placeholder="试生产验证方案" />
                    </Form.Item>
                  )
                }
              </Form.Item>

              <Form.Item label="影响法规" name="impactLaw">
                <Radio.Group options={impactOptions} />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prev, current) =>
                  prev.impactLaw !== current.impactLaw
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue("impactLaw") && (
                    <Form.Item
                      label="影响法规合规性原因"
                      name="impactLawReason"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="请输入原因" />
                    </Form.Item>
                  )
                }
              </Form.Item>

              <Form.Item label="影响成本" name="impactCost">
                <Radio.Group options={impactOptions} />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prev, current) =>
                  prev.impactCost !== current.impactCost
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue("impactCost") && (
                    <Form.Item
                      label="影响成本原因"
                      name="impactCostReason"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="请输入原因" />
                    </Form.Item>
                  )
                }
              </Form.Item>

              <Form.Item label="影响质量" name="impactQuality">
                <Radio.Group options={impactOptions} />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prev, current) =>
                  prev.impactQuality !== current.impactQuality
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue("impactQuality") && (
                    <Form.Item
                      label="影响质量原因"
                      name="impactQualityReason"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="请输入原因" />
                    </Form.Item>
                  )
                }
              </Form.Item>

              <Form.Item label="通知客户" name="informCustomer">
                <Radio.Group options={informCustomerOptions} />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prev, current) =>
                  prev.informCustomer !== current.informCustomer
                }
              >
                {({ getFieldValue }) =>
                  !getFieldValue("informCustomer") && (
                    <Form.Item
                      label="通知客户原因"
                      name="informCustomerReason"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="请输入原因" />
                    </Form.Item>
                  )
                }
              </Form.Item>

              <Form.Item label="库存品处理方式" name="inventoryMethod">
                <Radio.Group options={inventoryMethodOptions} />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prev, current) =>
                  prev.inventoryMethod !== current.inventoryMethod
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue("inventoryMethod") === "other" && (
                    <Form.Item
                      label="其他处理方式"
                      name="inventoryMethodOther"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="请输入其他处理方式" />
                    </Form.Item>
                  )
                }
              </Form.Item>

              <Form.Item label="BOM" name="bomImpact">
                <Radio.Group options={impactOptions} />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prev, current) =>
                  prev.bomImpact !== current.bomImpact
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue("bomImpact") && (
                    <Form.Item
                      label="BOM原因"
                      name="bomImpactReason"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="请输入原因" />
                    </Form.Item>
                  )
                }
              </Form.Item>

              <Form.Item label="PFMEA" name="pfemaImpact">
                <Radio.Group options={impactOptions} />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prev, current) =>
                  prev.pfemaImpact !== current.pfemaImpact
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue("pfemaImpact") && (
                    <Form.Item
                      label="PFMEA原因"
                      name="pfemaImpactReason"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="请输入原因" />
                    </Form.Item>
                  )
                }
              </Form.Item>

              <Form.Item label="CP" name="cpImpact">
                <Radio.Group options={impactOptions} />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prev, current) =>
                  prev.cpImpact !== current.cpImpact
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue("cpImpact") && (
                    <Form.Item
                      label="CP原因"
                      name="cpImpactReason"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="请输入原因" />
                    </Form.Item>
                  )
                }
              </Form.Item>

              <Form.Item label="过程流程图" name="processFlowchartImpact">
                <Radio.Group options={impactOptions} />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prev, current) =>
                  prev.processFlowchartImpact !== current.processFlowchartImpact
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue("processFlowchartImpact") && (
                    <Form.Item
                      label="过程流程图原因"
                      name="processFlowchartImpactReason"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="请输入原因" />
                    </Form.Item>
                  )
                }
              </Form.Item>

              <Form.Item label="特殊特性" name="specialCharImpact">
                <Radio.Group options={impactOptions} />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prev, current) =>
                  prev.specialCharImpact !== current.specialCharImpact
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue("specialCharImpact") && (
                    <Form.Item
                      label="特殊特性原因"
                      name="specialCharImpactReason"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="请输入原因" />
                    </Form.Item>
                  )
                }
              </Form.Item>

              <Form.Item label="产品规范" name="prodSpecImpact">
                <Radio.Group options={impactOptions} />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prev, current) =>
                  prev.prodSpecImpact !== current.prodSpecImpact
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue("prodSpecImpact") && (
                    <Form.Item
                      label="产品规范原因"
                      name="prodSpecImpactReason"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="请输入原因" />
                    </Form.Item>
                  )
                }
              </Form.Item>

              <Form.Item label="其他" name="other">
                <TextArea placeholder="请输入其他内容" />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
                <Space size={20}>
                  <Button type="primary" onClick={getFeasibilityAssessment}>
                    查询
                  </Button>
                  <Button onClick={putFeasibilityAssessment}>修改</Button>
                  <Button onClick={postFeasibilityAssessment}>提交</Button>
                </Space>
              </Form.Item>
            </Flex>
          </Form>
        </Col>
        <Col span={12}>
          <Flex vertical gap={16}>
            <EditTable
              add_name="增加库存品"
              dataSource={inventoryData}
              columns_text={inventoryColumns}
              setTbData={setInventoryData}
            />
            <EditTable
              title={() => "SOP文件影响"}
              add_name="增加SOP文件"
              dataSource={sopData}
              columns_text={sopColumns}
              setTbData={setSopData}
            />
            <EditTable
              title={() => "SIP文件影响"}
              add_name="增加SIP文件"
              dataSource={sipData}
              columns_text={sipColumns}
              setTbData={setSipData}
            />
          </Flex>
        </Col>
      </Row>
    </Spin>
  );
};

export default BianGengKexing;
