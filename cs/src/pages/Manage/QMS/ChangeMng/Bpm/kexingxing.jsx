import React, { useState, useEffect } from "react";
import { Form, Input, Radio, Button, Spin, message, Card } from "antd";
import { Flex } from "antd";
import { ComputeFormCol } from "@/utils/obj";
// 导入新的接口函数
import { qmsPostFeasibilityAssessment } from "@/apis/qms_router.jsx";
import { CommonEditTable } from "../../../../../utils/obj";

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

const KeXingXing = ({
  id = "",
  review_data = {},
  disabled = false,
  reFresh = () => {},
}) => {
  const default_form_data = {
    changeFeasibility: true,
    experimentCategory: "试样",
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
  const kexing = Form.useWatch("changeFeasibility", form);
  const [inventoryData, setInventoryData] = useState([]);
  const [sopData, setSopData] = useState([]);
  const [sipData, setSipData] = useState([]);

  // 库存品表格列定义
  const inventory_columnsItems = [
    { name: "库存品物料编号", type: "input" },
    { name: "库存品名称", type: "input" },
    { name: "规格", type: "input" },
    { name: "数量", type: "input" },
    { name: "处理方式", type: "input" },
  ];
  // SOP表格列定义
  const sop_columnsItems = [
    { name: "SOP文件", type: "input" },
    { name: "是否影响", type: "radio", opt: ["是", "否"] },
    { name: "具体影响", type: "input" },
  ];

  // SIP表格列定义
  const sip_columnsItems = [
    { name: "SIP文件", type: "input" },
    { name: "是否影响", type: "radio", opt: ["是", "否"] },
    { name: "具体影响", type: "input" },
  ];

  const postFeasibilityAssessment = async () => {
    const values = await form
      .validateFields()
      .then((res) => res)
      .catch((err) => {
        const { errorFields } = err;
        let err_list = errorFields.map((e) => e.errors);
        message.warning(err_list.join("\n"));
        return false;
      });
    if (!values) return;
    const param = {
      ...default_form_data,
      ...values,
      inventoryBodyData: inventoryData,
      sopBodyData: sopData,
      sipBodyData: sipData,
      number: id,
    };
    setLoad(true);
    qmsPostFeasibilityAssessment(
      param,
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("提交成功");
          reFresh();
        } 
      },
      () => {
        setLoad(false);
      }
    );
  };
  useEffect(() => {
    if (review_data) {
      form.setFieldsValue(review_data);
      const {
        inventoryBodyData = [],
        sipBodyData = [],
        sopBodyData = [],
      } = review_data;
      setInventoryData(inventoryBodyData);
      setSopData(sopBodyData);
      setSipData(sipBodyData);
    } else {
      setInventoryData([]);
      setSopData([]);
      setSipData([]);
      form.resetFields();
    }
  }, [review_data]);
  return (
    <Flex vertical gap={16}>
      <div className="no_review_title">可行性方案</div>
      <Card>
        <Spin spinning={load}>
          <Form
            form={form}
            {...ComputeFormCol(4)}
            initialValues={default_form_data}
            disabled={disabled}
          >
            <Flex vertical gap={16}>
              <Form.Item label="变更可行性" name="changeFeasibility">
                <Radio.Group
                  options={[
                    { label: "可行", value: true },
                    { label: "不可行", value: false },
                  ]}
                />
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
              <Form.Item label="测试阶段" name="experimentCategory">
                <Radio.Group options={["试样", "小批量", "批量"]} />
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
                      rules={kexing ? [{ required: true }] : []}
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
                      rules={kexing ? [{ required: true }] : []}
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
                      rules={kexing ? [{ required: true }] : []}
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
                      rules={kexing ? [{ required: true }] : []}
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
                  getFieldValue("informCustomer") && (
                    <Form.Item
                      label="通知客户原因"
                      name="informCustomerReason"
                      rules={kexing ? [{ required: true }] : []}
                    >
                      <Input placeholder="请输入原因" />
                    </Form.Item>
                  )
                }
              </Form.Item>

              <Form.Item
                label="库存品处理方式"
                name="inventoryMethod"
                rules={kexing ? [{ required: true }] : []}
              >
                <Radio.Group options={inventoryMethodOptions} />
              </Form.Item>
              <CommonEditTable
                dataSource={inventoryData}
                setTbData={setInventoryData}
                columnsItems={inventory_columnsItems}
                name="库存品"
              />
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
                      rules={kexing ? [{ required: true }] : []}
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
                      rules={kexing ? [{ required: true }] : []}
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
                      rules={kexing ? [{ required: true }] : []}
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
                      rules={kexing ? [{ required: true }] : []}
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
                      rules={kexing ? [{ required: true }] : []}
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
                      rules={kexing ? [{ required: true }] : []}
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
                      rules={kexing ? [{ required: true }] : []}
                    >
                      <Input placeholder="请输入原因" />
                    </Form.Item>
                  )
                }
              </Form.Item>

              <Form.Item label="其他" name="other">
                <TextArea placeholder="请输入其他内容" />
              </Form.Item>

              <CommonEditTable
                dataSource={sopData}
                setTbData={setSopData}
                columnsItems={sop_columnsItems}
                name="SOP文件影响"
              />
              <CommonEditTable
                dataSource={sipData}
                setTbData={setSipData}
                columnsItems={sip_columnsItems}
                name="SIP文件影响"
              />
              <Flex justify="end">
                <Button type="primary" onClick={postFeasibilityAssessment}>
                  提交
                </Button>
              </Flex>
            </Flex>
          </Form>
        </Spin>
      </Card>
    </Flex>
  );
};

export default KeXingXing;
