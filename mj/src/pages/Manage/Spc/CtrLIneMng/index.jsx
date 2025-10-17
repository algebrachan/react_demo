import React, { useState } from "react";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import {
  Button,
  Flex,
  Form,
  Select,
  Space,
  Table,
  Input,
  Popconfirm,
  message
} from "antd";
import { selectList2Option } from "../../../../utils/string";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  deleteCtrlSpecifications,
  getCtrlSpecification,
} from "../../../../apis/spc_api";
import { EditLineModal, unit_list } from "./Modal";

function CtrLineMng() {
  const [query_form] = Form.useForm();
  const [is_modal, setIsModal] = useState(false); // 是否打开modal
  const [tb_data, setTbData] = useState([]);
  const [cur_data, setCurData] = useState({});
  const [tb_total, setTbTotal] = useState(0);
  const [cur, setCur] = useState(1);
  const [page_size, setPageSize] = useState(10);
  const default_query_form = {
    表名: "来料内控表",
    石英砂类型: "",
    元素: "Al",
  };
  const del = (record) => {
    deleteCtrlSpecifications(
      { id: record["id"], 表名: record["表名"] },
      (res) => {
        const { code, msg } = res.data;
        if (code === 0) {
          message.success("删除成功");
          requestData(cur, page_size);
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
      key: "key",
      dataIndex: "key",
      width: 100,
      render: (_) => _ + 1,
    },
    ...["表名", "石英砂类型", "元素", "内控线"].map((e, _) => ({
      title: e,
      key: e,
      dataIndex: e,
    })),
    {
      title: "操作",
      key: "opt",
      width: 200,
      render: (record) => (
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
          <Button
            type="link"
            icon={<EditOutlined />}
            style={{ padding: 5 }}
            onClick={() => {
              setIsModal(true);
              setCurData({ name: "编辑", record });
            }}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];
  const requestData = (page, size) => {
    const val = query_form.getFieldsValue();
    val["skip"] = page - 1;
    val["limit"] = size;
    getCtrlSpecification(
      val,
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0) {
          setTbData(data.data_list || []);
          setTbTotal(data.totals || 0);
        } else {
          setTbData([]);
          setTbTotal(0);
        }
      },
      () => {
        // 请求失败
        setTbData([]);
        setTbTotal(0);
      }
    );
  };
  const pagination = () => {
    return {
      current: cur,
      pageSize: page_size,
      position: ["bottomCenter"],
      total: tb_total,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
      onChange: (page, pageSize) => {
        setCur(page);
        setPageSize(pageSize);
        requestData(page, pageSize);
        // 请求数据
      },
    };
  };
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "控制线管理"]} />
      <div className="content_root">
        <Flex gap={10} vertical>
          <Form
            form={query_form}
            initialValues={default_query_form}
            layout="inline"
            style={{ padding: 10 }}
          >
            <Flex gap={10}>
              <Form.Item name="表名" label="表名">
                <Select
                  options={selectList2Option(["来料内控表", "受入检查内控表"])}
                  style={{ width: 160 }}
                />
              </Form.Item>
              <Form.Item name="石英砂类型" label="石英砂类型">
                <Input style={{ width: 120 }} />
              </Form.Item>
              <Form.Item name="元素" label="元素">
                <Select
                  options={selectList2Option(unit_list)}
                  style={{ width: 120 }}
                />
              </Form.Item>
              <Button
                type="primary"
                onClick={() => requestData(cur, page_size)}
              >
                查询
              </Button>
              <Button
                onClick={() => {
                  setCurData({ name: "新增", record: {} });
                  setIsModal(true);
                }}
              >
                新增
              </Button>
            </Flex>
          </Form>
          <Table
            bordered
            size="small"
            columns={columns}
            dataSource={tb_data}
            pagination={pagination()}
            className="common_table_root"
          />
        </Flex>
      </div>
      <EditLineModal
        open={is_modal}
        onCancel={() => setIsModal(false)}
        data={cur_data}
        requestData={() => requestData(cur, page_size)}
      />
    </div>
  );
}

export default CtrLineMng;
