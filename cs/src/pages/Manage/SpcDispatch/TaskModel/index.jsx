import React, { useEffect, useState } from "react";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import {
  Button,
  Flex,
  Form,
  Popconfirm,
  Select,
  Space,
  Table,
  message,
  Modal,
  Spin,
  Input,
  Row,
  Col,
} from "antd";
import { selectList2Option } from "../../../../utils/string";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ComputeFormCol, GenerateFormItem } from "../../../../utils/obj";
import {
  readTaskModel,
  createTaskModel,
  updateTaskModel,
  delTaskModel,
  taskModelOption,
} from "../../../../apis/nc_review_router";
export const EditTaskModal = ({
  open = false,
  data = {},
  onCancel,
  requestData,
}) => {
  const default_form_data = {
    model_name: "",
    description: "",
    grade: "",
    devices: [],
    upper_limit: 0,
    lower_limit: 0,
    distribution_method: "",
    duration: 0,
    order_quantity: 0,
    order_role: [],
    order_user: [],
  };
  const [form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const [opt_obj, setOptObj] = useState({});
  const FormDataItems = [
    { label: "模型名称", name: "model_name", type: "input" },
    { label: "描述", name: "description", type: "input" },
    {
      label: "任务等级",
      name: "grade",
      type: "select",
      opt: opt_obj["任务等级"],
    },
    {
      label: "设备",
      name: "devices",
      type: "multi_select",
      opt: opt_obj["设备"],
    },
    { label: "上限", name: "upper_limit", type: "input_number" },
    { label: "下限", name: "lower_limit", type: "input_number" },
    { label: "派发方式", name: "distribution_method", type: "input" },
    { label: "持续时长", name: "duration", type: "input_number" },
    { label: "所需人数", name: "order_quantity", type: "input_number" },
    { label: "接单角色", name: "order_role", type: "multi_select", opt: [] },
    { label: "接单人员", name: "order_user", type: "multi_select", opt: [] },
  ];
  const handleOk = async () => {
    let val = await form.validateFields();
    setLoad(true);
    if (data["name"] === "新增") {
      createTaskModel(
        val,
        (res) => {
          setLoad(false);
          const { code, msg } = res.data;
          if (code === 0) {
            message.success("创建成功");
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
      updateTaskModel(
        val,
        (res) => {
          setLoad(false);
          const { code, msg } = res.data;
          if (code === 0) {
            message.success("创建成功");
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
  const initOpt = () => {
    taskModelOption(
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0) {
          setOptObj(data);
        }
      },
      () => {}
    );
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
  useEffect(() => {
    initOpt();
  }, []);
  return (
    <Modal
      title={`${data["name"]}任务模型`}
      open={open}
      onCancel={onCancel}
      getContainer={false}
      onOk={handleOk}
      width={600}
    >
      <Spin spinning={load}>
        <Form
          form={form}
          initialValues={default_form_data}
          {...ComputeFormCol(6)}
        >
          <Row gutter={[16, 16]}>
            {FormDataItems.map((item) => (
              <Col span={12} key={item.name}>
                <GenerateFormItem item={item} />
              </Col>
            ))}
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};
// 设备列表
function TaskModel() {
  const [form] = Form.useForm();
  const [tb_load, setTbLoad] = useState(false);
  const [tb_data, setTbData] = useState([]);
  const [cur_data, setCurData] = useState({});
  const [dev_modal, setDevModal] = useState(false);
  const del = (record) => {
    delTaskModel(
      { id: record["id"] },
      (res) => {
        const { code, msg } = res.data;
        if (code === 0) {
          message.success("删除成功");
          requestData();
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络错误");
      }
    );
  };
  const columns = [
    {
      title: "序号",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "模型名称",
      dataIndex: "model_name",
      key: "model_name",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "任务等级",
      dataIndex: "grade",
      key: "grade",
    },
    {
      title: "设备",
      dataIndex: "devices",
      key: "devices",
      render: (d) => d && d.join(","),
    },
    {
      title: "上限",
      dataIndex: "upper_limit",
      key: "upper_limit",
    },
    {
      title: "下限",
      dataIndex: "lower_limit",
      key: "lower_limit",
    },
    {
      title: "派发方式",
      dataIndex: "distribution_method",
      key: "distribution_method",
    },
    {
      title: "持续时长",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "所需人数",
      dataIndex: "order_quantity",
      key: "order_quantity",
    },
    {
      title: "接单角色",
      dataIndex: "order_quantity",
      key: "order_quantity",
    },
    {
      title: "接单人员",
      dataIndex: "order_user",
      key: "order_user",
    },
    {
      title: "操作",
      key: "opt",
      width: 100,
      fixed: "right",
      render: (record) => (
        <Space>
          <Button
            style={{ padding: 0 }}
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setDevModal(true);
              setCurData({ name: "编辑", record });
            }}
          >
            修改
          </Button>
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
    },
  ];
  const pagination = {
    position: ["bottomCenter"],
    showTotal: (total) => `共 ${total} 条`,
  };
  const requestData = () => {
    const { process } = form.getFieldsValue();
    setTbLoad(true);
    readTaskModel(
      { process },
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
      }
    );
  };
  useEffect(() => {
    requestData();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "SPC派工", "任务模型"]} />
      <div className="content_root">
        <Flex vertical gap={20}>
          <Form form={form} initialValues={{ process: "" }} layout="inline">
            <Form.Item label="工序" name="process">
              <Input placeholder="请输入" />
            </Form.Item>
            <Space>
              <Button type="primary" onClick={() => requestData()}>
                查询
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setCurData({ name: "新增", record: {} });
                  setDevModal(true);
                }}
              >
                新增
              </Button>
            </Space>
          </Form>
          <Table
            rowKey="id"
            loading={tb_load}
            size="small"
            columns={columns}
            dataSource={tb_data}
            bordered
            scroll={{
              x: "max-content",
            }}
            pagination={pagination}
          />
        </Flex>
      </div>
      <EditTaskModal
        open={dev_modal}
        onCancel={() => setDevModal(false)}
        data={cur_data}
        requestData={() => requestData()}
      />
    </div>
  );
}

export default TaskModel;
