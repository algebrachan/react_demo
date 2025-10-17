import {
  AutoComplete,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
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
import { postAxisRange, putAxisRange } from "../../../../../apis/fdc_api";

export const EditAxisModal = ({
  open = false,
  data = {},
  query_opt = {},
  onCancel,
  requestData,
}) => {
  const default_form_data = {
    工序: "",
    参数: "",
    上限: 0,
    下限: 0,
  };
  const [form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const handleOk = async () => {
    let val = await form.validateFields();
    setLoad(true);
    if (data["name"] === "新增") {
      postAxisRange(
        val,
        (res) => {
          setLoad(false);
          const { code, msg } = res.data;
          if (code === 200) {
            message.success("新增成功");
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
      putAxisRange(
        val,
        (res) => {
          setLoad(false);
          const { code, msg } = res.data;
          if (code === 200) {
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
      title={`${data["name"]}坐标轴`}
      open={open}
      onCancel={onCancel}
      getContainer={false}
      destroyOnHidden={true}
      onOk={handleOk}
      width={570}
    >
      <Spin spinning={load}>
        <Form
          form={form}
          initialValues={default_form_data}
          {...ComputeFormCol(6)}
          style={{ marginTop: 20 }}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label="工序" name="工序" rules={[{ required: true }]}>
                <Select
                  placeholder="请选择"
                  options={selectList2Option(query_opt["工序"])}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="参数" name="参数" rules={[{ required: true }]}>
                <Select
                  placeholder="请选择"
                  options={selectList2Option(query_opt["参数"])}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="上限" name="上限" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="下限" name="下限" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};
