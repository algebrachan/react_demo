import {
  Button,
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
  TreeSelect,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { selectList2Option } from "../../../utils/string";
import { ComputeFormCol } from "../../../utils/obj";
import { useDispatch, useSelector } from "react-redux";
import {
  createPermission,
  deletePermission,
  getAllPermissionsTree,
  readPermissions,
  updatePermission,
} from "../../../apis/auth_api";
import { setFieldsValue } from "../authSlice";

const generateTree = (arr) => {
  let temp = [];
  arr.forEach((item) => {
    const { permission_id, permission_name, children = [], menu_type } = item;
    let val = {
      title: permission_name,
      value: permission_id,
    };
    if (children.length > 0) {
      val["children"] = generateTree(children);
    }
    if (menu_type === "目录") {
      temp.push(val);
    }
  });
  return temp;
};
const generateKeys = (key_list = [], arr) => {
  arr.forEach((item) => {
    const { key, children = [] } = item;
    key_list.push(key);
    generateKeys(key_list, children);
  });
};

const AuthorityModal = ({
  open = false,
  data = {},
  opt = "新增",
  onCancel,
  reFresh,
}) => {
  const [form] = Form.useForm();
  const [tree, setTree] = useState([
    {
      title: "根目录",
      value: 0,
    },
  ]);
  const auth_list = useSelector((state) => state.auth.auth_list);
  const default_form_data = {
    parent_permission_id: 0,
    menu_type: "目录",
    order_num: 1,
    permission_name: "",
    path: "",
    component: "",
    visible: "显示",
  };
  const handleOk = async () => {
    const val = await form.validateFields();
    if (opt === "新增") {
      createPermission(
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
      val["permission_id"] = data["permission_id"];
      updatePermission(
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
    let child = generateTree(auth_list);
    console.log("auth_list", child);
    setTree([
      {
        title: "根目录",
        value: 0,
        children: child,
      },
    ]);
    // 过滤生成目录
  }, [auth_list]);
  return (
    <Modal
      title={`${opt}菜单`}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnHidden={true}
      width={500}
    >
      <Form
        form={form}
        initialValues={default_form_data}
        {...ComputeFormCol(5)}
      >
        <Flex vertical gap={16}>
          <Form.Item
            label="上级菜单"
            name="parent_permission_id"
            tooltip="选择父级目录"
            rules={[{ required: true }]}
          >
            <TreeSelect treeDefaultExpandAll={true} treeData={tree} />
          </Form.Item>
          <Form.Item
            label="菜单类型"
            name="menu_type"
            rules={[{ required: true }]}
          >
            <Radio.Group
              options={selectList2Option(["目录", "菜单"])}
              disabled={opt === "编辑"}
            />
          </Form.Item>
          <Form.Item
            label="排序"
            name="order_num"
            rules={[{ required: true }]}
            normalize={(value) => value || 1}
          >
            <InputNumber min={1} precision={0} />
          </Form.Item>
          <Form.Item
            label="菜单名称"
            name="permission_name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="路由地址"
            name="path"
            rules={[{ required: true }]}
            tooltip="访问的路由地址"
          >
            <Input />
          </Form.Item>
          <Form.Item label="组件地址" name="component">
            <Input />
          </Form.Item>
          <Form.Item label="显示状态" name="visible">
            <Select options={selectList2Option(["显示", "隐藏"])} allowClear />
          </Form.Item>
        </Flex>
      </Form>
    </Modal>
  );
};

const default_tbdata = [
  {
    key: "1",
    菜单名称: "cvd管理系统",
    菜单类型: "目录",
    排序: 1,
    路由地址: "/mng",
    组件地址: "",
    上级菜单: "根目录",
    children: [
      {
        key: "1-1",
        菜单名称: "数据管理",
        菜单类型: "目录",
        排序: 1,
        路由地址: "/mng",
        组件地址: "",
        上级菜单: "cvd管理系统",
        children: [
          {
            key: "1-1-1",
            菜单名称: "字段管理",
            菜单类型: "菜单",
            排序: 1,
            路由地址: "/mng/word",
            上级菜单: "数据管理",
            组件地址: "",
          },
        ],
      },
      {
        key: "1-2",
        菜单名称: "CVD数据分析",
        菜单类型: "目录",
        排序: 2,
        路由地址: "/mng",
        组件地址: "",
        上级菜单: "cvd管理系统",
        children: [
          {
            key: "1-2-1",
            菜单名称: "数据上传",
            菜单类型: "菜单",
            排序: 1,
            路由地址: "/mng/data_upload",
            组件地址: "",
            上级菜单: "CVD数据分析",
          },
          {
            key: "1-2-2",
            菜单名称: "文件分析",
            菜单类型: "菜单",
            排序: 2,
            路由地址: "/mng/file_analysis",
            组件地址: "",
            上级菜单: "CVD数据分析",
          },
          {
            key: "1-2-3",
            菜单名称: "多文件分析",
            菜单类型: "菜单",
            排序: 3,
            路由地址: "/mng/mult_file_analysis",
            组件地址: "",
            上级菜单: "CVD数据分析",
          },
          {
            key: "1-2-4",
            菜单名称: "邮件解析",
            菜单类型: "菜单",
            排序: 4,
            路由地址: "/mng/email",
            组件地址: "",
            上级菜单: "CVD数据分析",
          },
        ],
      },
    ],
  },
];
function Authority() {
  // 用redux
  const dispatch = useDispatch();
  const auth_list = useSelector((state) => state.auth.auth_list);
  const [expend_keys, setExpendKeys] = useState([]);
  const [is_modal, setIsModal] = useState(false);
  const [cur_data, setCurData] = useState({}); // 编辑当前的数据
  const [opt, setOpt] = useState(""); // 操作类型

  const requestData = () => {
    getAllPermissionsTree(
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          console.log(data);
          const { permission_tree = [] } = data;
          dispatch(setFieldsValue({ auth_list: permission_tree }));
        } else {
          dispatch(setFieldsValue({ auth_list: [] }));
        }
      },
      () => {
        dispatch(setFieldsValue({ auth_list: [] }));
      }
    );
  };
  const edit = (record) => {
    console.log(record);
    setCurData(record);
    setOpt("编辑");
    setIsModal(true);
  };
  const del = (record) => {
    const { permission_id = "" } = record;
    deletePermission(
      { permission_id },
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
  const generateColumns = () => {
    let columns = [
      {
        title: "菜单名称",
        dataIndex: "permission_name",
        key: "permission_name",
      },
      {
        title: "菜单类型",
        dataIndex: "menu_type",
        key: "menu_type",
      },
      {
        title: "排序",
        dataIndex: "order_num",
        key: "order_num",
      },
      {
        title: "路由地址",
        dataIndex: "path",
        key: "path",
      },
      {
        title: "组件地址",
        dataIndex: "component",
        key: "component",
      },
      {
        title: "操作",
        key: "opt",
        width: 300,
        render: (record) => (
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
  useEffect(() => {
    if (auth_list.length > 0) {
      let temp = [];
      generateKeys(temp, auth_list);
      setExpendKeys(temp);
    }
  }, [auth_list]);
  return (
    <>
      <Flex vertical gap={16}>
        <Flex justify="end">
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setOpt("新增");
                setIsModal(true);
              }}
            >
              新增
            </Button>
            <Button type="primary" onClick={requestData}>
              刷新
            </Button>
          </Space>
        </Flex>
        <Table
          expandable={{
            defaultExpandAllRows: true,
            expandedRowKeys: expend_keys,
            onExpandedRowsChange: setExpendKeys,
          }} // 默认展开所有行
          dataSource={auth_list}
          size="small"
          columns={generateColumns()}
          bordered
          scroll={{
            x: "max-content",
          }}
          pagination={null}
        />
      </Flex>
      <AuthorityModal
        open={is_modal}
        onCancel={() => setIsModal(false)}
        reFresh={requestData}
        data={cur_data}
        opt={opt}
      />
    </>
  );
}

export default Authority;
