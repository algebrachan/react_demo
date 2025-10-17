import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Form,
  Table,
  Select,
  DatePicker,
  message,
  Flex,
  Space,
  AutoComplete,
  Spin,
} from "antd";
import dayjs from "dayjs";
import { ComputeFormCol } from "../../../../../utils/obj";
import {
  createSopInstruction,
  updateSopInstruction,
  readSopInstruction,
} from "../../../../../apis/qms_router";
import { selectList2Option, timeFormat } from "../../../../../utils/string";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { ImageUpload } from "../Common";
import { Popconfirm } from "antd";

const { Option } = Select;

const EditableTable = ({ title, data, setData }) => {
  const [form] = Form.useForm();
  const columnsItems = [
    { label: "工序", name: "process" },
    { label: "技术要求", name: "technical_requirements" },
    { label: "特殊特性", name: "inspection_property" },
    { label: "标准图", type: "file", name: "standard_graph" },
  ];

  const columns = [
    {
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    ...columnsItems.map((item) => ({
      title: item.label,
      dataIndex: item.name,
      key: item.name,
      width: 140,
      render: (text, record, index) => {
        if (item.type === "select") {
          return (
            <Select
              style={{ width: "100%" }}
              placeholder="请选择"
              value={text}
              onChange={(val) => handleTableChange(val, item.name, index)}
            >
              {item.options?.map((opt) => (
                <Option key={opt} value={opt}>
                  {opt}
                </Option>
              ))}
            </Select>
          );
        } else if (item.type === "file") {
          return (
            <ImageUpload
              fileList={record[item.name] || []}
              setFileData={(fileList) => {
                const newData = [...data];
                newData[index][item.name] = fileList;
                setData(newData);
              }}
            />
          );
        } else {
          return (
            <Input.TextArea
              autoSize
              style={{ width: "100%" }}
              value={text}
              onChange={(e) =>
                handleTableChange(e.target.value, item.name, index)
              }
            />
          );
        }
      },
    })),
    {
      title: "操作",
      dataIndex: "operation",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Button type="link" danger onClick={() => handleDelete(record.key)}>
          删除
        </Button>
      ),
    },
  ];

  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData.map((item, index) => ({ ...item, key: index + 1 })));
  };

  const handleTableChange = (value, field, index) => {
    const newData = [...data];
    if (newData[index]) {
      newData[index][field] = value;
      setData(newData);
    }
  };

  return (
    <Form form={form} component={false}>
      <Table
        size="small"
        title={title}
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: 1800 }}
        bordered
        rowKey="key"
      />
    </Form>
  );
};

const initFormData = {
  title: "",
  version: "",
  inspection_number: "",
  scopes: [],
  preparation: "",
  reviewer: "",
  approver: "",
  creator: "",
  reviser: "",
  revision_date: "",
};

