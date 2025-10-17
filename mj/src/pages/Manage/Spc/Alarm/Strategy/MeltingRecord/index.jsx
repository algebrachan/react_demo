import { Table } from "antd";
import React from "react";

function MeltingRecord({ tb_data = [{ key: 0 }] }) {
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
  const generateColumns = () => {
    let columns = [
      "批号",
      "原始图号",
      "图号",
      "作业时间",
      "班次",
      "熔融机号",
      "班长",
      "主操",
      "副操",
      "英寸",
      "型号",
      "底座编码",
    ].map((e, _) => {
      let col = {
        title: e,
        dataIndex: e,
        key: e,
      };
      return col;
    });
    columns.unshift({
      title: "序号",
      dataIndex: "key",
      key: "key",
      render: (x) => x + 1,
    });

    return columns;
  };
  return (
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
  );
}

export default MeltingRecord;
