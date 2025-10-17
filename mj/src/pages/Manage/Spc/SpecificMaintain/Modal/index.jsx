import {
  Button,
  Checkbox,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Select,
  Space,
  Table,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { selectList2Option } from "../../../../../utils/string";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ComputeFormCol } from "../../../../../utils/obj";
import {
  addNewSpcSpecification,
  addNewSpcSpecification2,
  addNewSpcSpecification3,
  getSpcSpecification2,
  getSpcSpecification3,
  updateSpcSpecification,
  updateSpcSpecification2,
  updateSpcSpecification3,
  deleteSpecifications2,
  deleteSpecifications3,
} from "../../../../../apis/spc_api";

const EditPopconfirm1 = ({
  data = {},
  name = "新增",
  placement = "left",
  btn = (
    <Button style={{ padding: 0 }} type="link" icon={<EditOutlined />}>
      编辑
    </Button>
  ),
  query,
}) => {
  const default_data_form = {
    图号: "",
    参数: "",
    美晶内控上限: "",
    美晶内控中线: "",
    美晶内控下限: "",
    状态: "",
  };
  const [form] = Form.useForm();
  const save = () => {
    let val = form.getFieldsValue();
    const { 图号, 参数 } = val;
    if (name === "新增") {
      if (图号 === "" || 参数 === "") {
        message.warning("请选择图号or参数");
        return;
      }
      addNewSpcSpecification2(
        val,
        (res) => {
          const { code, msg, data } = res.data;
          if (code === 0 && data) {
            message.success("添加成功");
            query({ 图号, 参数 });
          } else {
            message.error(msg);
          }
        },
        () => {
          message.error("网络异常");
        }
      );
    } else {
      val["id"] = data["id"];
      updateSpcSpecification2(
        val,
        (res) => {
          const { code, msg, data } = res.data;
          if (code === 0 && data) {
            message.success("修改成功");
            query({ 图号, 参数 });
          } else {
            message.error(msg);
          }
        },
        () => {
          message.error("网络异常");
        }
      );
    }
  };
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(data);
  }, [data]);
  return (
    <Popconfirm
      placement={placement}
      icon={null}
      title=""
      description={
        <Form
          form={form}
          initialValues={default_data_form}
          style={{ width: 400 }}
        >
          <Row gutter={[10, 10]}>
            <Col span={12}>
              <Form.Item name="图号" label="图号" {...ComputeFormCol(8)}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="参数" label="参数" {...ComputeFormCol(8)}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="美晶内控上限"
                label="内控上限"
                {...ComputeFormCol(8)}
                normalize={(value) => value || 0}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="美晶内控中线"
                label="内控中线"
                {...ComputeFormCol(8)}
                normalize={(value) => value || 0}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="美晶内控下限"
                label="内控下限"
                {...ComputeFormCol(8)}
                normalize={(value) => value || 0}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="状态" name="状态" {...ComputeFormCol(8)}>
                <Radio.Group options={selectList2Option(["开", "关"])} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      }
      okText="保存"
      cancelText="取消"
      onConfirm={save}
      onCancel={() => {
        form.resetFields();
        form.setFieldsValue(data);
      }}
    >
      {btn}
    </Popconfirm>
  );
};

const EditPopconfirm2 = ({
  data = {},
  name = "新增",
  placement = "left",
  btn = (
    <Button style={{ padding: 0 }} type="link" icon={<EditOutlined />}>
      编辑
    </Button>
  ),
  query,
}) => {
  const default_data_form = {
    图号: "",
    参数: "",
    客户规格上限: "",
    客户规格中线: "",
    客户规格下限: "",
    状态: "",
  };
  const [form] = Form.useForm();
  const save = () => {
    let val = form.getFieldsValue();
    const { 图号, 参数 } = val;
    if (name === "新增") {
      if (图号 === "" || 参数 === "") {
        message.warning("请选择图号or参数");
        return;
      }
      addNewSpcSpecification3(
        val,
        (res) => {
          const { code, msg, data } = res.data;
          if (code === 0 && data) {
            message.success("添加成功");
            query({ 图号, 参数 });
          } else {
            message.error(msg);
          }
        },
        () => {
          message.error("网络异常");
        }
      );
    } else {
      val["id"] = data["id"];
      updateSpcSpecification3(
        val,
        (res) => {
          const { code, msg, data } = res.data;
          if (code === 0 && data) {
            message.success("修改成功");
            query({ 图号, 参数 });
          } else {
            message.error(msg);
          }
        },
        () => {
          message.error("网络异常");
        }
      );
    }
  };
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(data);
  }, [data]);
  return (
    <Popconfirm
      placement={placement}
      icon={null}
      title=""
      description={
        <Form
          form={form}
          initialValues={default_data_form}
          style={{ width: 400 }}
        >
          <Row gutter={[10, 10]}>
            <Col span={12}>
              <Form.Item name="图号" label="图号" {...ComputeFormCol(8)}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="参数" label="参数" {...ComputeFormCol(8)}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="客户规格上限"
                label="规格上限"
                {...ComputeFormCol(8)}
                normalize={(value) => value || 0}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="客户规格中线"
                label="规格中线"
                {...ComputeFormCol(8)}
                normalize={(value) => value || 0}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="客户规格下限"
                label="规格下限"
                {...ComputeFormCol(8)}
                normalize={(value) => value || 0}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="状态" name="状态" {...ComputeFormCol(8)}>
                <Radio.Group options={selectList2Option(["开", "关"])} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      }
      okText="保存"
      cancelText="取消"
      onConfirm={save}
      onCancel={() => {
        form.resetFields();
        form.setFieldsValue(data);
      }}
    >
      {btn}
    </Popconfirm>
  );
};

