import React, { useState } from "react";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import { Button, Flex, Form, Select, Space, Table } from "antd";
import { selectList2Option } from "../../../../utils/string";
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
  PlayCircleFilled,
  PlayCircleOutlined,
} from "@ant-design/icons";

const default_query_form = {
  工厂: "",
  车间: "",
  工序: "",
  机台: "",
  特征: "",
};
const default_tb_data = [
  {
    key: 1,
    规则: "规则1",
    规则类型: "SPC",
    规则编码: 1,
    是否使用: "是",
    说明: "规则1:1界外,1点落在A区以外",
    修改人: "",
    更新时间: "",
    备注: "",
  },
  {
    key: 2,
    规则: "规则2",
    规则类型: "SPC",
    规则编码: 2,
    是否使用: "是",
    说明: "规则2:6连串, 连续6点递增或递减, 即连成一串",
    修改人: "",
    更新时间: "",
    备注: "",
  },
  {
    key: 3,
    规则: "规则3",
    规则类型: "SPC",
    规则编码: 3,
    是否使用: "否",
    说明: "规则3:2/3A规则, 连续3点中有2点在中心线同一侧的B区外<即a区内>",
    修改人: "",
    更新时间: "",
    备注: "",
  },
  {
    key: 4,
    规则: "规则4",
    规则类型: "SPC",
    规则编码: 4,
    是否使用: "否",
    说明: "规则4:4/5C规则, 连续5点中有4点在中心线同一侧的C区以外",
    修改人: "",
    更新时间: "",
    备注: "",
  },
  {
    key: 5,
    规则: "规则5",
    规则类型: "SPC",
    规则编码: 5,
    是否使用: "否",
    说明: "规则5:8缺C, 连续8点在中心线两侧, 但无一点在C区中",
    修改人: "",
    更新时间: "",
    备注: "",
  },
  {
    key: 6,
    规则: "规则6",
    规则类型: "SPC",
    规则编码: 6,
    是否使用: "否",
    说明: "规则6:9单侧,连续9点落在中心线同一侧",
    修改人: "",
    更新时间: "",
    备注: "",
  },
  {
    key: 7,
    规则: "规则7",
    规则类型: "SPC",
    规则编码: 7,
    是否使用: "否",
    说明: "规则7:15全C,连续15个点全部在C区内",
    修改人: "",
    更新时间: "",
    备注: "",
  },
  {
    key: 8,
    规则: "规则8",
    规则类型: "SPC",
    规则编码: 8,
    是否使用: "否",
    说明: "规则8:8缺C, 连续8点在中心线两侧, 但无一点在C区中",
    修改人: "",
    更新时间: "",
    备注: "",
  },
];

function RuleMaintain() {
  const [query_form] = Form.useForm();
  const [tb_data, setTbData] = useState(default_tb_data);
  const [query_opt, setQueryOpt] = useState({});
  const columns = [
    {
      title: "序号",
      key: "key",
      dataIndex: "key",
      width: 50,
    },
    {
      title: "规则",
      key: "规则",
      dataIndex: "规则",
    },
    {
      title: "规则类型",
      key: "规则类型",
      dataIndex: "规则类型",
    },
    {
      title: "规则编码",
      key: "规则编码",
      dataIndex: "规则编码",
    },
    {
      title: "是否使用",
      key: "是否使用",
      dataIndex: "是否使用",
    },
    {
      title: "说明",
      key: "说明",
      dataIndex: "说明",
    },
    {
      title: "修改人",
      key: "修改人",
      dataIndex: "修改人",
      width: 200,
    },
    {
      title: "更新时间",
      key: "更新时间",
      dataIndex: "更新时间",
      width: 200,
    },
    {
      title: "备注",
      key: "备注",
      dataIndex: "备注",
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
          <Button
            type="link"
            icon={<PlayCircleOutlined />}
            style={{ padding: 5 }}
          >
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
      <MyBreadcrumb items={[window.sys_name, "SPC规则"]} />
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
