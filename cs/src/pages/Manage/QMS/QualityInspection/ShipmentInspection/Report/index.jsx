import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Form,
  DatePicker,
  Space,
  Flex,
  message,
  Spin,
  Modal,
} from "antd";
import { ComputeFormCol } from "@/utils/obj";
import { timeFormat } from "@/utils/string";
import dayjs from "dayjs";
import { qmsReadShipReport, qmsCreateShipReport } from "@/apis/qms_router";
import { EditTable } from "../Common";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const Report = () => {
  const [is_submit, setIsSubmit] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const [query_form] = Form.useForm();
  const [form] = Form.useForm();
  const initFormData = {
    instruction_number: "",
    category: "",
    material: [],
    specification: "",
    quantity: "",
    quality_approval: "",
    vapplybillcode: "",
    material_type: "",
    inspection_date: "",
    batch: "",
    inspection_status: "",
    judgment_result: "",
  };
  const [form_load, setFormLoad] = useState(false);
  const [tb_data, setTbData] = useState([]);
  const [tb_head, setTbHead] = useState(["产品编码", "检验结果"]);

  const formItems = [
    {
      label: "检验指导书编号",
      name: "instruction_number",
      required: true,
      disabled: true,
    },
    {
      label: "报检单号",
      name: "vapplybillcode",
      required: true,
      disabled: true,
    },
    // {
    //   label: "物料编码",
    //   name: "materialcode",
    //   required: true,
    // },
    // { label: "产品名称", name: "materialname", required: true },
    { label: "分类", name: "category" },
    { label: "规格", name: "specification", required: true },
    { label: "检测数量", name: "quantity" },
    { label: "物料类型", name: "material_type" },
    { label: "检测人", name: "reviser", required: true },
    {
      label: "检测时间",
      name: "inspection_date",
      type: "date",
      required: true,
    },
    { label: "批次号", name: "batch", required: true },
    { label: "检验状态", name: "inspection_status" },
    { label: "判定结果", name: "judgment_result" },
  ];

  const resetData = () => {
    setIsSubmit(false);
    form.resetFields();
    setTbData([]);
    setTbHead(["产品编码", "检验结果"]);
  };
  const search = () => {
    const { 报检单号 } = query_form.getFieldsValue();
    setFormLoad(true);
    qmsReadShipReport(
      { 报检单号 },
      (res) => {
        setFormLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          const { items = [], IS_OK = false } = data;
          setIsSubmit(IS_OK);
          if (items.length > 0) {
            let header = Object.keys(items[0]);
            setTbHead(header);
          }
          let tb = items.map((item, _) => ({
            key: _,
            ...Object.fromEntries(
              Object.entries(item).map(([k, v]) => [
                k,
                k === "产品编码" ? v : v === "" ? "OK" : v,
              ])
            ),
          }));
          setTbData(tb);
          form.setFieldsValue({
            ...initFormData,
            ...data,
          });
        } else {
          resetData();
          message.error(msg);
        }
      },
      () => {
        setFormLoad(false);
        resetData();
        message.error("查询失败");
      }
    );
  };
  const submit = async () => {
    // 提交逻辑
    let val = await form.validateFields();
    val["items"] = tb_data;
    qmsCreateShipReport(
      val,
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0) {
          message.success(msg);
          // search();
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("提交失败");
      }
    );
  };
  useEffect(() => {}, []);

  return (
    <Flex vertical gap={16}>
      {contextHolder}
      <Form
        layout="inline"
        form={query_form}
        initialValues={{
          报检单号: "",
        }}
      >
        <Space>
          <Form.Item label="报检单号" name="报检单号">
            <Input placeholder="请输入报检单号" />
          </Form.Item>
          <Button type="primary" onClick={search}>
            查询
          </Button>
          <Button
            onClick={() => {
              modal.confirm({
                title: "确认提交",
                content: "确定要提交检验报告吗？",
                onOk: submit,
              });
            }}
            disabled={is_submit}
          >
            提交
          </Button>
        </Space>
      </Form>
      <Spin spinning={form_load}>
        <Card>
          <Form
            form={form}
            initialValues={initFormData}
            {...ComputeFormCol(7)}
            disabled={is_submit}
          >
            <Row gutter={[10, 10]}>
              {formItems.map((item, index) => (
                <Col span={6} key={index}>
                  {item.type === "date" ? (
                    <Form.Item
                      label={item.label}
                      name={item.name}
                      rules={[{ required: item.required }]}
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
                        style={{ width: "100%" }}
                        disabled={item.disabled}
                      />
                    </Form.Item>
                  ) : (
                    <Form.Item
                      label={item.label}
                      name={item.name}
                      rules={[{ required: item.required }]}
                    >
                      <Input disabled={item.disabled} />
                    </Form.Item>
                  )}
                </Col>
              ))}
              <Col span={6}>
                <Form.Item
                  label="产品"
                  name="material"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Form.List name="material">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Row key={key} gutter={8} style={{ marginBottom: 8 }}>
                            <Col span={11}>
                              <Form.Item
                                {...restField}
                                name={[name, "materialcode"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "请输入物料编码",
                                  },
                                ]}
                              >
                                <Input placeholder="物料编码" />
                              </Form.Item>
                            </Col>
                            <Col span={11}>
                              <Form.Item
                                {...restField}
                                name={[name, "materialname"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "请输入物料名称",
                                  },
                                ]}
                              >
                                <Input placeholder="物料名称" />
                              </Form.Item>
                            </Col>
                            <Col span={2}>
                              <Button
                                type="link"
                                danger
                                onClick={() => remove(name)}
                                icon={<DeleteOutlined />}
                              />
                            </Col>
                          </Row>
                        ))}
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          添加
                        </Button>
                      </>
                    )}
                  </Form.List>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Spin>
      <Spin spinning={form_load}>
        <EditTable
          title={() => "检验报告项目"}
          add_name="添加"
          columns_text={tb_head}
          dataSource={tb_data}
          setTbData={setTbData}
          disabled={is_submit}
        />
      </Spin>
    </Flex>
  );
};

export default Report;
