import React, { useState } from "react";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import { Button, Flex, Form, Select, Space, Table } from "antd";
import { selectList2Option } from "../../../../utils/string";
import { DeleteOutlined, EditOutlined, ExportOutlined, EyeOutlined, PlayCircleFilled, PlayCircleOutlined } from "@ant-design/icons";

const default_query_form = {
  工厂: "",
  车间: "",
  工序: "",
  机台: "",
  特征: "",
};

function RuleMaintain() {
  const [query_form] = Form.useForm();
  const [tb_data, setTbData] = useState([{ key: 0 }]);
  const [query_opt, setQueryOpt] = useState({});
  const columns = [
    {
      title: "序号",
      key: "key",
      dataIndex: "key",
      width: 100,
      render: (x) => x + 1,
    },
    {
      title: "规则",
      key: "规则",
      dataIndex: "规则",
      width: 200,
    },
    {
      title: "规则类型",
      key: "规则类型",
      dataIndex: "规则类型",
      width: 200,
    },
    {
      title: "说明",
      key: "说明",
      dataIndex: "说明",
      width: 200,
    },
    {
      title: "操作",
      key: "opt",
      width: 200,
      render: (x) => (
        <Space>
          <Button type="link" icon={<DeleteOutlined />} style={{ padding: 5 }}>
            删除
          </Button>
          <Button type="link" icon={<ExportOutlined />} style={{ padding: 5 }}>
            导出
          </Button>
          <Button type="link" icon={<EditOutlined />} style={{ padding: 5 }}>
            编辑
          </Button>
          <Button type="link" icon={<EyeOutlined />} style={{ padding: 5 }}>
            查看
          </Button>
          <Button type="link" icon={<PlayCircleOutlined />} style={{ padding: 5 }}>
            执行
          </Button>
        </Space>
      ),
    },
  ];
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
  return (
    <div>
      <MyBreadcrumb items={["创盛长晶智能集控系统", "规则维护"]} />
      <div className="content_root">
        <Flex gap={10} vertical>
          <Form
            form={query_form}
            initialValues={default_query_form}
            layout="inline"
            style={{ padding: 10 }}
          >
            {Object.keys(default_query_form).map((e, _) => (
              <Form.Item name={e} label={e} key={_}>
                <Select
                  options={selectList2Option(query_opt[e])}
                  style={{ width: 120 }}
                />
              </Form.Item>
            ))}
            <Button type="primary">查看</Button>
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
    </div>
  );
}

export default RuleMaintain;
