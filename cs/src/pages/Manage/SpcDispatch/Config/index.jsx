import React, { useEffect, useState } from "react";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import {
  Button,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Spin,
  Popconfirm,
} from "antd";
import { selectList2Option } from "../../../../utils/string";
import {
  specDispatchOptions,
  readSpecDispatchConfiguration,
  createSpecDispatchConfiguration,
  upSpecDispatchConfiguration,
  delSpecDispatchConfiguration,
} from "@/apis/anls_router";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ComputeFormCol } from "../../../../utils/obj";

// 派工配置
function DispatchConfig() {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [opt, setOpt] = useState({});
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const columns = [
    {
      title: "序号",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    { title: "字段类别", dataIndex: "category", key: "category", width: 160 },
    {
      title: "字段名称",
      dataIndex: "field_name",
      key: "field_name",
      width: 160,
    },
    { title: "字段说明", dataIndex: "remark", key: "remark", width: 200 },
    {
      title: "创建时间",
      dataIndex: "created_at",
      key: "created_at",
      width: 160,
    },
    {
      title: "更新时间",
      dataIndex: "updated_at",
      key: "updated_at",
      width: 160,
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
              setEditingConfig(record);
              editForm.setFieldsValue(record);
              setIsModalVisible(true);
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
  const del = (record) => {
    const { id } = record;
    delSpecDispatchConfiguration({ id }, (res) => {
      const { code } = res.data;
      if (code === 0) {
        message.success("删除成功");
        requestData();
      }
    });
  };

  const requestData = () => {
    const values = form.getFieldsValue();
    setTbLoad(true);
    readSpecDispatchConfiguration(
      values,
      (res) => {
        setTbLoad(false);
        const { code, data } = res.data;
        if (code === 0) {
          setTbData(data);
        }
      },
      () => {
        setTbLoad(false);
      }
    );
  };
  const initOpt = () => {
    specDispatchOptions(
      (res) => {
        const { code, data } = res.data;
        if (code === 0) {
          console.log("data", data);
          setOpt(data);
        }
      },
      (err) => {
        console.log("initOpt", err);
      }
    );
  };
  const handleFormSubmit = async () => {
    const values = await editForm
      .validateFields()
      .then((res) => res)
      .catch((err) => {
        const { errorFields } = err;
        let err_list = errorFields.map((e) => e.errors);
        message.warning(err_list.join("\n"));
        return false;
      });

    if (!values) return;

    // 设置提交中状态
    setSubmitLoading(true);

    if (editingConfig) {
      // 更新现有记录
      values["id"] = editingConfig["id"];
      upSpecDispatchConfiguration(
        values,
        (res) => {
          // 请求结束后重置加载状态
          setSubmitLoading(false);
          const { code } = res.data;
          if (code === 0) {
            message.success("修改成功");
            setIsModalVisible(false);
            requestData();
          }
        },
        () => {
          // 错误情况下也需要重置加载状态
          setSubmitLoading(false);
        }
      );
    } else {
      // 添加新记录
      createSpecDispatchConfiguration(
        values,
        (res) => {
          // 请求结束后重置加载状态
          setSubmitLoading(false);
          const { code } = res.data;
          if (code === 0) {
            message.success("添加成功");
            setIsModalVisible(false);
            requestData();
          }
        },
        () => {
          // 错误情况下也需要重置加载状态
          setSubmitLoading(false);
        }
      );
    }
  };
  useEffect(() => {
    console.log("opt", opt);
  }, [opt]);
  useEffect(() => {
    requestData();
    initOpt();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "SPC派工", "派工配置"]} />
      <div className="content_root">
        <Flex vertical gap={16}>
          <Form
            form={form}
            initialValues={{ category: "", field_name: "" }}
            layout="inline"
          >
            <Form.Item label="字段类别" name="category">
              <Select
                options={selectList2Option(opt["category"] || [])}
                style={{ width: 160 }}
                allowClear
              />
            </Form.Item>
            <Form.Item label="字段名称" name="field_name">
              <Input style={{ width: 160 }} />
            </Form.Item>
            <Space>
              <Button type="primary" onClick={() => requestData()}>
                查询
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setEditingConfig(null);
                  editForm.resetFields();
                  setIsModalVisible(true);
                }}
              >
                新增
              </Button>
            </Space>
          </Form>
          <Table
            rowKey="id"
            size="small"
            bordered
            loading={tb_load}
            dataSource={tb_data}
            columns={columns}
          />
        </Flex>
      </div>
      <Modal
        title={editingConfig ? "编辑派工配置" : "添加派工配置"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleFormSubmit}
        confirmLoading={submitLoading}
      >
        <Spin spinning={submitLoading} tip="提交中...">
          <Form
            form={editForm}
            initialValues={{
              category: "",
              field_name: "",
              remark: "",
            }}
            {...ComputeFormCol(6)}
          >
            <Flex vertical gap={16}>
              <Form.Item
                label="字段类别"
                name="category"
                rules={[{ required: true }]}
              >
                <Select options={selectList2Option(opt["category"] || [])} />
              </Form.Item>
              <Form.Item
                label="字段名称"
                name="field_name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="字段说明" name="remark">
                <Input.TextArea />
              </Form.Item>
            </Flex>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
}

export default DispatchConfig;
