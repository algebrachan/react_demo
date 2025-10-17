import React, { useState, useEffect } from "react";
import {
  Form,
  Flex,
  Space,
  DatePicker,
  Button,
  Table,
  Input,
  message,
  Spin,
  Row,
  Col,
  Modal,
} from "antd";
import dayjs from "dayjs";
import {
  qmsReadShipTasks,
  qmsDeleteShipTasks,
  qmsUpdateShipTasks,
} from "@/apis/qms_router";
import { dateFormat } from "@/utils/string";
import { Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { CustomizeEditTable, GenerateFormItem } from "../Common";
import { ComputeFormCol } from "../../../../../../utils/obj";

const EditModal = ({ open, onCancel, data, query }) => {
  const [tb_data, setTbData] = useState([]);
  const [form] = Form.useForm();
  const [form_load, setFormLoad] = useState(false);
  const default_form_data = {
    报检单号: "",
    客户: "",
    产品类型: "",
    产品名称: "",
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
      type: "input",
      required: true,
    },
    {
      label: "产品类型",
      name: "产品类型",
      type: "input",
      required: true,
    },
    {
      label: "产品名称",
      name: "产品名称",
      type: "input",
      required: true,
    },
    {
      label: "责任人",
      name: "责任人",
      type: "input",
      required: true,
    },
  ];

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
    values["id"] = data["id"];
    values["items"] = tb_data.map(({ key, ...rest }) => rest);
    qmsUpdateShipTasks(
      values,
      (res) => {
        setFormLoad(false);
        const { code, data, msg } = res.data;
        if (code === 0) {
          message.success("修改成功");
          onCancel();
          query();
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
    if (open) {
      form.setFieldsValue(data);
      const { items = [] } = data;
      let temp_db = items.map((x, _) => ({ key: _, ...x }));
      setTbData(temp_db);
    }
  }, [open, data]);
  return (
    <Modal
      title="编辑出货工单"
      width={1200}
      onCancel={onCancel}
      onOk={submit}
      open={open}
    >
      <Spin spinning={form_load}>
        <Flex vertical gap={16}>
          <Form
            form={form}
            {...ComputeFormCol(8)}
            initialValues={default_form_data}
          >
            <Row gutter={[16, 16]}>
              {formItems.map((item) => (
                <Col span={6} key={item.name}>
                  <GenerateFormItem item={item} />
                </Col>
              ))}
            </Row>
          </Form>
          <CustomizeEditTable
            columns_list={columnItems}
            setTbData={setTbData}
            dataSource={tb_data}
          />
        </Flex>
      </Spin>
    </Modal>
  );
};

function QueryResult() {
  const [query_form] = Form.useForm();
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [is_edit, setIsEdit] = useState(false);
  const [cur_data, setCurData] = useState({});

  const del = (id) => {
    qmsDeleteShipTasks(
      { id },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          message.success("删除成功");
          handleSearch();
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };
  const columns = [
    {
      title: "序号",
      key: "key",
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: "报检单号",
      key: "报检单号",
      dataIndex: "报检单号",
      width: 160,
    },
    {
      title: "产品名称",
      key: "产品名称",
      dataIndex: "产品名称",
      width: 120,
    },
    {
      title: "产品类型",
      key: "产品类型",
      dataIndex: "产品类型",
      width: 120,
    },
    {
      title: "客户",
      key: "客户",
      dataIndex: "客户",
      width: 120,
    },
    {
      title: "物料名称",
      key: "物料名称",
      width: 120,
      render: (_, record) => {
        return (
          <div style={{ whiteSpace: "pre-line" }}>
            {record.items?.map((x) => x.物料名称).join("\n")}
          </div>
        );
      },
    },
    {
      title: "物料编码",
      key: "物料编码",
      width: 120,
      render: (_, record) => {
        return (
          <div style={{ whiteSpace: "pre-line" }}>
            {record.items?.map((x) => x.物料编码).join("\n")}
          </div>
        );
      },
    },
    {
      title: "发货数量",
      key: "发货数量",
      width: 120,
      render: (_, record) => {
        return (
          <div style={{ whiteSpace: "pre-line" }}>
            {record.items?.map((x) => x.发货数量).join("\n")}
          </div>
        );
      },
    },
    {
      title: "发货日期",
      key: "发货日期",
      width: 120,
      render: (_, record) => {
        return (
          <div style={{ whiteSpace: "pre-line" }}>
            {record.items?.map((x) => x.发货日期).join("\n")}
          </div>
        );
      },
    },
    {
      title: "责任人",
      key: "责任人",
      dataIndex: "责任人",
      width: 120,
    },
    {
      title: "是否发货",
      key: "是否发货",
      dataIndex: "是否发货",
      width: 120,
      render: (x) => (x ? "是" : "否"),
    },
    {
      title: "创建时间",
      key: "创建时间",
      dataIndex: "创建时间",
      width: 200,
    },
    {
      title: "操作",
      key: "opt",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="警告"
            description="确认删除该条数据?"
            onConfirm={() => del(record.id)}
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
          <Button
            icon={<EditOutlined />}
            style={{ padding: 0 }}
            type="link"
            onClick={() => {
              setCurData(record);
              setIsEdit(true);
            }}
          >
            编辑
          </Button>
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
    const values = query_form.getFieldsValue();
    setTbLoad(true);
    qmsReadShipTasks(
      values,
      (res) => {
        setTbLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          setTbData(data);
        } else {
          message.error(msg);
          setTbData([]);
        }
      },
      () => {
        setTbLoad(false);
        setTbData([]);
        message.error("查询失败");
      }
    );
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
          报检单号: "",
          物料名称: "",
          物料编码: "",
          产品类型: "",
          客户: "",
          责任人: "",
        }}
      >
        <Space>
          {[
            "报检单号",
            "物料名称",
            "物料编码",
            "产品类型",
            "客户",
            "责任人",
          ].map((item) => (
            <Form.Item label={item} name={item} key={item}>
              <Input placeholder="请输入" />
            </Form.Item>
          ))}
          <Button type="primary" onClick={handleSearch}>
            查询
          </Button>
        </Space>
      </Form>
      <Table
        rowKey="id"
        size="small"
        loading={tb_load}
        bordered
        columns={columns}
        dataSource={tb_data}
        pagination={pagination}
        scroll={{ x: "max-content" }}
      />
      <EditModal
        open={is_edit}
        onCancel={() => setIsEdit(false)}
        data={cur_data}
        query={handleSearch}
      />
    </Flex>
  );
}

export default QueryResult;
