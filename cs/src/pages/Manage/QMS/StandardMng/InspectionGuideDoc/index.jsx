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
  createInstruction,
  updateInstruction,
  instructionOptions,
  readInstruction,
} from "../../../../../apis/qms_router";
import { selectList2Option, timeFormat } from "../../../../../utils/string";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { ImageUpload } from "../Common";
import { Popconfirm } from "antd";

const { Option } = Select;

const SAMPLING_PLAN = [
  "全检",
  ...[
    0.01, 0.015, 0.025, 0.04, 0.065, 0.1, 0.15, 0.25, 0.4, 0.65, 1, 1.5, 2.5, 4,
    6.5, 10,
  ].map((num) => `c=0,aql=${num}`),
  "其他",
];
const EditableTable = ({ title, data, setData }) => {
  const [form] = Form.useForm();
  const columnsItems = [
    { label: "检验项目", name: "inspection_item" },
    {
      label: "检验方法",
      name: "inspection_method",
      type: "select",
      options: ["游标卡尺", "目测", "仪器检测"],
    },
    { label: "技术要求", name: "technical_requirements" },
    { label: "检验特性", name: "inspection_property" },
    { label: "标准图", type: "file", name: "standard_graph" },
    { label: "限度图", type: "file", name: "limit_graph" },
    { label: "单位", name: "unit" },
    { label: "上限", name: "upper_limit" },
    { label: "下限", name: "lower_limit" },
    { label: "抽样要求", name: "sample_requirement" },
    {
      label: "判定方案",
      name: "judgment_plan",
      type: "select",
      options: ["n", "Ac", "Re"],
    },
    { label: "结果", name: "result" },
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
  category: "",
  inspection_number: "",
  scopes: [],
  preparation: "",
  material_type: "",
  inspection_frequency: "",
  sampling_plan: "",
  sampling_text: "",
  reviewer: "",
  approver: "",
  creator: "",
  reviser: "",
  revision_date: "",
};

const InspectionGuideDoc = () => {
  const [query_form] = Form.useForm();
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [id, setId] = useState("");
  const [query_opt, setQueryOpt] = useState({});
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
      title: "检验指导书编号",
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
            limit_graph: item.limit_graph
              ? [
                  {
                    uid: "-1",
                    name: "image.png",
                    status: "done",
                    url: item.limit_graph,
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
      title: "更新文件",
      dataIndex: "更新文件",
      key: "更新文件",
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
    const { 物料编码, 物料名称 } = query_form.getFieldsValue();
    setTbLoad(true);
    readInstruction(
      { 物料编码, 物料名称 },
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
    if (values["sampling_plan"] === "其他" && sampling_flist.length > 0) {
      formData.append("sampling_files", sampling_flist[0]);
    }
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
      if (
        item.limit_graph &&
        item.limit_graph.length > 0 &&
        item.limit_graph[0].uid !== "-1"
      ) {
        formData.append("limit_graphs", item.limit_graph[0]);
      } else {
        formData.append("limit_graphs", empty);
      }
    });
    formData.append("create_instruction", JSON.stringify(param));

    createInstruction(
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
    if (values["sampling_plan"] === "其他" && sampling_flist.length > 0) {
      formData.append("sampling_files", sampling_flist[0]);
    }
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

      if (item.limit_graph && item.limit_graph.length > 0) {
        if (item.limit_graph[0].uid !== "-1") {
          // 更换
          formData.append("limit_graphs", item.limit_graph[0]);
        } else {
          // 不动
          formData.append(
            "limit_graphs",
            new Blob(["12"], { type: "text/plain" })
          );
        }
      } else {
        // 删除
        formData.append(
          "limit_graphs",
          new Blob(["1"], { type: "text/plain" })
        );
      }
    });
    formData.append("update_instruction", JSON.stringify(param));

    updateInstruction(
      formData,
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0) {
          message.success(msg);
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
      inspection_item: "",
      inspection_method: "",
      technical_requirements: "",
      inspection_property: "",
      unit: "",
      upper_limit: "",
      lower_limit: "",
      standard_graph: [],
      limit_graph: [],
      result: "",
      deficiency_level: "",
    };
    setBodyData([...bodyData, newRow]);
  };
  const initOpt = () => {
    instructionOptions(
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          setQueryOpt(data);
        } else {
          setQueryOpt({});
        }
      },
      () => {
        setQueryOpt({});
      }
    );
  };

  useEffect(() => {
    initOpt();
    handleSearch();
  }, []);
  return (
    <Flex vertical gap={16}>
      <Form
        layout="inline"
        form={query_form}
        initialValues={{
          物料编码: "",
          物料名称: "",
        }}
      >
        <Space>
          <Form.Item label="物料编码" name="物料编码">
            <AutoComplete
              options={selectList2Option(query_opt["物料编码"])}
              style={{ width: 160 }}
            />
          </Form.Item>
          <Form.Item label="物料名称" name="物料名称">
            <AutoComplete
              options={selectList2Option(query_opt["物料名称"])}
              style={{ width: 160 }}
            />
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
                    label="检验指导书编号"
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
                    label="分类"
                    name="category"
                    rules={[{ required: true }]}
                  >
                    <Select
                      options={selectList2Option([
                        "进料检验",
                        "过程检验",
                        "成品检验",
                        "出货检验",
                      ])}
                    />
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
                  <Form.Item label="检验前准备" name="preparation">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="物料类型"
                    name="material_type"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="检验频率" name="inspection_frequency">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="抽样方案" name="sampling_plan">
                    <Select options={selectList2Option(SAMPLING_PLAN)} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="抽样方案说明" name="sampling_text">
                    <Input />
                  </Form.Item>
                </Col>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.sampling_plan !== currentValues.sampling_plan
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue("sampling_plan") === "其他" && (
                      <Col span={6}>
                        <Form.Item label="抽样方案附件">
                          <ImageUpload
                            fileList={sampling_flist}
                            setFileData={setSamplingFlist}
                          />
                        </Form.Item>
                      </Col>
                    )
                  }
                </Form.Item>
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
                  <div>检验项目</div>
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
              <Button onClick={handleMod}>保存</Button>
              <Button onClick={handleSubmit} type="primary">
                提交审批
              </Button>
            </Flex>
          </Flex>
        </Card>
        {/* <Card title="检验项目" extra={<></>}></Card> */}
      </Spin>
    </Flex>
  );
};

export default InspectionGuideDoc;
