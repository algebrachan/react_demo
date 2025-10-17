import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Input,
  Radio,
  Checkbox,
  Spin,
  Modal,
  message,
  Row,
  Col,
  DatePicker,
  AutoComplete,
} from "antd";
import { Flex } from "antd";
import { CommonEditTable, ComputeFormCol } from "../../../../../utils/obj";
import { selectList2Option, timeFormat } from "../../../../../utils/string";
import { qmsPostChanges } from "@/apis/qms_router";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
const { TextArea } = Input;

const ShenQingModal = ({ open, onCancel, requestData }) => {
  const { user_list } = useSelector((state) => state.mng.qms);
  const [form] = Form.useForm();
  const default_form_data = {
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
  const columnsItems = [
    { name: "产品名称", type: "input" },
    { name: "产品规格", type: "input" },
    { name: "顾客", type: "input" },
    { name: "备注", type: "text_area" },
  ];
  const [tb_data, setTbData] = useState([]);
  const [load, setLoad] = useState(false);
  const handleOk = async () => {
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
    setLoad(true);
    qmsPostChanges(
      {
        ...default_form_data,
        ...values,
        bodyData: tb_data,
      },
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("申请成功");
          requestData();
          onCancel();
        } else {
          message.error(msg);
        }
      },
      () => {
        setLoad(false);
        message.error("申请失败");
      }
    );
  };
  useEffect(() => {
    if (open) {
      form.resetFields();
      setTbData([]);
    }
  }, [open]);

  return (
    <Modal
      title="发起变更申请"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      width={1600}
    >
      <Spin spinning={load}>
        <Row gutter={[20, 20]}>
          <Col span={12}>
            <Form
              form={form}
              {...ComputeFormCol(4)}
              initialValues={default_form_data}
            >
              <Flex vertical gap={16}>
                <Form.Item label="变更单号" name="number">
                  <Input placeholder="提交时自动申请" disabled />
                </Form.Item>
                <Form.Item
                  label="变更主题"
                  name="theme"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="变更类型"
                  name="changeType"
                  rules={[{ required: true }]}
                >
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
                <Form.Item
                  label="变更类别"
                  name="changeCategory"
                  rules={[{ required: true }]}
                >
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
                <Form.Item
                  label="变更级别"
                  name="level"
                  rules={[{ required: true }]}
                >
                  <Radio.Group
                    options={selectList2Option(["A", "B", "C", "D", "E"])}
                  />
                </Form.Item>
                <Form.Item
                  label="提出单位"
                  name="proposeUnit"
                  rules={[{ required: true }]}
                >
                  <Radio.Group
                    options={selectList2Option(["内部", "二级供应商", "顾客"])}
                  />
                </Form.Item>
                <Form.Item
                  label="变更导入要求"
                  name="changeImportRequirements"
                  rules={[{ required: true }]}
                >
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
                <Form.Item
                  label="变更原因"
                  name="reasonForChange"
                  rules={[{ required: true }]}
                >
                  <TextArea />
                </Form.Item>
                <Form.Item
                  label="变更前内容描述"
                  name="descriptionOfChangeContentsBefore"
                  rules={[{ required: true }]}
                >
                  <TextArea />
                </Form.Item>
                <Form.Item
                  label="变更后内容描述"
                  name="descriptionOfChangeContentsAfter"
                  rules={[{ required: true }]}
                >
                  <TextArea />
                </Form.Item>
                <Form.Item
                  label="申请人"
                  name="applicantDate"
                  rules={[{ required: true }]}
                >
                  <AutoComplete options={selectList2Option(user_list)} />
                </Form.Item>
              </Flex>
            </Form>
          </Col>
          <Col span={12}>
            <CommonEditTable
              name="产品"
              dataSource={tb_data}
              setTbData={setTbData}
              columnsItems={columnsItems}
            />
          </Col>
        </Row>
      </Spin>
    </Modal>
  );
};

export default ShenQingModal;
