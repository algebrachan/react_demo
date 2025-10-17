import React, { useState, useEffect } from "react";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { dateFormat, selectList2Option } from "../../../../utils/string";
import dayjs from "dayjs";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  rmsDelManufacturingConditionRecipe,
  rmsGetManufacturingConditionRecipe,
} from "../../../../apis/data_api";
const { RangePicker } = DatePicker;

function ConditionTable() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  // 修改第29行，将空数组替换为模拟数据
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);

  const default_form_data = {
    配方编号: "",
    图号: "",
    状态: "",
    制定人: "",
    制定时间: [],
    修改人: "",
    修改时间: [],
  };
  const query = () => {
    const values = form.getFieldsValue();
    setTbLoad(true);
    rmsGetManufacturingConditionRecipe(
      values,
      (res) => {
        setTbLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0) {
          const { data_list } = data;
          setTbData(data_list);
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
  const del = (record) => {
    const { id } = record;
    setTbLoad(true);
    rmsDelManufacturingConditionRecipe(
      { id },
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0) {
          message.success("删除成功");
          query();
        } else {
          setTbLoad(false);
          message.error(msg);
        }
      },
      () => {
        setTbLoad(false);
        message.error("网络异常");
      }
    );
  };
  const pagination = {
    position: ["bottomCenter"],
    showTotal: (total) => `共 ${total} 条`,
    showQuickJumper: true,
    showSizeChanger: true,
    defaultPageSize: 20,
  };
  const columns = [
    {
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 80,
      render: (_, __, index) => index + 1,
    },
    ...[
      "配方编号",
      "图号",
      "版本",
      "英寸",
      "制定人",
      "制定时间",
      "修改人",
      "修改时间",
    ].map((item) => ({
      title: item,
      dataIndex: item,
      key: item,
    })),
    {
      title: "状态",
      dataIndex: "状态",
      key: "状态",
      width: 100,
      render: (status) =>
        (status === "启用" && <Tag color="green">启用</Tag>) || (
          <Tag color="red">停用</Tag>
        ),
    },
    {
      title: "操作",
      key: "action",
      width: 180,
      fixed: "right",
      render: (text, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            style={{ padding: 0 }}
            onClick={() =>
              navigate("/mng/rms/condition_table/edit", {
                state: {
                  opt: "查看",
                  Id: record.id,
                },
              })
            }
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            style={{ padding: 0 }}
            onClick={() =>
              navigate("/mng/rms/condition_table/edit", {
                state: {
                  opt: "编辑",
                  Id: record.id,
                },
              })
            }
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
  useEffect(() => {
    query();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "RMS", "制造条件表"]} />
      <div className="content_root">
        <Flex vertical gap={16}>
          <Form layout="inline" form={form} initialValues={default_form_data}>
            <Flex gap={16} wrap="wrap">
              <Form.Item label="配方编号" name="配方编号">
                <Input style={{ width: 160 }} />
              </Form.Item>
              <Form.Item label="图号" name="图号">
                <Input style={{ width: 160 }} />
              </Form.Item>
              <Form.Item label="状态" name="状态">
                <Select
                  options={selectList2Option(["启用", "停用"])}
                  style={{ width: 120 }}
                />
              </Form.Item>
              <Form.Item label="制定人" name="制定人">
                <Input style={{ width: 160 }} />
              </Form.Item>
              <Form.Item
                label="制定时间"
                name="制定时间"
                getValueProps={(value) => {
                  return {
                    value: value && value.map((e) => dayjs(e)),
                  };
                }}
                normalize={(value) =>
                  value && value.map((e) => dayjs(e).format(dateFormat))
                }
              >
                <RangePicker style={{ width: 240 }} />
              </Form.Item>
              <Form.Item label="修改人" name="修改人">
                <Input style={{ width: 160 }} />
              </Form.Item>
              <Form.Item
                label="修改时间"
                name="修改时间"
                getValueProps={(value) => {
                  return {
                    value: value && value.map((e) => dayjs(e)),
                  };
                }}
                normalize={(value) =>
                  value && value.map((e) => dayjs(e).format(dateFormat))
                }
              >
                <RangePicker style={{ width: 240 }} />
              </Form.Item>
              <Button icon={<SearchOutlined />} type="primary" onClick={query}>
                搜索
              </Button>
              <Button
                onClick={() => form.resetFields()}
                icon={<ReloadOutlined />}
              >
                重置
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() =>
                  navigate("/mng/rms/condition_table/edit", {
                    state: {
                      opt: "新增",
                      Id: "",
                    },
                  })
                }
              >
                新增制造条件
              </Button>
            </Flex>
          </Form>
          <Table
            rowKey="id"
            loading={tb_load}
            size="small"
            bordered
            columns={columns}
            dataSource={tb_data}
            pagination={pagination}
          />
        </Flex>
      </div>
    </div>
  );
}

export default ConditionTable;
