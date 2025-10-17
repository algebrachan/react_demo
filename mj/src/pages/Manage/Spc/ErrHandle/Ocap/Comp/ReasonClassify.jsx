import React, { useEffect, useState } from "react";
import { CommonCard } from "../../../../../../components/CommonCard";
import {
  Button,
  Descriptions,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  getReasonClassification,
  addReasonClassification,
  deleteReasonClassification,
  editReasonClassification,
} from "../../../../../../apis/ocap_api";
import { getLocal } from "../../../../../../utils/storage";
import { ComputeFormCol } from "../../../../../../utils/obj";
const { TextArea } = Input;

const EditClassifyModal = ({
  id = "",
  open = false,
  onCancel,
  requestData,
  data = {},
}) => {
  const [form] = Form.useForm();
  const items = [
    {
      key: "1",
      label: "制定人",
      children: data["制定人"],
    },
    {
      key: "2",
      label: "部门",
      children: data["部门"],
    },
  ];
  const handleOk = async () => {
    let val = await form.validateFields();
    val["_id"] = id;
    val["sub_id"] = data["sub_id"];
    editReasonClassification(
      val,
      (res) => {
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          message.success("操作成功");
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
  };

  useEffect(() => {
    if (open) {
      form.setFieldsValue(data);
    }
  }, [open]);

  return (
    <Modal
      title="编辑原因分类"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="确定"
      cancelText="取消"
      width={560}
    >
      <Descriptions size="large" items={items} column={2} />
      <Form
        form={form}
        initialValues={{ 类型: "", 原因内容: "" }}
        {...ComputeFormCol(4)}
      >
        <Flex vertical gap={16} style={{ padding: "10px 0" }}>
          <Form.Item name="类型" label="类型" rules={[{ required: true }]}>
            {/* <Select options={selectList2Option([])} placeholder="请选择" /> */}
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            name="原因内容"
            label="原因内容"
            {...ComputeFormCol(4)}
            rules={[{ required: true }]}
          >
            <TextArea
              autoSize={{ minRows: 2, maxRows: 6 }}
              placeholder="请输入"
            />
          </Form.Item>
        </Flex>
      </Form>
    </Modal>
  );
};

function ReasonClassify({ id = "" }) {
  const [tb_data, setTbData] = useState([]);
  const [is_modal, setIsModal] = useState(false);
  const [cur_data, setCurData] = useState({});

  const requestData = () => {
    getReasonClassification({ _id: id }, (res) => {
      const { data, code, msg } = res.data;
      if (code === 0 && data) {
        setTbData(data);
      } else {
        setTbData([]);
      }
    });
  };
  const pagination = () => {
    return {
      position: ["bottomCenter"],
      total: tb_data.length,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
      defaultPageSize: 20,
    };
  };
  const del = (record) => {
    deleteReasonClassification(
      { _id: id, sub_id: record.sub_id },
      (res) => {
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          message.success("删除成功!");
          requestData();
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("删除失败，请稍后再试!");
      }
    );
  };
  const addClassify = () => {
    addReasonClassification(
      { _id: id, 制定人: getLocal("account") },
      (res) => {
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          message.success("添加成功！");
          requestData();
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("添加失败，请稍后再试！");
      }
    );
  };
  const columns = [
    {
      title: "编号",
      dataIndex: "key",
      key: "key",
      width: 100,
      render: (x) => x + 1,
    },
    {
      title: "类型",
      dataIndex: "类型",
      key: "类型",
      width: 160,
    },
    {
      title: "原因内容",
      dataIndex: "原因内容",
      key: "原因内容",
    },
    {
      title: "状态",
      dataIndex: "状态",
      key: "状态",
      width: 160,
    },
    {
      title: "制定人",
      dataIndex: "制定人",
      key: "制定人",
      width: 160,
    },
    {
      title: "部门",
      dataIndex: "部门",
      key: "部门",
      width: 160,
    },
    {
      title: "操作",
      key: "opt",
      fixed: "right",
      width: 160,
      render: (record) => (
        <Space size={15}>
          <Popconfirm
            title="警告"
            description="确认删除该条数据?"
            onConfirm={() => del(record)}
            okText="确认"
            cancelText="取消"
          >
            <Button
              icon={<DeleteOutlined />}
              type="link"
              danger
              style={{ padding: 0 }}
            >
              删除
            </Button>
          </Popconfirm>
          <Button
            type="link"
            icon={<EditOutlined />}
            style={{ padding: 0 }}
            onClick={() => {
              setCurData(record);
              setIsModal(true);
            }}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    if (id) {
      requestData();
    }
  }, [id]);
  return (
    <CommonCard name="原因分类">
      <Flex justify="end">
        <Button type="link" icon={<PlusOutlined />} onClick={addClassify}>
          新增分类
        </Button>
      </Flex>
      <Table
        bordered
        size="small"
        columns={columns}
        dataSource={tb_data}
        scroll={{
          x: "max-content",
          y: 300,
        }}
        pagination={pagination()}
      />
      <EditClassifyModal
        id={id}
        open={is_modal}
        onCancel={() => setIsModal(false)}
        requestData={requestData}
        data={cur_data}
      />
    </CommonCard>
  );
}

export default ReasonClassify;