export const EditModal = ({
  open = false,
  data = {},
  query_opt = {},
  onCancel,
  requestData,
}) => {
  const default_form_data = {
    图号: "",
    参数: "",
    控制图: "",
    usl: "",
    ucl: "",
    cl: "",
    lcl: "",
    lsl: "",
    状态: "开",
    类型: "",
    报警等级: "",
  };
  const [form] = Form.useForm();
  const [tb_data1, setTbData1] = useState([]);
  const [tb_data2, setTbData2] = useState([]);
  const handleValuesChange = (changedValues, allValues) => {
    const { 图号, 参数 } = changedValues;
    if (图号 || 参数) {
      console.log("触发请求");
      const { 图号, 参数 } = form.getFieldsValue();
      queryData1({ 图号, 参数 });
      queryData2({ 图号, 参数 });
    }
  };
  const queryData1 = (param) => {
    getSpcSpecification2(
      param,
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          const { data_list } = data;
          setTbData1(data_list);
        } else {
          setTbData1([]);
        }
      },
      () => {
        setTbData1([]);
      }
    );
  };
  const queryData2 = (param) => {
    getSpcSpecification3(
      param,
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          const { data_list } = data;
          setTbData2(data_list);
        } else {
          setTbData2([]);
        }
      },
      () => {
        setTbData2([]);
      }
    );
  };
  const del1 = (record) => {
    const { id = "" } = record;
    const { 图号, 参数 } = form.getFieldsValue();
    deleteSpecifications2(
      { id },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          message.success("删除成功");
          queryData1({ 图号, 参数 });
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };
  const del2 = (record) => {
    const { id = "" } = record;
    const { 图号, 参数 } = form.getFieldsValue();
    deleteSpecifications3(
      { id },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          message.success("删除成功");
          queryData2({ 图号, 参数 });
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };
  const generateColumns1 = () => {
    let columns = [
      "美晶内控上限",
      "美晶内控中线",
      "美晶内控下限",
      "添加时间",
      "更新时间",
      "更新人",
      "状态",
      "备注",
    ].map((e, _) => {
      let col = {
        title: e,
        dataIndex: e,
        key: e,
        width: 120,
      };
      return col;
    });
    columns.push({
      title: "操作",
      key: "opt",
      width: 100,
      render: (record) => (
        <Space>
          <EditPopconfirm1 data={record} name="编辑" query={queryData1} />
          <Popconfirm
            title="警告"
            description="确认删除该条数据?"
            onConfirm={() => del1(record)}
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
    });
    return columns;
  };
  const pagination1 = () => {
    return {
      position: ["bottomCenter"],
      total: tb_data1.length,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
      defaultPageSize: 10,
    };
  };
  const generateColumns2 = () => {
    let columns = [
      "客户规格上限",
      "客户规格中线",
      "客户规格下限",
      "添加时间",
      "更新时间",
      "更新人",
      "状态",
      "备注",
    ].map((e, _) => {
      let col = {
        title: e,
        dataIndex: e,
        key: e,
        width: 120,
      };
      return col;
    });
    columns.push({
      title: "操作",
      key: "opt",
      width: 100,
      render: (record) => (
        <Space>
          <EditPopconfirm2 data={record} name="编辑" query={queryData2} />
          <Popconfirm
            title="警告"
            description="确认删除该条数据?"
            onConfirm={() => del2(record)}
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
    });
    return columns;
  };
  const pagination2 = () => {
    return {
      position: ["bottomCenter"],
      total: tb_data2.length,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
      defaultPageSize: 10,
    };
  };

  const handleOk = () => {
    let val = form.getFieldsValue();
    const { name = "新增" } = data;
    if (name === "新增") {
      const { 图号, 参数 } = val;
      if (图号 === "" || 参数 === "") {
        message.warning("请选择图号or参数");
        return;
      }
      addNewSpcSpecification(
        val,
        (res) => {
          const { code, data, msg } = res.data;
          if (code === 0 && data) {
            message.success("新增成功");
            onCancel();
            requestData();
          } else {
            message.error(msg);
          }
        },
        () => {
          message.error("网络异常");
        }
      );
    } else {
      updateSpcSpecification(
        val,
        (res) => {
          const { code, data, msg } = res.data;
          if (code === 0 && data) {
            message.success("保存成功");
            onCancel();
            requestData();
          } else {
            message.error(msg);
          }
        },
        () => {
          message.error("网络异常");
        }
      );
    }
  };

  useEffect(() => {
    if (open) {
      const { name = "新增", record = {} } = data;
      if (name === "新增") {
        form.resetFields();
        setTbData1([]);
        setTbData2([]);
      } else {
        form.setFieldsValue(record);
        const { 图号, 参数 } = record;
        queryData1({ 图号, 参数 });
        queryData2({ 图号, 参数 });
      }
    }
  }, [open]);
  return (
    <Modal
      getContainer={false}
      title={`数据${data["name"]}`}
      open={open}
      onCancel={onCancel}
      destroyOnHidden={true}
      width={1400}
      footer={null}
    >
      <Flex vertical gap={20}>
        <Form
          form={form}
          initialValues={default_form_data}
          layout="inline"
          onValuesChange={handleValuesChange}
        >
          <Flex vertical gap={16}>
            <Flex gap={10}>
              <Form.Item label="图号" name="图号">
                <Select
                  options={selectList2Option(query_opt["图号"])}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  disabled={data["name"] === "编辑"}
                  style={{ width: 150 }}
                />
              </Form.Item>
              <Form.Item label="参数" name="参数">
                <Select
                  options={selectList2Option(query_opt["参数"])}
                  disabled={data["name"] === "编辑"}
                  style={{ width: 150 }}
                />
              </Form.Item>
              <Form.Item label="控制图" name="控制图">
                <Select
                  options={selectList2Option(query_opt["控制图"])}
                  style={{ width: 120 }}
                />
              </Form.Item>
              <Form.Item
                label="usl"
                name="usl"
                normalize={(value) => value || 0}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                label="ucl"
                name="ucl"
                normalize={(value) => value || 0}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item label="cl" name="cl" normalize={(value) => value || 0}>
                <InputNumber />
              </Form.Item>
              <Form.Item
                label="lcl"
                name="lcl"
                normalize={(value) => value || 0}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                label="lsl"
                name="lsl"
                normalize={(value) => value || 0}
              >
                <InputNumber />
              </Form.Item>
            </Flex>
            <Flex gap={10}>
              <Form.Item label="状态" name="状态">
                <Radio.Group options={selectList2Option(["开", "关"])} />
              </Form.Item>
              <Form.Item label="类型" name="类型">
                <Radio.Group options={selectList2Option(["自动", "指定"])} />
              </Form.Item>
              <Form.Item label="报警等级" name="报警等级">
                <Select
                  options={selectList2Option(query_opt["报警等级"])}
                  style={{ width: 120 }}
                />
              </Form.Item>
              <Button type="primary" onClick={handleOk}>
                保存
              </Button>
              <EditPopconfirm1
                data={form.getFieldsValue()}
                name="新增"
                placement="bottom"
                btn={<Button type="primary">新增美晶内控</Button>}
                query={queryData1}
              />
              <EditPopconfirm2
                data={form.getFieldsValue()}
                name="新增"
                placement="bottom"
                btn={<Button type="primary">新增客户规格</Button>}
                query={queryData2}
              />
              {/* <Button
                type="primary"
                onClick={() => {
                  queryData1();
                  queryData2();
                }}
              >
                刷新
              </Button> */}
            </Flex>
          </Flex>
        </Form>
        <Table
          size="small"
          columns={generateColumns1()}
          dataSource={tb_data1}
          bordered
          scroll={{
            y: 200,
            x: "max-content",
          }}
          pagination={pagination1()}
        />
        <Table
          size="small"
          columns={generateColumns2()}
          dataSource={tb_data2}
          bordered
          scroll={{
            y: 200,
            x: "max-content",
          }}
          pagination={pagination2()}
        />
      </Flex>
    </Modal>
  );
};
