import React, {useEffect, useMemo, useState} from 'react';
import {Button, InputNumber, Radio, Select, Table} from "antd"
import {PlusOutlined} from '@ant-design/icons';
import {Space} from 'antd';
import {Input, DatePicker} from 'antd';
import dayjs from 'dayjs'
import MultiSelect from '@/components/CustomSeries/MultiSelect.jsx'

export const EditTable = (
  {
    title,
    isOperate = true,
    operateNode = [{type: 'add'}],
    isDisabled = false,
    add_name = "添加",
    columns_text = [],
    dataSource = [],
    setTbData = () => { },
    tableProps = {},
    handleAddRow
  }
) => {
  const handleTableChange = (value, field, index) => {
    const newData = [...dataSource];
    if (newData[index]) {
      newData[index][field] = value;
      setTbData(newData);
    }
  };
  const operateNodeMap = {
    add: <Button icon={<PlusOutlined />} onClick={() => {
      if (typeof handleAddRow === 'function') handleAddRow()
      else {
        const newRow = {key: Date.now().toString()};
        columns_text.forEach((item) => {
          const {dataIndex, type} = item
          newRow[dataIndex] = type === 'MultiSelect' || type === 'DatePicker.RangePicker' ? [] : '';
        });
        setTbData([...dataSource, newRow]);
      }
    }}>{add_name}</Button>
  }
  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setTbData(newData);
  };
  const columns = useMemo(() => {
    const operateColumn = isOperate ?
      [{
        title: '操作',
        dataIndex: 'action',
        width: 100,
        render: (_, record) => (
          <Space size="middle">
            <Button type="link" danger onClick={() => handleDelete(record.key)}>删除</Button>
          </Space>
        )
      }] :
      []
    return [
      {
        title: "序号",
        dataIndex: "key",
        width: 80,
        render: (_, __, index) => index + 1,
      },
      ...columns_text.map((item) => {
        let {dataIndex, title, width, type = 'Input', props = {}, disabled = false} = item
        return {
          title,
          dataIndex,
          width,
          render: (text, record, index) => {
            const myProps = typeof props === 'function' ? props(text, record, index) : props
            const {showCell = true, ...rest} = myProps
            if (type === 'Input') {
              return showCell && <Input
                disabled={isDisabled || disabled}
                style={{width: "100%"}}
                value={text}
                onChange={(e) => handleTableChange(e.target.value, dataIndex, index)}
                {...rest}
              />
            } else if (type === 'InputNumber') {
              return showCell && <InputNumber
                disabled={isDisabled || disabled}
                style={{width: "100%"}}
                value={text}
                onChange={(e) => handleTableChange(e, dataIndex, index)}
                {...rest}
              />
            } else if (type === 'TextArea') {
              return showCell && <Input.TextArea
                disabled={isDisabled || disabled}
                style={{width: "100%"}}
                value={text}
                onChange={(e) => handleTableChange(e.target.value, dataIndex, index)}
                {...rest}
              />
            } else if (type === 'Radio.Group') {
              return showCell && <Radio.Group
                disabled={isDisabled || disabled}
                style={{width: "100%"}}
                value={text}
                onChange={(e) => handleTableChange(e.target.value, dataIndex, index)}
                {...rest}
              />
            } else if (type === 'Select') {
              return showCell && <Select
                disabled={isDisabled || disabled}
                style={{width: "100%"}}
                value={text}
                onChange={(e) => handleTableChange(e, dataIndex, index)}
                {...rest}
              />
            } else if (type === 'MultiSelect') {
              return showCell && <MultiSelect
                showCheckAll
                disabled={isDisabled || disabled}
                style={{width: "100%"}}
                value={text}
                onChange={(e) => handleTableChange(e, dataIndex, index)}
                {...rest}
              />
            } else if (type === 'DatePicker') {
              return showCell && <DatePicker
                disabled={isDisabled || disabled}
                showTime
                style={{width: "100%"}}
                onChange={(value, dateString) => handleTableChange(dateString, dataIndex, index)}
                value={text ? dayjs(text) : null}
                {...rest}
              />
            } else if (type === 'DatePicker.RangePicker') {
              return showCell && <DatePicker.RangePicker
                disabled={isDisabled || disabled}
                showTime
                style={{width: "100%"}}
                value={text ? text.map(date => dayjs(date)) : []}
                onChange={(value, dateString) => handleTableChange(dateString, dataIndex, index)}
                {...rest}
              />
            }
          },
        }
      }),
      ...operateColumn
    ]
  }, [columns_text, isOperate]);
  return (
    <Table
      title={title}
      size="small"
      columns={columns}
      scroll={{x: 'max-content'}}
      dataSource={dataSource}
      bordered
      pagination={false}
      footer={() => isOperate && operateNode.map((item) => operateNodeMap[item.type] || item)}
      {...tableProps}
    />
  )
}
