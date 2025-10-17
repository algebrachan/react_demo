import React, { useEffect, useState } from "react";
import {
  Button,
  Collapse,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Select,
  Space,
  Table,
} from "antd";
import dayjs from "dayjs";
import { dateFormat, selectList2Option } from "../../../../../../utils/string";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { RecommendedComp, StatusGreen, StatusRed } from "./common";
import {
  addCountermeasure,
  confirmCountermeasure,
  confirmImplementation,
  deleteCountermeasure,
  editCountermeasure,
  getCountermeasure,
} from "../../../../../../apis/ocap_api";
import { CommonCard } from "../../../../../../components/CommonCard";

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
  const opt = {
    实施人: ["admin", "liheng", "wangchen"],
  };
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
            <Select options={selectList2Option(opt[dataIndex])} />
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

// 处理对策
const ChildMeasure = React.memo(
  ({ id = "", department = "", obj = {}, requestData }) => {
    const [tb_data, setTbData] = useState([]);
    const [text, setText] = useState("");
    const [editingKey, setEditingKey] = useState("");

    const [form] = Form.useForm();
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
      deleteCountermeasure(
        { _id: id, sub_id: record.sub_id, 部门: department },
        (res) => {
          const { code, data, msg } = res.data;
          if (code === 0 && data) {
            requestData();
            message.success("删除成功");
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
          row["sub_id"] = item["sub_id"];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          // 请求
          editCountermeasure(
            { _id: id, 部门: department, ...row },
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
        title: "编号",
        dataIndex: "key",
        key: "key",
        width: 100,
        editable: false,
        render: (x) => x + 1,
      },
      {
        title: "对策内容",
        dataIndex: "对策内容",
        key: "对策内容",
        inputType: "text",
        editable: true,
        render: (x) => (
          <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
            {x}
          </div>
        ),
      },
      {
        title: "截止时间",
        dataIndex: "截止时间",
        key: "截止时间",
        width: 150,
        inputType: "date",
        editable: true,
      },
      {
        title: "实施人",
        dataIndex: "实施人",
        key: "实施人",
        width: 200,
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
                  icon={<DeleteOutlined />}
                >
                  删除
                </Button>
              </Popconfirm>
              <Button
                type="link"
                disabled={editingKey !== ""}
                style={{ padding: 5 }}
                onClick={() => edit(record)}
                icon={<EditOutlined />}
              >
                编辑
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
    const measure_arr = [
      "适当缩减熔融时间，减少B部厚度移动",
      "优化工艺，对电极开闭进行补偿",
    ];
    const addMeasure = () => {
      addCountermeasure(
        { _id: id, 部门: department },
        (res) => {
          const { data, code, msg } = res.data;
          if (code === 0 && data) {
            message.success("添加成功！");
            requestData();
          } else {
            message.error(msg);
          }
        },
        () => {
          message.error("添加失败，请稍后再试！");
        }
      );
    };
    const comfirmMeasure = () => {
      confirmCountermeasure(
        { _id: id, 部门: department },
        (res) => {
          const { code, data, msg } = res.data;
          if (code === 0 && data) {
            message.success(msg);
            requestData();
          } else {
            message.error(msg);
          }
        },
        () => {
          message.error("提交失败");
        }
      );
    };
    const comfirmDealwith = () => {
      confirmImplementation(
        {
          _id: id,
          部门: department,
          实施结果: text.trim(),
        },
        (res) => {
          const { code, data, msg } = res.data;
          if (code === 0 && data) {
            message.success(msg);
            requestData();
          } else {
            message.error(msg);
          }
        },
        () => {
          message.error("提交失败");
        }
      );
    };
    const useReson = (_) => {
      console.log(measure_arr[_]);
    };
    useEffect(() => {
      if (Object.keys(obj).length > 0) {
        const { data_list, result } = obj;
        setTbData(data_list);
        setText(result);
      }
    }, [obj]);
    return (
      <Flex vertical gap={5}>
        <Flex justify="end">
          <Button type="link" icon={<PlusOutlined />} onClick={addMeasure}>
            新增对策
          </Button>
        </Flex>
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
            scroll={{ y: 300, x: "max-content" }}
          />
        </Form>
        <RecommendedComp arr={measure_arr} useReson={useReson} />
        <Flex justify="end">
          <Button type="primary" onClick={comfirmMeasure}>
            确认
          </Button>
        </Flex>
        <div className="ocap_title">对策实施结果</div>
        <Input.TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoSize={{ minRows: 3, maxRows: 6 }}
          style={{ background: "#FAFAFA" }}
          placeholder="请输入"
        />
        <Flex justify="end">
          <Button type="primary" onClick={comfirmDealwith}>
            确认
          </Button>
        </Flex>
      </Flex>
    );
  }
);
function Countermeasure({ id = "" }) {
  const [data, setData] = useState({});
  const [collapse_items, setCollapseItems] = useState([]);
  const requestData = () => {
    getCountermeasure({ _id: id }, (res) => {
      const { data, code, msg } = res.data;
      if (code === 0 && data) {
        setData(data);
      } else {
        setData({});
      }
    });
  };
  useEffect(() => {
    let measure_list = Object.keys(data);
    if (measure_list.length > 0) {
      let colp_list = [];
      measure_list.forEach((item) => {
        const {
          data_list = [],
          result = "",
          measure_status = false,
        } = data[item];
        // 需要一个决策状态
        colp_list.push({
          key: item,
          label: (
            <Flex gap={10} align="center">
              <div className="ocap_title">{item}</div>
              {measure_status ? (
                <StatusGreen text="决策已填写" />
              ) : (
                <StatusRed text="决策未填写" />
              )}
              {result.trim() ? (
                <StatusGreen text="实验结果" />
              ) : (
                <StatusRed text="无实验结果" />
              )}
            </Flex>
          ),
          children: (
            <ChildMeasure
              id={id}
              department={item.slice(0, 2)}
              obj={{ data_list: data_list, result: result }}
              requestData={requestData}
            />
          ),
        });
      });
      setCollapseItems(colp_list);
    }
  }, [data]);
  useEffect(() => {
    if (id) {
      requestData();
    }
  }, [id]);
  return (
    <CommonCard name="处理对策">
      <Flex vertical gap={10} className="ocap_reason_root">
        <Collapse
          defaultActiveKey={["现场对策", "工艺对策", "设备对策", "质量对策"]}
          ghost
          items={collapse_items}
        />
      </Flex>
    </CommonCard>
  );
}

export default Countermeasure;
