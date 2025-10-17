import React, { useEffect, useState } from "react";
import { GeneralCard } from "../../../../../components/CommonCard";
import {
  DatePicker,
  Form,
  InputNumber,
  Select,
  Table,
  Input,
  Typography,
  Popconfirm,
  Space,
  Button,
  message,
} from "antd";
import "./tb.less";
import { redirect } from "react-router-dom";
import dayjs from "dayjs";
import { dateFormat, selectList2Option } from "../../../../../utils/string";
import { useSelector } from "react-redux";
import {
  insertShutdownInfomations,
  insertTpmInfomations,
} from "../../../../../apis/tpm_api";
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const tpm_opt = useSelector((state) => state.mng.tpm_opt);
  const getInputNode = () => {
    let temp = "";
    switch (inputType) {
      case "number":
        temp = (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
          >
            <InputNumber />
          </Form.Item>
        );
        break;
      case "select":
        temp = (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
          >
            <Select options={selectList2Option(tpm_opt[dataIndex])} />
          </Form.Item>
        );
        break;
      case "date":
        temp = (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            getValueProps={(value) => {
              return {
                value: value && dayjs(value),
              };
            }}
            normalize={(value) => value && dayjs(value).format(dateFormat)}
          >
            <DatePicker allowClear={false} />
          </Form.Item>
        );
        break;
      default:
        temp = (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
          >
            <Input.TextArea autoSize />
          </Form.Item>
        );
        break;
    }
    return temp;
  };
  return <td {...restProps}>{editing ? getInputNode() : children}</td>;
};
export const Table1 = ({ data = [] }) => {
  const [form] = Form.useForm();
  const [tb_data, setTbData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const pagination = () => {
    return {
      position: ["bottomCenter"],
      total: tb_data.length,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
      defaultPageSize: 20,
      onChange: cancel,
    };
  };
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };
  const del = (record) => {
    insertShutdownInfomations(
      { op: 2, data: { id: record.id } },
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          message.success("删除成功");
          let newData = tb_data.filter((item) => item.key !== record.key);
          setTbData(newData);
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("提交失败");
      }
    );
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...tb_data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        row["id"] = item["id"];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        // 请求
        insertShutdownInfomations(
          { op: 1, data: row },
          (res) => {
            setEditingKey("");
            const { code, data, msg } = res.data;
            if (code === 0 && data) {
              message.success("修改成功");
              setTbData(newData);
            } else {
              message.error(msg);
            }
          },
          () => {
            setEditingKey("");
            message.error("提交失败");
          }
        );
      } else {
        newData.push(row);
        setTbData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: "序号",
      dataIndex: "key",
      width: 50,
      editable: false,
    },
    {
      title: "日期",
      dataIndex: "日期",
      width: 130,
      inputType: "date",
      editable: true,
    },
    {
      title: "机台",
      dataIndex: "机台",
      width: 100,
      inputType: "select",
      editable: true,
    },
    {
      title: "班次",
      dataIndex: "班次",
      width: 100,
      inputType: "select",
      editable: true,
    },
    {
      title: "类别",
      dataIndex: "类别",
      width: 100,
      inputType: "select",
      editable: true,
    },
    {
      title: "停机原因",
      dataIndex: "停机原因",
      width: 150,
      inputType: "select",
      editable: true,
    },
    {
      title: "处理方法",
      dataIndex: "处理方法",
      width: 150,
      inputType: "text",
      editable: true,
    },
    {
      title: "停机时间(H)",
      dataIndex: "停机时间",
      width: 100,
      inputType: "number",
      editable: true,
    },
    {
      title: "影响产量数",
      dataIndex: "影响产量数",
      width: 100,
      inputType: "number",
      editable: true,
    },
    {
      title: "备注",
      dataIndex: "备注",
      width: 100,
      inputType: "text",
      editable: true,
    },
    {
      title: "部门",
      dataIndex: "部门",
      width: 100,
      inputType: "select",
      editable: true,
    },
    {
      title: "提交人",
      dataIndex: "提交人",
      width: 100,
      inputType: "text",
      editable: true,
    },
    {
      title: "操作",
      dataIndex: "操作",
      width: 120,
      fixed: "right",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button
              type="link"
              style={{ padding: 5 }}
              onClick={() => save(record.key)}
            >
              保存
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </Space>
        ) : (
          <Space>
            <Button
              type="link"
              disabled={editingKey !== ""}
              style={{ padding: 5 }}
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
                disabled={editingKey !== ""}
                style={{ padding: 5 }}
                type="link"
                danger
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  useEffect(() => {
    setTbData(data);
  }, [data]);
  return (
    <GeneralCard name="机台停机时间明细">
      <div style={{ height: 300, padding: 5 }}>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={tb_data}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={pagination()}
            size="small"
            scroll={{ y: 200, x: "max-content" }}
          />
        </Form>
      </div>
    </GeneralCard>
  );
};
export const Table2 = ({ data = [] }) => {
  const [form] = Form.useForm();
  const [tb_data, setTbData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const pagination = () => {
    return {
      position: ["bottomCenter"],
      total: tb_data.length,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
      defaultPageSize: 20,
      onChange: cancel,
    };
  };
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };
  const del = (record) => {
    insertTpmInfomations(
      { op: 2, data: { id: record.id } },
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          message.success("删除成功");
          let newData = tb_data.filter((item) => item.key !== record.key);
          setTbData(newData);
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("提交失败");
      }
    );
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...tb_data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        row["id"] = item["id"];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        // 请求
        insertTpmInfomations(
          { op: 1, data: row },
          (res) => {
            setEditingKey("");
            const { code, data, msg } = res.data;
            if (code === 0 && data) {
              message.success("修改成功");
              setTbData(newData);
            } else {
              message.error(msg);
            }
          },
          () => {
            setEditingKey("");
            message.error("提交失败");
          }
        );
      } else {
        newData.push(row);
        setTbData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: "序号",
      dataIndex: "key",
      width: 50,
      editable: false,
    },
    {
      title: "日期",
      dataIndex: "日期",
      width: 130,
      inputType: "date",
      editable: true,
    },
    {
      title: "卫生",
      dataIndex: "卫生",
      width: 100,
      inputType: "text",
      editable: true,
    },
    {
      title: "定制定位",
      dataIndex: "定制定位",
      width: 100,
      inputType: "text",
      editable: true,
    },
    {
      title: "老化破损",
      dataIndex: "老化破损",
      width: 100,
      inputType: "text",
      editable: true,
    },
    {
      title: "安全",
      dataIndex: "安全",
      width: 100,
      inputType: "text",
      editable: true,
    },
    {
      title: "生锈腐蚀",
      dataIndex: "生锈腐蚀",
      width: 100,
      inputType: "text",
      editable: true,
    },
    {
      title: "跑冒滴漏",
      dataIndex: "跑冒滴漏",
      width: 100,
      inputType: "text",
      editable: true,
    },
    {
      title: "设备维护",
      dataIndex: "设备维护",
      width: 100,
      inputType: "text",
      editable: true,
    },
    {
      title: "质量改善",
      dataIndex: "质量改善",
      width: 100,
      inputType: "text",
      editable: true,
    },
    {
      title: "成本",
      dataIndex: "成本",
      width: 100,
      inputType: "text",
      editable: true,
    },
    {
      title: "部门",
      dataIndex: "部门",
      width: 100,
      inputType: "select",
      editable: true,
    },
    {
      title: "工序",
      dataIndex: "工序",
      width: 100,
      inputType: "select",
      editable: true,
    },
    {
      title: "提交人",
      dataIndex: "提交人",
      width: 100,
      inputType: "text",
      editable: true,
    },
    {
      title: "操作",
      dataIndex: "操作",
      width: 120,
      fixed: "right",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button
              type="link"
              style={{ padding: 5 }}
              onClick={() => save(record.key)}
            >
              保存
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </Space>
        ) : (
          <Space>
            <Button
              type="link"
              disabled={editingKey !== ""}
              style={{ padding: 5 }}
              onClick={() => edit(record)}
            >
              编辑
            </Button>
            <Button
              type="link"
              disabled={editingKey !== ""}
              danger
              style={{ padding: 5 }}
              onClick={() => del(record)}
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  useEffect(() => {
    setTbData(data);
  }, [data]);
  return (
    <GeneralCard name="TPM活动问题">
      <div style={{ height: 300, padding: 5 }}>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={tb_data}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={pagination()}
            size="small"
            scroll={{ y: 200, x: "max-content" }}
          />
        </Form>
      </div>
    </GeneralCard>
  );
};
export const Table3 = ({ data }) => {
  const [tb_data, setTbData] = useState([]);
  const columns = [
    {
      title: "周期",
      dataIndex: "周期",
      key: "周期",
      width: 100,
    },
    {
      title: "设备运行时间/h",
      dataIndex: "设备运行时间/h",
      key: "设备运行时间/h",
      width: 100,
    },
    {
      title: "故障停机时间/h",
      dataIndex: "故障停机时间/h",
      key: "故障停机时间/h",
      width: 100,
    },
    {
      title: "故障停机率",
      dataIndex: "故障停机率",
      key: "故障停机率",
      width: 100,
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
  useEffect(() => {
    setTbData(data);
  }, [data]);
  return (
    <GeneralCard name="设备故障停机率">
      <div style={{ height: 320, padding: 5 }}>
        <Table
          bordered
          dataSource={tb_data}
          columns={columns}
          pagination={pagination()}
          size="small"
          scroll={{ y: 200, x: "max-content" }}
        />
      </div>
    </GeneralCard>
  );
};

export const Table4 = ({ data = {} }) => {
  const [tb_data, setTbData] = useState([]);
  const [summary, setSummary] = useState({});
  const columns = [
    {
      title: "类别",
      children: [
        {
          title: "周期",
          dataIndex: "周期",
          key: "周期",
          width: 180,
        },
      ],
    },
    {
      title: "6S",
      children: [
        {
          title: "卫生",
          dataIndex: "卫生",
          key: "卫生",
          width: 50,
        },
        {
          title: "定制定位",
          dataIndex: "定制定位",
          key: "定制定位",
          width: 75,
        },
        {
          title: "老化破损",
          dataIndex: "老化破损",
          key: "老化破损",
          width: 75,
        },
        {
          title: "安全",
          dataIndex: "安全",
          key: "安全",
          width: 50,
        },
      ],
    },
    {
      title: "设备",
      children: [
        {
          title: "生锈腐蚀",
          dataIndex: "生锈腐蚀",
          key: "生锈腐蚀",
          width: 75,
        },
        {
          title: "跑冒滴漏",
          dataIndex: "跑冒滴漏",
          key: "跑冒滴漏",
          width: 75,
        },
        {
          title: "设备维护",
          dataIndex: "设备维护",
          key: "设备维护",
          width: 75,
        },
      ],
    },
    {
      title: "其他",
      children: [
        {
          title: "质量改善",
          dataIndex: "质量改善",
          key: "质量改善",
          width: 75,
        },
        {
          title: "成本",
          dataIndex: "成本",
          key: "成本",
          width: 50,
        },
      ],
    },
    {
      title: "合计",
      dataIndex: "合计",
      key: "合计",
      width: 60,
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
  useEffect(() => {
    const { data_list = [], 总计 } = data;
    setTbData(data_list);
    setSummary(总计);
  }, [data]);
  return (
    <GeneralCard name="每周TPM活动问题对比">
      <div style={{ height: 360, padding: 5 }}>
        <Table
          bordered
          dataSource={tb_data}
          columns={columns}
          pagination={pagination()}
          size="small"
          scroll={{ y: 200, x: "max-content" }}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} fixed="left">
                  合计
                </Table.Summary.Cell>
                {summary &&
                  [
                    "卫生",
                    "定制定位",
                    "老化破损",
                    "安全",
                    "生锈腐蚀",
                    "跑冒滴漏",
                    "设备维护",
                    "质量改善",
                    "成本",
                    "合计",
                  ].map((item, _) => (
                    <Table.Summary.Cell key={_} index={_} fixed="right">
                      {summary[item]}
                    </Table.Summary.Cell>
                  ))}
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>
    </GeneralCard>
  );
};
