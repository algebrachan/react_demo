import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
  Tree,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { ComputeFormCol } from "../../../utils/obj";
import { useDispatch, useSelector } from "react-redux";
import {
  createRole,
  deleteRole,
  readRoles,
  updateRole,
} from "../../../apis/auth_api";
import { setFieldsValue } from "../authSlice";
const { TextArea } = Input;

const generateTree = (arr) => {
  let temp = [];
  arr.forEach((item) => {
    const { permission_id, permission_name, children = [], menu_type } = item;
    let val = {
      title: permission_name,
      key: permission_id,
    };
    if (children.length > 0) {
      val["children"] = generateTree(children);
    }
    temp.push(val);
  });
  return temp;
};

const RoleModal = ({
  open = false,
  data = {},
  opt = "新增",
  onCancel,
  reFresh,
}) => {
  const [form] = Form.useForm();
  const [tree, setTree] = useState([]);
  const [auth, setAuth] = useState([]);
  const auth_list = useSelector((state) => state.auth.auth_list);
  const default_form_data = {
    role_name: "",
    role_key: "",
    role_sort: 1,
    remark: "",
  };
  const handleOk = async () => {
    let val = await form.validateFields();
    val["permission_ids"] = auth;
    if (opt === "新增") {
      createRole(
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
      val["role_id"] = data["role_id"];
      updateRole(
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
        setAuth([]);
      } else {
        const { permission_ids = [] } = data;
        setAuth(permission_ids);
        form.setFieldsValue(data);
      }
    }
  }, [open]);

  useEffect(() => {
    let child = generateTree(auth_list);
    setTree(child);
  }, [auth_list]);

  return (
    <Modal
      title={`${opt}角色`}
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
          <Form.Item
            label="角色名称"
            name="role_name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="角色字符"
            name="role_key"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="排序"
            name="role_sort"
            rules={[{ required: true }]}
            normalize={(value) => value || 1}
          >
            <InputNumber min={1} precision={0} />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <TextArea autoSize />
          </Form.Item>
          <Form.Item label="权限选择">
            <Tree
              checkable
              checkedKeys={auth}
              onCheck={setAuth}
              defaultExpandAll={true}
              treeData={tree}
            />
          </Form.Item>
        </Flex>
      </Form>
    </Modal>
  );
};

function Role() {
  const dispatch = useDispatch();
  const role_list = useSelector((state) => state.auth.role_list);
  const [form] = Form.useForm();
  const default_query_form = {
    ipt: "",
  };
  const [tb_data, setTbData] = useState([]);
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
    const { role_id = "" } = record;
    deleteRole(
      { role_id },
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
        title: "角色名称",
        dataIndex: "role_name",
        key: "role_name",
        width: 200,
      },
      {
        title: "角色字符",
        dataIndex: "role_key",
        key: "role_key",
        width: 150,
      },
      {
        title: "排序",
        dataIndex: "role_sort",
        key: "role_sort",
        width: 60,
      },
      {
        title: "备注",
        dataIndex: "remark",
        key: "remark",
        width: 200,
      },
      {
        title: "权限",
        dataIndex: "permission_names",
        key: "permission_names",
        width: 900,
        render: (x) =>
          x && (
            <Flex wrap gap="small">
              {x.map((item, _) => (
                <Tag color="geekblue" key={_}>
                  {item}
                </Tag>
              ))}
            </Flex>
          ),
      },
      {
        title: "操作",
        key: "opt",
        width: 200,
        render: (record) =>
          record.role_id === 0 ? (
            ""
          ) : (
            <Space>
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
            </Space>
          ),
      },
    ];
    return columns;
  };
  const requestData = () => {
    readRoles(
      { value: "" },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          const { roles = [] } = data;
          dispatch(setFieldsValue({ role_list: roles }));
        } else {
          dispatch(setFieldsValue({ role_list: [] }));
        }
      },
      () => {
        dispatch(setFieldsValue({ role_list: [] }));
      }
    );
  };
  useEffect(() => {
    //过滤
    const ipt = form.getFieldValue("ipt");
    let new_role_list = role_list
      .filter((old_item, _) => old_item.role_name.includes(ipt))
      .map((e) => ({ ...e, key: e.role_id }));

    setTbData(new_role_list);
  }, [role_list]);
  useEffect(() => {
    // requestData();
  }, []);
  return (
    <Flex vertical gap={20}>
      <Form form={form} layout="inline" initialValues={default_query_form}>
        <Form.Item name="ipt">
          <Input placeholder="请输入角色名称" onPressEnter={requestData} />
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
        columns={generateColumns()}
        dataSource={tb_data}
        bordered
        scroll={{
          x: "max-content",
        }}
        pagination={pagination()}
      />
      <RoleModal
        open={is_modal}
        onCancel={() => setIsModal(false)}
        data={cur_data}
        opt={opt}
        reFresh={requestData}
      />
    </Flex>
  );
}

export default Role;
