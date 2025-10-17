import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Input,
  Radio,
  Checkbox,
  Button,
  Space,
  message,
  Row,
  Col,
} from "antd";
import { Flex } from "antd";
import { ComputeFormCol } from "../../../../../utils/obj";
import { selectList2Option, timeFormat } from "../../../../../utils/string";
import {
  qmsGetChanges,
  qmsPostChanges,
  qmsPutChanges,
} from "../../../../../apis/qms_router";
import { EditTable } from "../Common";
import { Spin } from "antd";
import dayjs from "dayjs";
import { DatePicker } from "antd";

const { TextArea } = Input;

const BianGengShenqing = ({ activeKey, setActiveKey }) => {
  const default_query_form = {
    number: "",
    theme: "",
    changeType: [],
    level: "",
    changeCategory: "",
    changeTimeRange: [],
    proposeUnit: "",
    changeImportRequirements: [],
    importTime: "",
    reasonForChange: "",
    descriptionOfChangeContentsBefore: "",
    descriptionOfChangeContentsAfter: "",
    applicantDate: "",
    approvalByDepartmentHead: "",
  };
  const [form] = Form.useForm();
  const [tb_data, setTbData] = useState([]);
  const [load, setLoad] = useState(false);
  const getChange = async () => {
    const { number } = await form.validateFields();
    if (!number) return;
    setLoad(true);
    qmsGetChanges(
      { number },
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 200 && data) {
          // message.success(msg);
          const { bodyData = [] } = data;
          form.setFieldsValue({ ...default_query_form, ...data, number });
          setTbData(
            bodyData.map((item, index) => ({ ...item, key: index + 1 }))
          );
        } else {
          form.setFieldsValue({ ...default_query_form, number });
          setTbData([]);
        }
      },
      () => {
        setLoad(false);
        form.setFieldsValue({ ...default_query_form, number });
        setTbData([]);
        message.error("查询失败");
      }
    );
  };

  const putChange = async () => {
    const values = await form.validateFields();
    const { number } = values;
    if (!number) {
      message.error("没有变更单号，无法修改数据！");
      return;
    }
    qmsPutChanges(
      {
        ...default_query_form,
        ...values,
        bodyData: tb_data,
      },
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
  const postChange = async () => {
    const values = await form.validateFields();
    qmsPostChanges(
      {
        ...default_query_form,
        ...values,
        bodyData: tb_data,
      },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 200) {
          const { number } = data;
          form.setFieldsValue({ number });
          setActiveKey(number);
          message.success("申请成功");
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("申请失败");
      }
    );
  };

  useEffect(() => {
    form.setFieldsValue({ number: activeKey });
  }, [activeKey]);
  return (
    <Spin spinning={load}>
      <Row gutter={[20, 20]}>
        <Col span={12}>
          <Form
            form={form}
            {...ComputeFormCol(4)}
            initialValues={default_query_form}
          >
            <Flex vertical gap={16}>
              <Form.Item label="变更单号" name="number">
                <Input placeholder="提交时自动申请" disabled />
              </Form.Item>
              <Form.Item label="变更主题" name="theme">
                <Input />
              </Form.Item>
              <Form.Item label="变更类型" name="changeType">
                <Checkbox.Group
                  options={selectList2Option([
                    "原材料",
                    "供应商",
                    "生产场所",
                    "工艺",
                    "生产设备、工具",
                    "检测设备",
                    "检测方法",
                    "包装",
                    "运输方式",
                    "其他",
                  ])}
                />
              </Form.Item>
              <Form.Item label="变更类别" name="changeCategory">
                <Radio.Group
                  options={selectList2Option(["永久性", "临时性"])}
                />
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prev, current) =>
                  prev.changeCategory !== current.changeCategory
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue("changeCategory") === "临时性" && (
                    <Form.Item
                      label="变更时间区间"
                      name="changeTimeRange"
                      rules={[{ required: true }]}
                      getValueProps={(value) => {
                        return {
                          value: value && value.map((e) => dayjs(e)),
                        };
                      }}
                      normalize={(value) =>
                        value && value.map((e) => dayjs(e).format(timeFormat))
                      }
                    >
                      <DatePicker.RangePicker
                        showTime
                        format={timeFormat}
                        style={{ width: 330 }}
                        placeholder={["开始时间", "结束时间"]}
                      />
                    </Form.Item>
                  )
                }
              </Form.Item>
              <Form.Item label="变更级别" name="level">
                <Radio.Group
                  options={selectList2Option(["A", "B", "C", "D", "E"])}
                />
              </Form.Item>
              <Form.Item label="提出单位" name="proposeUnit">
                <Radio.Group
                  options={selectList2Option(["内部", "二级供应商", "顾客"])}
                />
              </Form.Item>
              <Form.Item label="变更导入要求" name="changeImportRequirements">
                <Checkbox.Group
                  options={selectList2Option([
                    "立即导入",
                    "自然切换",
                    "按日期切换",
                    "其他",
                  ])}
                />
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prev, current) =>
                  prev.changeImportRequirements !==
                  current.changeImportRequirements
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue("changeImportRequirements").includes(
                    "按日期切换"
                  ) && (
                    <Form.Item
                      label="导入时间"
                      name="importTime"
                      rules={[{ required: true }]}
                      getValueProps={(value) => {
                        return {
                          value: value && dayjs(value),
                        };
                      }}
                      normalize={(value) =>
                        value && dayjs(value).format(timeFormat)
                      }
                    >
                      <DatePicker
                        showTime
                        format={timeFormat}
                        style={{ width: 330 }}
                      />
                    </Form.Item>
                  )
                }
              </Form.Item>
              <Form.Item label="变更原因" name="reasonForChange">
                <TextArea />
              </Form.Item>
              <Form.Item
                label="变更前内容描述"
                name="descriptionOfChangeContentsBefore"
              >
                <TextArea />
              </Form.Item>
              <Form.Item
                label="变更后内容描述"
                name="descriptionOfChangeContentsAfter"
              >
                <TextArea />
              </Form.Item>
              <Form.Item label="申请人" name="applicantDate">
                <Input />
              </Form.Item>

              <Form.Item label="部门主管批准" name="approvalByDepartmentHead">
                <Input />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
                <Space size={20}>
                  <Button type="primary" onClick={getChange}>
                    查询
                  </Button>
                  <Button onClick={putChange}>修改</Button>
                  <Button
                    onClick={() => {
                      form.resetFields();
                      setActiveKey("");
                    }}
                  >
                    重置
                  </Button>
                  <Button type="primary" onClick={postChange}>
                    提交变更
                  </Button>
                </Space>
              </Form.Item>
            </Flex>
          </Form>
        </Col>
        <Col span={12}>
          <EditTable
            add_name="添加产品"
            dataSource={tb_data}
            columns_text={["产品名称", "产品规格", "顾客", "备注"]}
            setTbData={setTbData}
          />
        </Col>
      </Row>
    </Spin>
  );
};

export default BianGengShenqing;
