import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { ComputeFormCol } from "../../../../../utils/obj";
import { selectList2Option } from "../../../../../utils/string";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  batchUpdatePointPosition,
  createPointPosition,
  getPointSearch,
  updatePointPosition,
} from "../../../../../apis/fdc_api";

export const ParamModal = ({
  open = false,
  data = {},
  query_opt = {},
  onCancel,
  requestData,
}) => {
  const default_form_data = {
    工厂: "",
    车间: "",
    工序: "",
    设备名: [],
    点位: [{}],
  };
  const [form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const [dev_list, setDevList] = useState([]);
  const initDevice = () => {
    const { 车间 = "", 工序 = "" } = form.getFieldsValue();
    if (车间 && 工序) {
      getPointSearch(
        { 车间, 工序 },
        (res) => {
          const { code, data } = res.data;
          if (code === 200 && data) {
            const { 设备 = [] } = data;
            setDevList(设备);
          } else {
            setDevList([]);
          }
        },
        () => {
          setDevList([]);
        }
      );
    }
  };
  const handleOk = async () => {
    let val = await form.validateFields();
    setLoad(true);
    if (data["name"] === "新增") {
      createPointPosition(
        val,
        (res) => {
          setLoad(false);
          const { code, msg } = res.data;
          if (code === 200) {
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
      const { 点位 = [] } = val;
      const { id, device_info_id, 车间 } = data["record"];
      let param = { ...点位[0], id, device_info_id, 车间 };
      updatePointPosition(
        param,
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
        setDevList([]);
      } else {
        const {
          工厂 = "",
          车间 = "",
          工序 = "",
          设备 = "",
          参数名 = "",
          参数类型 = "",
          点位长度 = 0,
          点位开始地址 = 0,
          点位状态 = 0,
          报警状态 = 0,
          类型 = "",
          描述 = "",
        } = record;
        let val = {
          工厂,
          车间,
          工序,
          设备名: [设备],
          点位: [
            {
              参数名,
              参数类型,
              点位长度,
              点位开始地址,
              点位状态,
              类型,
              描述,
              报警状态,
            },
          ],
        };
        form.setFieldsValue(val);
      }
    }
  }, [open]);
  return (
    <Modal
      title={`参数${data["name"]}`}
      open={open}
      onCancel={onCancel}
      getContainer={false}
      destroyOnHidden={true}
      onOk={handleOk}
      width={780}
    >
      <Spin spinning={load}>
        <Form
          form={form}
          initialValues={default_form_data}
          {...ComputeFormCol(6)}
          style={{ marginTop: 20 }}
          component={false}
          // onValuesChange={handleFormChange}
        >
          <Row gutter={[0, 16]}>
            <Col span={8}>
              <Form.Item name="工厂" label="工厂" rules={[{ required: true }]}>
                <Select
                  options={selectList2Option(query_opt["工厂"])}
                  disabled={data["name"] === "编辑"}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="车间" label="车间" rules={[{ required: true }]}>
                <Select
                  options={selectList2Option(query_opt["车间"])}
                  disabled={data["name"] === "编辑"}
                  onChange={(val) => {
                    form.setFieldsValue({
                      工序: query_opt["工序"][val],
                      设备名: [],
                    });
                    initDevice();
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="工序" label="工序" rules={[{ required: true }]}>
                <Select
                  options={selectList2Option([])}
                  disabled={data["name"] === "编辑"}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="设备名"
                label="设备名"
                {...ComputeFormCol(2)}
                rules={[{ required: true }]}
              >
                <Select
                  options={selectList2Option(dev_list)}
                  mode="multiple"
                  maxTagCount="responsive"
                  disabled={data["name"] === "编辑"}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.List name="点位">
                {(fields, { add, remove }) => (
                  <div
                    style={{
                      display: "flex",
                      rowGap: 5,
                      flexDirection: "column",
                    }}
                  >
                    {fields.map((field) => (
                      <div key={field.name}>
                        <Row
                          style={{ background: "#F5F7FC", padding: 10 }}
                          gutter={[0, 10]}
                        >
                          <Col span={8}>
                            <Form.Item
                              label="参数名"
                              name={[field.name, "参数名"]}
                              initialValue={""}
                              rules={[{ required: true }]}
                              {...ComputeFormCol(8)}
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              label="参数类型"
                              name={[field.name, "参数类型"]}
                              initialValue={""}
                              {...ComputeFormCol(8)}
                            >
                              <Select
                                options={selectList2Option([
                                  "int",
                                  "float",
                                  "string",
                                ])}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              label="点位开始地址"
                              name={[field.name, "点位开始地址"]}
                              rules={[{ required: true }]}
                              initialValue={0}
                              {...ComputeFormCol(10)}
                            >
                              <InputNumber style={{ width: "100%" }} />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              label="点位长度"
                              name={[field.name, "点位长度"]}
                              rules={[{ required: true }]}
                              initialValue={0}
                              {...ComputeFormCol(8)}
                            >
                              <InputNumber style={{ width: "100%" }} />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              label="类型"
                              name={[field.name, "类型"]}
                              initialValue={""}
                              {...ComputeFormCol(8)}
                            >
                              <Select options={selectList2Option([])} />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              label="点位状态"
                              name={[field.name, "点位状态"]}
                              initialValue={0}
                              {...ComputeFormCol(10)}
                              normalize={(value) => (value ? 1 : 0)}
                            >
                              <Switch />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              label="报警状态"
                              name={[field.name, "报警状态"]}
                              initialValue={0}
                              {...ComputeFormCol(8)}
                              normalize={(value) => (value ? 1 : 0)}
                            >
                              <Switch />
                            </Form.Item>
                          </Col>
                          <Col span={16}>
                            <Form.Item
                              label="描述"
                              name={[field.name, "描述"]}
                              initialValue={""}
                              {...ComputeFormCol(4)}
                            >
                              <Input />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Flex justify="end">
                          <Space>
                            {fields.length > 1 ? (
                              <Button
                                type="link"
                                icon={<DeleteOutlined />}
                                onClick={() => remove(field.name)}
                                danger
                              >
                                删除
                              </Button>
                            ) : null}
                            {data["name"] === "新增" ? (
                              <Button
                                type="link"
                                icon={<PlusCircleOutlined />}
                                onClick={() => add()}
                              >
                                新增
                              </Button>
                            ) : (
                              ""
                            )}
                          </Space>
                        </Flex>
                      </div>
                    ))}
                  </div>
                )}
              </Form.List>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

export const BatchParamModal = ({
  open = false,
  data = {},
  onCancel,
  requestData,
}) => {
  const [form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const [opt, setOpt] = useState({});
  const [dev_list, setDevList] = useState([]);
  const default_form_data = {
    车间: "",
    设备ids: [],
    修改前参数名: "",
    修改后参数名: "",
    参数类型: "",
    点位长度: 0,
    点位开始地址: 0,
    报警状态: 0,
    点位状态: 0,
    类型: 0,
    描述: "",
  };
  const handleOk = async () => {
    let val = await form.validateFields();
    const { 设备ids = [] } = val;
    if (设备ids.length === 0) {
      val["设备ids"] = opt["设备ids"];
    }
    setLoad(true);
    batchUpdatePointPosition(
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
  };
  const initDevice = ({ 车间, 工序 }) => {
    getPointSearch(
      { 车间, 工序 },
      (res) => {
        const { code, data } = res.data;
        if (code === 200 && data) {
          setOpt(data);
          const { 设备 = [], 设备ids = [] } = data;
          let temp = 设备.map((item, _) => ({
            label: item,
            value: 设备ids[_],
          }));
          setDevList(temp);
        } else {
          setDevList([]);
        }
      },
      () => {
        setDevList([]);
      }
    );
  };
  useEffect(() => {
    if (open) {
      const {
        车间 = "",
        工序 = "",
        参数名 = "",
        device_info_id = "",
      } = data["record"];
      initDevice({ 车间, 工序 });
      form.setFieldsValue({
        ...data["record"],
        设备ids: [device_info_id],
        修改前参数名: 参数名,
        修改后参数名: 参数名,
      });
    }
  }, [open]);
  return (
    <Modal
      title="批量参数设置"
      open={open}
      onCancel={onCancel}
      getContainer={false}
      destroyOnHidden={true}
      onOk={handleOk}
      width={800}
    >
      <Spin spinning={load}>
        <Form
          form={form}
          initialValues={default_form_data}
          {...ComputeFormCol(10)}
          style={{ marginTop: 20 }}
          component={false}
        >
          <Row gutter={[0, 16]}>
            <Col span={8}>
              <Form.Item name="工厂" label="工厂">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="车间" label="车间">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="工序" label="工序">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="设备ids" label="设备名" {...ComputeFormCol(2)}>
                <Select
                  showSearch
                  options={dev_list}
                  mode="multiple"
                  maxTagCount="responsive"
                  placeholder="空默认为车间全部设备"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="修改前参数名" name="修改前参数名">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="修改后参数名"
                name="修改后参数名"
                rules={[{ required: true }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="参数类型" name="参数类型">
                <Select
                  options={selectList2Option(["int", "float", "string"])}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="点位开始地址"
                name="点位开始地址"
                rules={[{ required: true }]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="点位长度"
                name="点位长度"
                rules={[{ required: true }]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="类型" name="类型">
                <Select options={selectList2Option([])} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="点位状态"
                name="点位状态"
                normalize={(value) => (value ? 1 : 0)}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="报警状态"
                name="报警状态"
                normalize={(value) => (value ? 1 : 0)}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="描述" name="描述">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};
