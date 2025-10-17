import React, {useState, useEffect} from "react";
import {
  Form,
  Input,
  Radio,
  Checkbox,
  Button,
  Table,
  Space,
  message,
  DatePicker,
  Row,
  Col,
} from "antd";
import {Flex} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {ComputeFormCol} from "../../../../../utils/obj";
import {selectList2Option} from "../../../../../utils/string";
import {
  getChangePlanTracking,
  postChangePlanTracking,
} from "../../../../../apis/qms_router";
import {EditTable} from "./component/EditTable.jsx";
import dayjs from 'dayjs';
import {getParams, postJson} from '../../../../../apis/instance.jsx'

const {TextArea} = Input;
const ChangeTracking = ({activeKey}) => {
  const [form] = Form.useForm();
  const [techTableData, setTechTableData] = useState(
    ['产品规格书', '过程流程图', 'PFMEA', '特殊特性清单', '控制计划'].map(i => ({
      project: i,
      key: i,
      plan_finish_time: '',
      charge_person: '',
      completion_progress: '',
      confirm_results: '',
      confirm_person: ''
    }))
  );
  const [sopTableData, setSopTableData] = useState([])
  const [sipTableData, setSipTableData] = useState([])
  const [inventoryProduct, setInventoryProduct] = useState([])
  const [productCost, setProductCost] = useState(
    ['产品成本核算', '客户承担变更费用落实'].map(i => ({
      project: i,
      key: i,
      plan_finish_time: '',
      charge_person: '',
      completion_progress: '',
      confirm_results: '',
      confirm_person: ''
    }))
  );
  const [equipmentAcceptance, setEquipmentAcceptance] = useState([])
  const [facilityAcceptance, setFacilityAcceptance] = useState([])
  const [fixtureAcceptance, setFixtureAcceptance] = useState([]);
  const [inspectionToolAcceptance, setInspectionToolAcceptance] = useState([]);
  const [other, setOther] = useState([]);
  const [changeProduct, setChangeProduct] = useState([])
  const commonColumns = [
    {title: "项目", dataIndex: 'project'},
    {title: "计划完成时间", dataIndex: 'plan_finish_time', type: 'DatePicker'},
    {title: "负责人", dataIndex: 'charge_person'},
    {title: "完成进度", dataIndex: 'completion_progress'},
    {title: "确认结果", dataIndex: 'confirm_results'},
    {title: "确认人", dataIndex: 'confirm_person'},
  ]
  const huiqianDept = [
    "研发技术部",
    "制造部",
    "运营部",
    "质量管理部",
    "人力资源部",
    "财务部",
    "信息部",
    "项目开发部",
    "销售部",
    "采购部",
    "设备动力科",
    "综合办",
    "安环部",
    "PMC",
    "原料合成车间",
    "坩埚车间",
    "长晶生产车间",
  ]
  const getChange = async () => {
    const {number} = await form.validateFields();
    getChangePlanTracking(
      {number},
      (res) => {
        const {code, msg, data} = res.data;
        if (code === 200 && data) {
          message.success("查询成功");
          const {
            changeHuiqian,
            technical_documents,
            SOP_working_instruction,
            SIP_working_instruction,
            inventory_product,
            product_cost,
            equipment_acceptance,
            facility_acceptance,
            fixture_acceptance,
            inspection_tool_acceptance,
            other,
            change_product,
            ...rest
          } = data;
          setHuiqianData(huiqianDept.map(i => ({dept: i, key: i, value: changeHuiqian[i]})));
          setTechTableData(technical_documents.map(i => ({...i, key: i.project})));
          setSopTableData(SOP_working_instruction.map(i => ({...i, key: i.project})));
          setSipTableData(SIP_working_instruction.map(i => ({...i, key: i.project})));
          setInventoryProduct(inventory_product.map(i => ({...i, key: i.project})));
          setProductCost(product_cost.map(i => ({...i, key: i.project})));
          setEquipmentAcceptance(equipment_acceptance.map(i => ({...i, key: i.project})));
          setFacilityAcceptance(facility_acceptance.map(i => ({...i, key: i.project})));
          setFixtureAcceptance(fixture_acceptance.map(i => ({...i, key: i.project})));
          setInspectionToolAcceptance(inspection_tool_acceptance.map(i => ({...i, key: i.project})));
          setOther(other.map(i => ({...i, key: i.project})));
          setChangeProduct(change_product.map(i => ({...i, key: i.product_time})));
          form.setFieldsValue(rest);
        } else {
          message.error("没有数据");
        }
      },
      () => {
        message.error("查询失败");
      }
    );
  };
  const postChange = async () => {
    const values = await form.validateFields();
    const changeHuiqian = huiqianData.filter(i => i.value).reduce((acc, cur) => {
      acc[cur['dept']] = cur['value']
      return acc
    }, {})
    postChangePlanTracking(
      {
        ...values,
        changeHuiqian,
        technical_documents: techTableData,
        SOP_working_instruction: sopTableData,
        SIP_working_instruction: sipTableData,
        inventory_product: inventoryProduct,
        product_cost: productCost,
        equipment_acceptance: equipmentAcceptance,
        facility_acceptance: facilityAcceptance,
        fixture_acceptance: fixtureAcceptance,
        inspection_tool_acceptance: inspectionToolAcceptance,
        other: other,
        change_product: changeProduct
      },
      (res) => {
        const {code, msg, data} = res.data;
        if (code === 200) {
          message.success("提交成功");
        } else {
          message.error(msg);
        }
      },
      (e) => {
        message.error("提交失败");
      }
    );
  };
  const [huiqianData, setHuiqianData] = useState(huiqianDept.map(i => ({dept: i, key: i, value: ''})))
  useEffect(() => {
    form.setFieldsValue({number: activeKey});
  }, [activeKey]);
  return (
    <Row gutter={[20, 20]}>
      <Col span={10}>
        <Form
          form={form}
          {...ComputeFormCol(4)}
          initialValues={{
            number: '',
            version: '',
            product_name: '',
            charge_charge_person: '',
            change_notice_number: '',
            conclusion: '',
            conclusion_reason: '',
            QM_review: '',
            TDGM_review: ''
          }}
        >
          <Flex vertical gap={16}>
            <Form.Item label="编号" name="number" rules={[{required: true}]}>
              <Input />
            </Form.Item>
            <Form.Item label="版本号" name="version">
              <Input />
            </Form.Item>
            <Form.Item label="产品名称/规格" name="product_name">
              <Input />
            </Form.Item>
            <Form.Item label="变更负责人" name="charge_charge_person">
              <Input />
            </Form.Item>
            <Form.Item label="变更通知单号" name="change_notice_number">
              <Input />
            </Form.Item>
            <Form.Item label="结论" name="conclusion">
              <Radio.Group
                options={selectList2Option([
                  "通过",
                  "不通过"
                ])}
              />
            </Form.Item>
            <Form.Item label="存在问题" name="conclusion_reason">
              <Input.TextArea />
            </Form.Item>
            <Form.Item label="相关部门会签">
              <EditTable
                isOperate={false}
                dataSource={huiqianData}
                columns_text={[{title: '部门', dataIndex: 'dept', disabled: true}, {title: '签名', dataIndex: 'value'}]}
                setTbData={setHuiqianData} />
            </Form.Item>
            <Form.Item
              getValueProps={value => ({value: value && dayjs(value)})}
              normalize={value => value && dayjs(value).format('YYYY-MM-DD')}
              label="质量部长审核日期"
              name="QM_review">
              <DatePicker />
            </Form.Item>
            <Form.Item
              getValueProps={value => ({value: value && dayjs(value)})}
              normalize={value => value && dayjs(value).format('YYYY-MM-DD')}
              label="技术副总批准日期"
              name="TDGM_review">
              <DatePicker />
            </Form.Item>
            <Form.Item wrapperCol={{offset: 4, span: 20}}>
              <Space size={20}>
                <Button type="primary" onClick={getChange}>
                  查询
                </Button>
                <Button onClick={postChange}>提交</Button>
              </Space>
            </Form.Item>
          </Flex>
        </Form>
      </Col>
      <Col span={14}>
        <div style={{border: `1px solid #dcdcdc`, padding: 8, marginBottom: 8}}>
          <div style={{marginBottom: 8}}>技术文件/作业标准:</div>
          <EditTable
            isOperate={false}
            dataSource={techTableData}
            columns_text={commonColumns.map(item => {
              const newItem = {...item}
              const {dataIndex} = newItem
              if (dataIndex === 'project') newItem.disabled = true
              return newItem
            })}
            setTbData={setTechTableData}
          />
        </div>
        <div style={{border: `1px solid #dcdcdc`, padding: 8, marginBottom: 8}}>
          <div style={{marginBottom: 8}}>SOP作业指导书:</div>
          <EditTable
            dataSource={sopTableData}
            columns_text={[...commonColumns]}
            setTbData={setSopTableData}
          />
        </div>
        <div style={{border: `1px solid #dcdcdc`, padding: 8, marginBottom: 8}}>
          <div style={{marginBottom: 8}}>SIP作业指导书:</div>
          <EditTable
            dataSource={sipTableData}
            columns_text={[...commonColumns]}
            setTbData={setSipTableData}
          />
        </div>
        <div style={{border: `1px solid #dcdcdc`, padding: 8, marginBottom: 8}}>
          <div style={{marginBottom: 8}}>库存产品处理:</div>
          <EditTable
            dataSource={inventoryProduct}
            columns_text={[...commonColumns]}
            setTbData={setInventoryProduct}
          />
        </div>
        <div style={{border: `1px solid #dcdcdc`, padding: 8, marginBottom: 8}}>
          <div style={{marginBottom: 8}}>产品成本及变更费用:</div>
          <EditTable
            isOperate={false}
            dataSource={productCost}
            columns_text={commonColumns.map(item => {
              const newItem = {...item}
              const {dataIndex} = newItem
              if (dataIndex === 'project') newItem.disabled = true
              return newItem
            })}
            setTbData={setProductCost}
          />
        </div>
        <div style={{border: `1px solid #dcdcdc`, padding: 8, marginBottom: 8}}>
          <div style={{marginBottom: 8}}>设备验收:</div>
          <EditTable
            dataSource={equipmentAcceptance}
            columns_text={[...commonColumns]}
            setTbData={setEquipmentAcceptance}
          />
        </div>
        <div style={{border: `1px solid #dcdcdc`, padding: 8, marginBottom: 8}}>
          <div style={{marginBottom: 8}}>设施验收:</div>
          <EditTable
            dataSource={facilityAcceptance}
            columns_text={[...commonColumns]}
            setTbData={setFacilityAcceptance}
          />
        </div>
        <div style={{border: `1px solid #dcdcdc`, padding: 8, marginBottom: 8}}>
          <div style={{marginBottom: 8}}>工装验收:</div>
          <EditTable
            dataSource={fixtureAcceptance}
            columns_text={[...commonColumns]}
            setTbData={setFixtureAcceptance}
          />
        </div>
        <div style={{border: `1px solid #dcdcdc`, padding: 8, marginBottom: 8}}>
          <div style={{marginBottom: 8}}>检具验收:</div>
          <EditTable
            dataSource={inspectionToolAcceptance}
            columns_text={[...commonColumns]}
            setTbData={setInspectionToolAcceptance}
          />
        </div>
        <div style={{border: `1px solid #dcdcdc`, padding: 8, marginBottom: 8}}>
          <div style={{marginBottom: 8}}>其他:</div>
          <EditTable
            dataSource={other}
            columns_text={[...commonColumns]}
            setTbData={setOther}
          />
        </div>
        <div style={{border: `1px solid #dcdcdc`, padding: 8, marginBottom: 8}}>
          <div style={{marginBottom: 8}}>变更品前三批次:</div>
          <EditTable
            dataSource={changeProduct}
            columns_text={[
              {title: "生产时间/生产批次", dataIndex: 'product_time'},
              {title: "发货时间", dataIndex: 'delivery_time', type: 'DatePicker'},
              {title: "顾客端质量反馈", dataIndex: 'customer_quality_feedback'},
              {title: "确认人", dataIndex: 'confirm_person'}
            ]}
            setTbData={setChangeProduct}
          />
        </div>
      </Col>
    </Row>
  );
};
export default ChangeTracking;
