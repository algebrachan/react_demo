import {
  AutoComplete,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Spin,
  Switch,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { ComputeFormCol } from "../../../../../utils/obj";
import { selectList2Option } from "../../../../../utils/string";
import { createDevice, updateDevice } from "../../../../../apis/fdc_api";
import { getSession } from "../../../../../utils/storage";
import {
  addCtrlSpecification,
  updateCtrlSpecification,
} from "../../../../../apis/spc_api";
import { InputNumber } from "antd";

export const unit_list = [
  "Al",
  "Ca",
  "Cr",
  "Cu",
  "Fe",
  "K",
  "Li",
  "Mg",
  "Mn",
  "Na",
  "Ni",
  "Ti",
  "Zr",
  "P",
  "Ge",
  "Ba",
  "B",
  "AL碱比",
];
export const EditLineModal = ({
  open = false,
  data = {},
  onCancel,
  requestData,
}) => {
  const default_form_data = {
    表名: "",
    石英砂类型: "",
    元素: "",
    内控线: "",
  };
  const [form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const handleOk = async () => {
    let val = await form.validateFields();
    // 判断是否必填
    setLoad(true);
    if (data["name"] === "新增") {
      addCtrlSpecification(
        val,
        (res) => {
          setLoad(false);
          const { code, msg } = res.data;
          if (code === 0) {
            message.success("添加成功");
            onCancel();
            requestData();
          } else {
            message.error(msg);
          }
        },
        () => {
          setLoad(false);
          message.error("网络错误");
        }
      );
    } else {
      val["id"] = data["record"]["id"];
      updateCtrlSpecification(
        val,
        (res) => {
          setLoad(false);
          const { code, msg } = res.data;
          if (code === 0) {
            message.success("修改成功");
            onCancel();
            requestData();
          } else {
            message.error(msg);
          }
        },
        () => {
          setLoad(false);
          message.error("网络错误");
        }
      );
    }
  };
  useEffect(() => {
    if (open) {
      const { name = "新增", record = {} } = data;
      if (name === "新增") {
        form.resetFields();
      } else {
        form.setFieldsValue(record);
      }
    }
  }, [open]);
  return (
    <Modal
      title={`控制线${data["name"]}`}
      open={open}
      onCancel={onCancel}
      getContainer={false}
      destroyOnHidden={true}
      onOk={handleOk}
      width={600}
    >
      <Spin spinning={load}>
        <Form
          form={form}
          initialValues={default_form_data}
          {...ComputeFormCol(8)}
          style={{ marginTop: 20 }}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item name="表名" label="表名" rules={[{ required: true }]}>
                <Select
                  options={selectList2Option(["来料内控表", "受入检查内控表"])}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="石英砂类型"
                label="石英砂类型"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="元素" label="元素" rules={[{ required: true }]}>
                <Select options={selectList2Option(unit_list)} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="内控线"
                label="内控线"
                rules={[{ required: true }]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};
