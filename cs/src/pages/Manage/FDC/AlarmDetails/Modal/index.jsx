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
  Spin,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { ComputeFormCol } from "../../../../../utils/obj";
import { dateFormat, selectList2Option } from "../../../../../utils/string";
import dayjs from "dayjs";
import { dealAlarmData } from "../../../../../apis/fdc_api";
const { TextArea } = Input;

export const ExamineModal = ({
  open = false,
  data = {},
  onCancel,
  requestData,
}) => {
  const default_form_data = {
    故障原因描述: "",
    处理措施描述: "",
    提交人: "",
  };
  const [form] = Form.useForm();
  const [form_load, setFormLoad] = useState(false);
  const handleOk = async () => {
    let val = await form.validateFields();
    val["id"] = data["id"];
    setFormLoad(true);
    dealAlarmData(
      val,
      (res) => {
        setFormLoad(false);
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("提交成功");
          onCancel();
          requestData();
        } else {
          message.error(msg);
        }
      },
      () => {
        setFormLoad(false);
        message.error("提交失败");
      }
    );
  };
  useEffect(() => {
    if (open) {
      form.setFieldsValue(data);
    }
  }, [open]);
  return (
    <Modal
      title="处理报警信息"
      open={open}
      onOk={handleOk}
      okText="确认"
      onCancel={onCancel}
      destroyOnHidden={true}
      width={640}
    >
      <Form
        initialValues={default_form_data}
        {...ComputeFormCol(6)}
        form={form}
      >
        <Spin spinning={form_load}>
          <Flex vertical gap={20}>
            {["故障原因描述", "处理措施描述", "提交人"].map((e) => (
              <Form.Item
                label={e}
                name={e}
                key={e}
                {...ComputeFormCol(5)}
                rules={[{ required: true }]}
              >
                <TextArea autoSize placeholder="请输入" />
              </Form.Item>
            ))}
          </Flex>
        </Spin>
      </Form>
    </Modal>
  );
};
