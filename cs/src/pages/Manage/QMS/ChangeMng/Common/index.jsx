import React, {useState} from 'react';
import {Button, Table} from "antd"
import {PlusOutlined} from '@ant-design/icons';
import {Space} from 'antd';
import {Input} from 'antd';

export const EditTable = ({title, add_name = "添加", columns_text = [], dataSource = [], setTbData = () => { }}) => {
  const isObjectStrict = (value) => {
    return Object.prototype.toString.call(value) === '[object Object]';
  }
  const handleTableChange = (value, field, index) => {
    const newData = [...dataSource];
    if (newData[index]) {
      newData[index][field] = value;
      setTbData(newData);
    }
  };
  const handleAddRow = () => {
    const newRow = {key: Date.now().toString()};
    columns_text.forEach((item) => {
      if (isObjectStrict(item)) {
        const {dataIndex} = item
        newRow[dataIndex] = '';
      } else newRow[item] = '';
    });
    setTbData([...dataSource, newRow]);
  };
  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setTbData(newData);
  };
  const columns = [
    {
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 80,
      render: (_, __, index) => index + 1,
    },
    ...columns_text.map((item) => {
      let title, dataIndex;
      if (isObjectStrict(item)) {
        const {dataIndex: itemDataIndex, title: itemTitle} = item
        title = itemTitle;
        dataIndex = itemDataIndex;
      } else {
        title = item;
        dataIndex = item;
      }
      return {
        title,
        dataIndex,
        key: dataIndex,
        width: 200,
        render: (text, record, index) => <Input
          style={{width: "100%"}}
          value={text}
          onChange={(e) =>
            handleTableChange(e.target.value, dataIndex, index)
          }
        />,
      }
    }),
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" danger onClick={() => handleDelete(record.key)}>删除</Button>
        </Space>
      )
    }
  ];
  return <Table
    title={title}
    size="small"
    columns={columns}
    dataSource={dataSource}
    bordered
    pagination={false}
    footer={() => (
      <Button onClick={handleAddRow} icon={<PlusOutlined />}>{add_name}</Button>
    )}
  />
}
