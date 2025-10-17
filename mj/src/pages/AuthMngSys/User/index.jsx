import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { selectList2Option } from "../../../utils/string";
import { ComputeFormCol } from "../../../utils/obj";
import {
  createUser,
  deleteUser,
  readUsers,
  resetPassword,
  updateUser,
} from "../../../apis/auth_api";
import { useSelector } from "react-redux";

const UserModal = ({
  open = false,
  data = {},
  opt = "新增",
  onCancel,
  reFresh,
}) => {
  const [role_opt, setRoleOpt] = useState([]);
  const role_list = useSelector((state) => state.auth.role_list);
  const [form] = Form.useForm();
  const default_form_data = {
    nick_name: "",
    username: "",
    email: "",
    role_ids: [],
  };
  const handleOk = async () => {
    let val = await form.validateFields();
    if (opt === "新增") {
      createUser(
        val,
        (res) => {
          const { code, msg, data } = res.data;
          if (code === 0 && data) {
            message.success("新增成功");
            reFresh();
            onCancel();
          } else {
            message.error(msg);
          }
        },
        () => {
          message.error("网络异常");
        }
      );
    } else {
      val["user_id"] = data["user_id"];
      updateUser(
        val,
        (res) => {
          const { code, msg, data } = res.data;
          if (code === 0 && data) {
            message.success("修改成功");
            reFresh();
            onCancel();
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
      if (opt === "新增") {
        form.resetFields();
      } else {
        form.setFieldsValue(data);
      }
    }
  }, [open]);
  useEffect(() => {
    let temp = role_list.map((e) => ({ value: e.role_id, label: e.role_name }));
    // 最好过滤掉超管权限
    setRoleOpt(temp);
  }, [role_list]);
  return (
    <Modal
      title={`${opt}用户`}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnHidden={true}
      width={400}
    >
      <Form
        form={form}
        initialValues={default_form_data}
        {...ComputeFormCol(6)}
      >
        <Flex vertical gap={16}>
          <Form.Item label="姓名" name="nick_name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="工号" name="username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="邮箱" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="角色" name="role_ids">
            <Select mode="multiple" options={role_opt} />
          </Form.Item>
        </Flex>
      </Form>
    </Modal>
  );
};

function User() {
  const [modal, contextHolder] = Modal.useModal();
  const [form] = Form.useForm();
  const default_query_form = {
    ipt: "",
  };
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [cur_data, setCurData] = useState({});
  const [is_modal, setIsModal] = useState(false);
  const [opt, setOpt] = useState("");
  const edit = (x) => {
    setCurData(x);
    setOpt("编辑");
    setIsModal(true);
  };
  const add = () => {
    setOpt("新增");
    setIsModal(true);
  };
  const del = (record) => {
    const { user_id = "" } = record;
    deleteUser(
      { user_id },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          message.success("删除成功");
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
  const reset_psw = async (record) => {
    const { user_id = "", nick_name = "" } = record;
    const confirmed = await modal.confirm({
      title: "确认操作",
      content: <div>{`确认重置用户 ${nick_name} 的密码?`}</div>,
      okText: "是",
      cancelText: "否",
    });
    if (confirmed) {
      resetPassword(
        { user_id },
        (res) => {
          const { code, msg, data } = res.data;
          if (code === 0 && data) {
            message.success("重置成功");
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
  const generateColumns = () => {
    let columns = [
      {
        title: "姓名",
        dataIndex: "nick_name",
        key: "nick_name",
        width: 150,
      },
      {
        title: "工号",
        dataIndex: "username",
        key: "username",
        width: 150,
      },
      {
        title: "邮箱",
        dataIndex: "email",
        key: "email",
        width: 150,
      },
      {
        title: "角色",
        dataIndex: "role_names",
        key: "role_names",
        render: (x) =>
          x && (
            <Space>
              {x.map((item, _) => (
                <Tag color="geekblue" key={_}>
                  {item}
                </Tag>
              ))}
            </Space>
          ),
      },
      {
        title: "操作",
        key: "opt",
        width: 300,
        render: (record) => (
          <Space>
            <Button type="link" onClick={() => reset_psw(record)}>
              重置密码
            </Button>
            {record.user_id === 0 ? (
              ""
            ) : (
              <>
                <Button
                  icon={<EditOutlined />}
                  style={{ padding: 0 }}
                  type="link"
                  onClick={() => edit(record)}
                >
                  编辑
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
              </>
            )}
          </Space>
        ),
      },
    ];
    return columns;
  };

  const requestData = () => {
    const { ipt } = form.getFieldsValue();
    setTbLoad(true);
    readUsers(
      { value: ipt },
      (res) => {
        setTbLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          const { user } = data;
          setTbData(user);
        } else {
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
    <Flex vertical gap={20}>
      {contextHolder}
      <Form form={form} layout="inline" initialValues={default_query_form}>
        <Form.Item name="ipt">
          <Input placeholder="请输入" />
        </Form.Item>
        <Space>
          <Button type="primary" onClick={requestData}>
            查询
          </Button>
          <Button type="primary" onClick={add}>
            新增
          </Button>
        </Space>
      </Form>
      <Table
        size="small"
        loading={tb_load}
        columns={generateColumns()}
        dataSource={tb_data}
        bordered
        scroll={{
          x: "max-content",
        }}
        pagination={pagination()}
      />
      <UserModal
        open={is_modal}
        onCancel={() => setIsModal(false)}
        data={cur_data}
        opt={opt}
        reFresh={requestData}
      />
    </Flex>
  );
}

export default User;
