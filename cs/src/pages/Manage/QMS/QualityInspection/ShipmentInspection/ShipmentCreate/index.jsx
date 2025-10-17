import React, { useState } from "react";
import { CustomizeEditTable, GenerateFormItem } from "../Common";
import { Col, Form, Row, Flex, Button, Space, message, Spin } from "antd";
import { ComputeFormCol } from "@/utils/obj";
import { qmsCreateShipTasks, qmsShipOptions } from "@/apis/qms_router";
import { useEffect } from "react";

function ShipmentCreate() {
  const [tb_data, setTbData] = useState([]);
  const [form] = Form.useForm();
  const [form_load, setFormLoad] = useState(false);
  const default_form_data = {
    报检单号: "",
    客户: "",
    产品类型: "",
    责任人: "",
  };
  const columnItems = [
    { name: "产品", type: "input" },
    { name: "物料名称", type: "input" },
    { name: "物料编码", type: "input" },
    { name: "发货数量", type: "input_number" },
    { name: "发货日期", type: "date" },
  ];
  const formItems = [
    {
      label: "报检单号",
      name: "报检单号",
      type: "input",
      disabled: true,
      placeholder: "自动生成",
    },
    {
      label: "客户",
      name: "客户",
      type: "auto_complete",
      required: true,
      opt: [],
    },
    {
      label: "产品类型",
      name: "产品类型",
      type: "auto_complete",
      required: true,
      opt: [],
    },
    {
      label: "责任人",
      name: "责任人",
      type: "input",
      required: true,
    },
  ];
  const initOpt = () => {
    qmsShipOptions(
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0) {
          formItems[1].opt = data["客户"];
          formItems[2].opt = data["产品类型"];
        } else {
          message.error(msg);
        }
      },
      () => {}
    );
  };
  const submit = async () => {
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
    setFormLoad(true);
    values["items"] = tb_data.map(({ key, ...rest }) => rest);
    qmsCreateShipTasks(
      values,
      (res) => {
        setFormLoad(false);
        const { code, data, msg } = res.data;
        if (code === 0) {
          const { 报检单号 } = data;
          form.setFieldsValue({ 报检单号 });
          message.success("创建成功");
        } else {
          message.error(msg);
        }
      },
      () => {
        setFormLoad(false);
        message.error("网络错误");
      }
    );
  };
  useEffect(() => {
    initOpt();
  }, []);
  return (
    <Spin spinning={form_load}>
      <Flex vertical gap={16}>
        <Form
          form={form}
          {...ComputeFormCol(6)}
          initialValues={default_form_data}
        >
          <Row gutter={[16, 16]}>
            {formItems.map((item) => (
              <Col span={4} key={item.name}>
                <GenerateFormItem item={item} />
              </Col>
            ))}
            <Col span={4}>
              <Space>
                <Button
                  onClick={() => {
                    form.resetFields();
                    setTbData([]);
                  }}
                >
                  重置
                </Button>
                <Button type="primary" onClick={submit}>
                  提交
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
        <CustomizeEditTable
          columns_list={columnItems}
          setTbData={setTbData}
          dataSource={tb_data}
        />
      </Flex>
    </Spin>
  );
}

export default ShipmentCreate;
