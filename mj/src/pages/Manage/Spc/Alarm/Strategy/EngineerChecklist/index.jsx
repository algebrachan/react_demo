import { Table } from "antd";
import React from "react";

function EngineerChecklist({ tb_data = [] }) {
  const columns = [
    {
      title: "序号",
      key: "key",
      dataIndex: "key",
      width: 60,
      render: (x) => x + 1,
    },
    {
      title: "产品加工编号",
      key: "产品加工编号",
      dataIndex: "产品加工编号",
      width: 120,
    },
    {
      title: "外径(mm)",
      children: [
        {
          title: "D1",
          key: "D1",
          dataIndex: "D1",
          width: 60,
        },
        {
          title: "D2",
          key: "D2",
          dataIndex: "D2",
          width: 60,
        },
        {
          title: "D3",
          key: "D3",
          dataIndex: "D3",
          width: 60,
        },
      ],
    },
    {
      title: "厚度(mm)",
      children: [
        {
          title: "T1",
          key: "T1",
          dataIndex: "T1",
          width: 60,
        },
        {
          title: "T2",
          key: "T2",
          dataIndex: "T2",
          width: 60,
        },
        {
          title: "T3",
          key: "T3",
          dataIndex: "T3",
          width: 60,
        },
        {
          title: "B",
          key: "B",
          dataIndex: "B",
          width: 60,
        },
      ],
    },
    {
      title: "透明层厚",
      children: [
        {
          title: "TT1",
          key: "TT1",
          dataIndex: "TT1",
          width: 60,
        },
        {
          title: "TT2",
          key: "TT2",
          dataIndex: "TT2",
          width: 60,
        },
        {
          title: "TT3",
          key: "TT3",
          dataIndex: "TT3",
          width: 60,
        },
        {
          title: "TTR",
          key: "TTR",
          dataIndex: "TTR",
          width: 60,
        },
        {
          title: "TTB",
          key: "TTB",
          dataIndex: "TTB",
          width: 60,
        },
      ],
    },
    {
      title: "间隙",
      children: [
        {
          title: "BG/RG(mm)",
          key: "BG/RG(mm)",
          dataIndex: "BG/RG(mm)",
          width: 80,
        },
      ],
    },
    {
      title: "外观",
      children: [
        {
          title: "黑点",
          children: [
            {
              title: ">3",
              key: "黑点_>3",
              dataIndex: "黑点_>3",
              width: 60,
            },
            {
              title: "3~2",
              key: "黑点_3~2",
              dataIndex: "黑点_3~2",
              width: 60,
            },
            {
              title: "≤2",
              key: "黑点_≤2",
              dataIndex: "黑点_≤2",
              width: 60,
            },
          ],
        },
        {
          title: "气泡",
          children: [
            {
              title: ">3",
              key: "气泡_>3",
              dataIndex: "气泡_>3",
              width: 60,
            },
            {
              title: "3~2",
              key: "气泡_3~2",
              dataIndex: "气泡_3~2",
              width: 60,
            },
            {
              title: "2~1",
              key: "气泡_2~1",
              dataIndex: "气泡_2~1",
              width: 60,
            },
          ],
        },
        {
          title: "",
          children: [
            {
              title: "≤3",
              key: "≤3",
              dataIndex: "≤3",
              width: 60,
            },
          ],
        },
      ],
    },
  ];
  const pagination = () => {
    return {
      position: ["bottomCenter"],
      total: tb_data.length,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
      defaultPageSize: 10,
    };
  };
  return (
    <Table
      size="small"
      columns={columns}
      dataSource={tb_data}
      bordered
      scroll={{
        x: "max-content",
      }}
      pagination={pagination()}
    />
  );
}

export default EngineerChecklist;
