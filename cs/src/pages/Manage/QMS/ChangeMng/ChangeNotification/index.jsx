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
  getChangeNotification,
  postChangeNotification,
} from "../../../../../apis/qms_router";
import {EditTable} from "../Common";
import dayjs from 'dayjs';

const {TextArea} = Input;
const ChangeNotification = ({activeKey}) => {
  const [form] = Form.useForm();
  const [tb_data, setTbData] = useState([]);
  const changeCategory = Form.useWatch('change_category', form)
  const proposeUnit = Form.useWatch('propose_unit', form)
  const changeImportRequirements = Form.useWatch('change_import_requirements', form)
  const getChange = async () => {
    const {number} = await form.validateFields();
    getChangeNotification(
      {number},
      (res) => {
        const {code, msg, data} = res.data;
        if (code === 200 && data) {
          message.success("查询成功");
          const {change_content = []} = data;
          form.setFieldsValue(data);
          setTbData(
            change_content.map((item, index) => ({...item, key: index + 1}))
          );
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
    postChangeNotification(
      {
        ...values,
        change_content: tb_data,
      },
      (res) => {
        const {code, msg, data} = res.data;
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
    form.setFieldsValue({number: activeKey});
  }, [activeKey]);
  useEffect(() => {
    if (changeCategory !== '临时性') form.setFieldsValue({start_change_time: '', end_change_time: ''});
  }, [changeCategory]);
  useEffect(() => {
    if (proposeUnit !== '顾客') form.setFieldsValue({change_number: ''});
  }, [proposeUnit]);
  useEffect(() => {
    if (changeImportRequirements !== '按日期切换') form.setFieldsValue({switch_date: ''});
  }, [changeImportRequirements]);
  return (
    <Row gutter={[20, 20]}>
      <Col span={12}>
        <Form
          form={form}
          {...ComputeFormCol(4)}
          initialValues={{
            number: '',
            version: '',
            change_category: '',
            start_change_time: '',
            end_change_time: '',
            change_order_number: '',
            propose_unit: '',
            change_number: '',
            project_phase: '',
            involving_customer_names: '',
            product_name_specification: '',
            change_import_requirements: '',
            switch_date: '',
            distribution_department: [],
            compilation_date: '',
            QDH_review_data: '',
            TM_review_data: ''
          }}
        >
          <Flex vertical gap={16}>
            <Form.Item label="编号" name="number" rules={[{required: true}]}>
              <Input />
            </Form.Item>
            <Form.Item label="版本号" name="version">
              <Input />
            </Form.Item>
            <Form.Item label="变更类别" name="change_category">
              <Radio.Group options={selectList2Option(["永久性", "临时性"])} />
            </Form.Item>
            <Form.Item
              getValueProps={value => ({value: value && dayjs(value)})}
              normalize={value => value && dayjs(value).format('YYYY-MM-DD HH:mm:ss')}
              label="变更开始时间"
              name="start_change_time">
              <DatePicker showTime disabled={changeCategory !== '临时性'} />
            </Form.Item>
            <Form.Item
              getValueProps={value => ({value: value && dayjs(value)})}
              normalize={value => value && dayjs(value).format('YYYY-MM-DD HH:mm:ss')}
              label="变更结束时间"
              name="end_change_time">
              <DatePicker showTime disabled={changeCategory !== '临时性'} />
            </Form.Item>
            <Form.Item label="变更单号" name="change_order_number">
              <Input />
            </Form.Item>
            <Form.Item label="提出单位" name="propose_unit">
              <Radio.Group
                options={selectList2Option(["内部", "二级供应商", "顾客"])}
              />
            </Form.Item>
            <Form.Item label="更改号" name="change_number">
              <Input disabled={proposeUnit !== '顾客'} />
            </Form.Item>
            <Form.Item label="项目阶段" name="project_phase">
              <Input />
            </Form.Item>
            <Form.Item label="涉及顾客名称" name="involving_customer_names">
              <Input />
            </Form.Item>
            <Form.Item label="产品名称/规格" name="product_name_specification">
              <Input />
            </Form.Item>
            <Form.Item label="变更导入要求" name="change_import_requirements">
              <Radio.Group
                options={selectList2Option([
                  "立即导入",
                  "自然切换",
                  "按日期切换",
                  "其他",
                ])}
              />
            </Form.Item>
            <Form.Item
              getValueProps={value => ({value: value && dayjs(value)})}
              normalize={value => value && dayjs(value).format('YYYY-MM-DD')}
              label="切换日期"
              name="switch_date">
              <DatePicker disabled={changeImportRequirements !== '按日期切换'} />
            </Form.Item>
            <Form.Item label="分发部门" name="distribution_department">
              <Checkbox.Group
                options={selectList2Option([
                  "研发技术部",
                  "制造部",
                  "计划部",
                  "坩埚车间",
                  "质量管理部",
                  "人力资源部",
                  "财务部",
                  "信息部",
                  "项目开发部",
                  "销售部",
                  "采购部",
                  "PMC",
                  "设备动力科",
                  "园区行政办公室",
                  "安环部",
                  "长晶生产车间",
                  "原料合成车间"
                ])}
              />
            </Form.Item>
            <Form.Item
              getValueProps={value => ({value: value && dayjs(value)})}
              normalize={value => value && dayjs(value).format('YYYY-MM-DD')}
              label="编制日期"
              name="compilation_date">
              <DatePicker />
            </Form.Item>
            <Form.Item
              getValueProps={value => ({value: value && dayjs(value)})}
              normalize={value => value && dayjs(value).format('YYYY-MM-DD')}
              label="质量部长审核日期"
              name="QDH_review_data">
              <DatePicker />
            </Form.Item>
            <Form.Item
              getValueProps={value => ({value: value && dayjs(value)})}
              normalize={value => value && dayjs(value).format('YYYY-MM-DD')}
              label="技术部长批准日期"
              name="TM_review_data">
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
      <Col span={12}>
        <EditTable
          add_name="添加变更内容"
          dataSource={tb_data}
          columns_text={[{title: "变更前内容", dataIndex: 'pre_change_content'}, {title: "变更后内容", dataIndex: 'change_content'}]}
          setTbData={setTbData}
        />
      </Col>
    </Row>
  );
};
export default ChangeNotification;