const SopGuideDoc = () => {
  const [query_form] = Form.useForm();
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [id, setId] = useState("");
  const [sampling_flist, setSamplingFlist] = useState([]);
  const [form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const [bodyData, setBodyData] = useState([]);
  const del = (record) => {};
  const columns = [
    {
      title: "序号",
      key: "key",
      render: (_, __, index) => index + 1,
      width: 80,
    },
    {
      title: "作业指导书编号",
      dataIndex: "instruction_number",
      key: "instruction_number",
      width: 200,
      render: (text) => <a>{text}</a>,
      onCell: (record) => ({
        onClick: () => {
          form.setFieldsValue(record);
          let tb = record.items.map((item, _) => ({
            ...item,
            key: _ + 1,
            standard_graph: item.standard_graph
              ? [
                  {
                    uid: "-1",
                    name: "image.png",
                    status: "done",
                    url: item.standard_graph,
                  },
                ]
              : [],
          }));
          setBodyData(tb);
          setId(record.id);
        },
      }),
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      width: 200,
    },
    {
      title: "版本",
      dataIndex: "version",
      key: "version",
      width: 120,
    },
    {
      title: "分类",
      dataIndex: "category",
      key: "category",
      width: 120,
    },
    {
      title: "创建人",
      dataIndex: "creator",
      key: "creator",
      width: 120,
    },
    {
      title: "操作",
      key: "opt",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="警告"
            description="确认删除该条数据?"
            onConfirm={() => del(record)}
            okText="确认"
            cancelText="取消"
          >
            <Button
              icon={<DeleteOutlined />}
              style={{ padding: 0 }}
              type="link"
              danger
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 120,
    },
  ];
  const pagination = {
    position: ["bottomCenter"],
    showTotal: (total) => `共 ${total} 条`,
    showQuickJumper: true,
    showSizeChanger: true,
    defaultPageSize: 10,
  };
  const handleSearch = () => {
    const { title } = query_form.getFieldsValue();
    setTbLoad(true);
    readSopInstruction(
      { title },
      (res) => {
        setTbLoad(false);
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          setTbData(data);
          message.success("查询成功");
        } else {
          message.error(msg);
        }
      },
      () => {
        setTbLoad(false);
        message.error("加载数据失败");
      }
    );
  };

  const handleSubmit = async () => {
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
    const formData = new FormData();
    setLoad(true);
    let param = {
      ...values,
      items: bodyData,
    };
    bodyData.forEach((item) => {
      const empty = new Blob([], { type: "text/plain" });
      if (
        item.standard_graph &&
        item.standard_graph.length > 0 &&
        item.standard_graph[0].uid !== "-1"
      ) {
        formData.append("standard_graphs", item.standard_graph[0]);
      } else {
        formData.append("standard_graphs", empty);
      }
    });
    formData.append("create_sop_instruction", JSON.stringify(param));

    createSopInstruction(
      formData,
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0) {
          message.success(msg);
          handleSearch();
        } else {
          message.error(msg);
        }
      },
      () => {
        setLoad(false);
        message.error("提交失败");
      }
    );
  };
  const handleMod = async () => {
    if (!id) {
      message.warning("请选择一条数据");
      return;
    }
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
    const formData = new FormData();
    setLoad(true);
    let param = {
      id,
      ...values,
      items: bodyData,
    };
    bodyData.forEach((item) => {
      if (item.standard_graph && item.standard_graph.length > 0) {
        if (item.standard_graph[0].uid !== "-1") {
          // 更换
          formData.append("standard_graphs", item.standard_graph[0]);
        } else {
          // 不动
          formData.append(
            "standard_graphs",
            new Blob(["12"], { type: "text/plain" })
          );
        }
      } else {
        // 删除
        formData.append(
          "standard_graphs",
          new Blob(["1"], { type: "text/plain" })
        );
      }
    });
    formData.append("update_sop_instruction", JSON.stringify(param));

    updateSopInstruction(
      formData,
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0) {
          message.success(msg);
          handleSearch();
        } else {
          message.error(msg);
        }
      },
      () => {
        setLoad(false);
        message.error("修改失败");
      }
    );
  };

  const handleAddRow = () => {
    const newRow = {
      key: Date.now().toString(),
      process: "",
      technical_requirements: "",
      inspection_property: "",
      standard_graph: [],
    };
    setBodyData([...bodyData, newRow]);
  };

  useEffect(() => {
    handleSearch();
  }, []);
  return (
    <Flex vertical gap={16}>
      <Form
        layout="inline"
        form={query_form}
        initialValues={{
          title: "",
        }}
      >
        <Space>
          <Form.Item label="名称" name="title">
            <Input />
          </Form.Item>
          <Button type="primary" onClick={handleSearch}>
            查询
          </Button>
        </Space>
      </Form>
      <Table
        loading={tb_load}
        columns={columns}
        dataSource={tb_data}
        rowKey="id"
        bordered
        size="small"
        pagination={pagination}
        scroll={{ x: "max-content", y: 300 }}
        style={{
          width: "100%",
        }}
      />
      <Spin spinning={load}>
        <Card style={{ border: "2px solid #adc6ff" }}>
          <Flex vertical gap={10}>
            <Form
              form={form}
              {...ComputeFormCol(7)}
              initialValues={initFormData}
            >
              <Row gutter={[10, 10]}>
                <Col span={6}>
                  <Form.Item
                    label="作业指导书编号"
                    name="instruction_number"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="标题"
                    name="title"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="版本"
                    name="version"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item
                    label="适用范围"
                    name="scopes"
                    rules={[
                      {
                        required: true,
                        message: "至少需要添加一个适用范围",
                      },
                    ]}
                  >
                    <Form.List name="scopes">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <Row
                              key={key}
                              gutter={8}
                              style={{ marginBottom: 8 }}
                            >
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
                            添加适用范围
                          </Button>
                        </>
                      )}
                    </Form.List>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="作业前准备" name="preparation">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="审核"
                    name="reviewer"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="批准"
                    name="approver"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="创建人"
                    name="creator"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="修订人" name="reviser">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="修订日期"
                    name="revision_date"
                    getValueProps={(value) => ({
                      value: value && dayjs(value),
                    })}
                    normalize={(value) =>
                      value && dayjs(value).format(timeFormat)
                    }
                  >
                    <DatePicker
                      showTime
                      allowClear={false}
                      format={timeFormat}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <EditableTable
              data={bodyData}
              setData={setBodyData}
              title={() => (
                <Flex justify="space-between">
                  <div>作业项目</div>
                  <Button onClick={handleAddRow}>添加行</Button>
                </Flex>
              )}
            />
            <Flex justify="end" gap={20}>
              <Button
                onClick={() => {
                  form.resetFields();
                  setId("");
                  setBodyData([]);
                }}
              >
                重置
              </Button>
              <Button onClick={handleMod}>修改</Button>
              <Button onClick={handleSubmit} type="primary">
                提交
              </Button>
            </Flex>
          </Flex>
        </Card>
        {/* <Card title="检验项目" extra={<></>}></Card> */}
      </Spin>
    </Flex>
  );
};

export default SopGuideDoc;
