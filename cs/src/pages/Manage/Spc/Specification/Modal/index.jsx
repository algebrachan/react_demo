import {
  Col,
  Form,
  Modal,
  Row,
  Select,
  Spin,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { ComputeFormCol } from "../../../../../utils/obj";
import { selectList2Option } from "../../../../../utils/string";
import { InputNumber } from "antd";
import { createSpec, updateSpec } from "../../../../../apis/anls_router";



export const EditSpecModal = ({
  open = false,
  data = {},
  query_opt = {},
  onCancel,
  requestData,
}) => {
  const default_form_data = {
    工序: "",
    特征: "",
    规格上限: 0,
    规格下限: 0
  };
  const [form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const [craft, setCraft] = useState([]);
  const [feature, setFeature] = useState([])
  const handleOk = async () => {
    let val = await form.validateFields();
    setLoad(true)
    if (data["name"] === "新增") {
      createSpec(
        val,
        (res) => {
          setLoad(false)
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
          setLoad(false)
          message.error("网络错误");
        }
      );
    } else {
      val["id"] = data["record"]["id"];
      updateSpec(
        val,
        (res) => {
          setLoad(false)
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
          setLoad(false)
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
        const { create_params = {} } = query_opt;
        let f = create_params[record["工序"]] || [];
        setFeature(f);
        form.setFieldsValue(record);
      }
    }
  }, [open]);
  useEffect(() => {
    if (Object.keys(query_opt).length > 0) {
      // 设置初始化数据
      const { create_params = {} } = query_opt;
      let c = Object.keys(create_params)
      setCraft(c)
    }
  }, [query_opt])
  return (
    <Modal
      title={`规格${data["name"]}`}
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
          {...ComputeFormCol(8)}
          style={{ marginTop: 20 }}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label="工序" name="工序" rules={[{ required: true }]}>
                <Select options={selectList2Option(craft)}
                  onChange={(val) => {
                    let f = query_opt['create_params'][val]
                    setFeature(f)
                    form.setFieldsValue({
                      特征: f[0]
                    })
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="特征" name="特征" rules={[{ required: true }]}>
                <Select showSearch options={selectList2Option(feature)} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="规格上限" name="规格上限" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="规格下限" name="规格下限" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};
