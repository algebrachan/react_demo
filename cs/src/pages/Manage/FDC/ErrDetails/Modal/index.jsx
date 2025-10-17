import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  message,
} from "antd";
import React, { useEffect } from "react";
import { ComputeFormCol } from "../../../../../utils/obj";
import { dateFormat, selectList2Option } from "../../../../../utils/string";
import dayjs from "dayjs";
const { TextArea } = Input;

export const ExamineModal = ({
  open = false,
  data = {},
  onCancel,
  requestData,
}) => {
  const default_form_data = {
    日期: "",
    图号: "",
    批号: "",
    特征: "",
    机台: "",
    判异规则: "",
    异常现象: "",
    异常原因: "",
    异常对策: "",
    责任部门: [],
    紧急程度: "",
    期限: "",
    审批人: "",
    邮箱上报: "",
    email: false,
  };
  const [form] = Form.useForm();
  const handleOk = async () => {
    let val = await form.validateFields();
    val["id"] = data["id"];
  };
  const reject = () => {
    const { 审批人 } = form.getFieldsValue();
    if (审批人 === "") {
      message.warning("请输入审批人");
      return;
    }
    let val = {
      审批人,
      id: data["id"],
    };
  };
  useEffect(() => {
    if (open) {
      console.log(data);
      form.setFieldsValue(data);
    }
  }, [open]);
  return (
    <Modal
      title="异常策略审核"
      open={open}
      onOk={handleOk}
      okText="通过"
      onCancel={onCancel}
      destroyOnHidden={true}
      width={640}
      footer={(_, { OkBtn }) => (
        <Space>
          <Button type="primary" danger onClick={reject}>
            不通过
          </Button>
          <OkBtn />
        </Space>
      )}
    >
      <Form
        initialValues={default_form_data}
        {...ComputeFormCol(6)}
        form={form}
      >
        <Row gutter={[10, 10]}>
          {["日期", "图号", "批号", "特征", "机台", "判异规则"].map((e) => (
            <Col span={12} key={e}>
              <Form.Item label={e} name={e}>
                <Input disabled />
              </Form.Item>
            </Col>
          ))}
          {["异常现象", "异常原因", "异常对策"].map((e) => (
            <Col span={24} key={e}>
              <Form.Item label={e} name={e} {...ComputeFormCol(3)}>
                <TextArea autoSize placeholder="请输入" />
              </Form.Item>
            </Col>
          ))}
          <Col span={24}>
            <Form.Item
              label="责任部门"
              name="责任部门"
              {...ComputeFormCol(3)}
              rules={[{ required: true }]}
            >
              <Checkbox.Group
                options={selectList2Option(["工艺", "设备", "品质", "生产"])}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="紧急程度"
              name="紧急程度"
              rules={[{ required: true }]}
            >
              <Select options={selectList2Option(["紧急", "重要", "一般"])} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="期限"
              name="期限"
              rules={[{ required: true }]}
              getValueProps={(value) => {
                return {
                  value: value && dayjs(value),
                };
              }}
              normalize={(value) => value && dayjs(value).format(dateFormat)}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="审批人"
              name="审批人"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="邮箱上报" {...ComputeFormCol(3)}>
              <Flex justify="space-between">
                <Form.Item
                  name="email"
                  valuePropName="checked"
                  {...ComputeFormCol(0)}
                >
                  <Checkbox></Checkbox>
                </Form.Item>
                <Form.Item name="邮箱上报" noStyle {...ComputeFormCol(0)}>
                  <Input style={{ width: "90%" }} placeholder="请输入邮箱" />
                </Form.Item>
              </Flex>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
