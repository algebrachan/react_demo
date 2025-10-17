import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  DatePicker,
  Flex,
  Form,
  message,
  Popconfirm,
  Space,
  Image,
  Card,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { timeFormat, selectList2Option } from "@/utils/string";
import {
  qmsStep5AddEmptyItem,
  qmsStep5Confirm,
  qmsStep5DeleteItem,
  qmsStep5EditItem,
  qmsStep6,
} from "@/apis/qms_router";
import { ImageUpload, FileUpload } from "@/utils/obj";
import { Radio } from "antd";

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
  const getInputNode = () => {
    let temp = "";
    switch (inputType) {
      case "image":
        temp = "";
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
            normalize={(value) => value && dayjs(value).format(timeFormat)}
          >
            <DatePicker showTime allowClear={false} />
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

function UnqualifiedDisposal({
  order_record = {},
  review_data = {},
  requestReview,
}) {
  const [form] = Form.useForm();
  const [id, setId] = useState("");
  const [tb_data, setTbData] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [editingKey, setEditingKey] = useState("");

  const [need_8d, setNeed8d] = useState("");
  const [need_cort, setNeedCort] = useState("");
  const [fileList1, setFileList1] = useState([]);
  const [fileList2, setFileList2] = useState([]);
  const addClassify = () => {
    if (!id) {
      message.warning("请选择编号");
      return;
    }
    qmsStep5AddEmptyItem(
      { review_id: id },
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          requestReview(id);
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };
  const pagination = () => {
    return {
      position: ["bottomCenter"],
      total: tb_data.length,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
      defaultPageSize: 10,
      onChange: cancel,
    };
  };
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    const { image_base64 = "", ...newRecord } = record;
    form.setFieldsValue(newRecord);
    setFileList(
      image_base64
        ? [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: image_base64,
            },
          ]
        : []
    );
    setEditingKey(record.key);
  };
  const del = (record) => {
    if (!id) {
      message.warning("请选择编号");
      return;
    }
    qmsStep5DeleteItem(
      { review_id: id, item_id: record["item_id"] },
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          requestReview(id);
          message.success("删除成功");
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (item_id) => {
    try {
      if (!id) {
        message.warning("请选择编号");
        return;
      }
      const row = await form.validateFields();
      row["item_id"] = item_id;
      row["review_id"] = id;
      const formData = new FormData();
      formData.append("request_data", JSON.stringify(row));
      if (fileList.length > 0 && fileList[0]["uid"] !== "-1") {
        formData.append("image", fileList[0].originFileObj);
      } else if ((fileList.length = 0)) {
        formData.append("image", new Blob([], { type: "text/plain" }));
      } else {
      }
      // 请求
      qmsStep5EditItem(
        formData,
        (res) => {
          setEditingKey("");
          const { data, code, msg } = res.data;
          if (code === 0 && data) {
            requestReview(id);
            message.success("提交成功");
          } else {
            message.error(msg);
          }
        },
        () => {
          setEditingKey("");
          message.error("网络异常");
        }
      );
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
      title: "主要事项",
      dataIndex: "main_item",
      width: 300,
      inputType: "input",
      editable: true,
    },
    {
      title: "责任人",
      dataIndex: "responsible_person",
      width: 120,
      inputType: "input",
      editable: true,
    },
    {
      title: "计划完成时间",
      dataIndex: "planned_completion_time",
      width: 150,
      inputType: "date",
      editable: true,
    },
    {
      title: "实际完成时间",
      dataIndex: "actual_completion_time",
      width: 150,
      inputType: "date",
      editable: true,
    },
    {
      title: "备注",
      dataIndex: "note",
      width: 200,
      inputType: "input",
      editable: true,
    },
    {
      title: "照片",
      dataIndex: "image_base64",
      key: "image_base64",
      width: 100,
      inputType: "image",
      editable: false,
      render: (url, record) => {
        const editable = isEditing(record);
        if (editable) {
          return (
            <ImageUpload
              maxCount={1}
              fileList={fileList}
              setFileList={setFileList}
            />
          );
        } else {
          return (
            url && (
              <Image
                key={record.item_id}
                width={100}
                src={url}
                loading="lazy"
              />
            )
          );
        }
      },
    },
    {
      title: "操作",
      dataIndex: "操作",
      width: 100,
      fixed: "right",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button
              type="link"
              style={{ padding: 5 }}
              onClick={() => save(record.item_id)}
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
  const submit = () => {
    if (!id) {
      message.warning("请选择编号");
      return;
    }
    qmsStep5Confirm(
      { review_id: id },
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          message.success("提交成功");
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };
  const submit8d = () => {
    if (!id) {
      message.warning("请选择编号");
      return;
    }
    if (need_8d === "" || need_cort === "") {
      message.warning("请选择是否需要启动8D和纠正预防措施");
      return;
    }
    let param = {
      review_id: id,
      measures: {
        start_8d: need_8d === "需要",
        start_corrective_preventive: need_cort === "需要",
      },
    };
    const formData = new FormData();
    if (need_8d === "需要") {
      if (fileList1.length === 0) {
        message.warning("请上传8D报告");
        return;
      } else {
        const fileBlob = new Blob([fileList1[0].originFileObj], {
          type: fileList1[0].type,
        });
        formData.append("eight_d_report", fileBlob, fileList1[0].name);
      }
    }
    if (need_cort === "需要") {
      if (fileList2.length === 0) {
        message.warning("请上传纠正预防措施");
        return;
      } else {
        const fileBlob = new Blob([fileList2[0].originFileObj], {
          type: fileList2[0].type,
        });
        formData.append(
          "corrective_measures_plan",
          fileBlob,
          fileList2[0].name
        );
      }
    }
    formData.append("request_data", JSON.stringify(param));

    qmsStep6(
      formData,
      (res) => {
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          message.success("提交成功");
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };

  useEffect(() => {
    setId(order_record["编号"] ?? "");
    const { execution_tracking, corrective_preventive_measures } = review_data;
    if (execution_tracking) {
      let temp = execution_tracking.map((item, index) => {
        return {
          key: index + 1,
          ...item,
        };
      });
      setTbData(temp);
    } else {
      setTbData([]);
    }
    setFileList1([])
    setFileList2([])
    if (corrective_preventive_measures) {
      setNeed8d(corrective_preventive_measures["start_8d"] ? "需要" : "不需要");
      setNeedCort(
        corrective_preventive_measures["start_corrective_preventive"]
          ? "需要"
          : "不需要"
      );
    } else {
      setNeed8d("");
      setNeedCort("");
    }
  }, [order_record, review_data]);
  return (
    <Card>
      <Flex vertical gap={16}>
        <Space>
          <span>编号:</span>
          <Input
            style={{ width: 300 }}
            value={id}
            disabled
            placeholder="请选择编号"
          />
        </Space>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            title={() => (
              <Flex justify="space-between" align="center">
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  不合格处置执行跟踪
                </div>
                <Button
                  type="link"
                  icon={<PlusOutlined />}
                  onClick={addClassify}
                  disabled={editingKey !== ""}
                >
                  新增事项
                </Button>
              </Flex>
            )}
            bordered
            dataSource={tb_data}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={pagination()}
            size="small"
            scroll={{ x: "max-content", y: 300 }}
          />
        </Form>
        <Flex justify="end">
          <Button type="primary" onClick={submit}>
            确认
          </Button>
        </Flex>
        <Flex gap={20}>
          <div className="ocap_title">是否需要启动8D:</div>
          <Radio.Group
            value={need_8d}
            onChange={(e) => setNeed8d(e.target.value)}
            options={selectList2Option(["需要", "不需要"])}
          />
        </Flex>
        {need_8d === "需要" && (
          <FileUpload
            name="上传8D报告"
            fileList={fileList1}
            setFileList={setFileList1}
          />
        )}
        <Flex gap={20}>
          <div className="ocap_title">是否需要启动纠正和预防措施:</div>
          <Radio.Group
            value={need_cort}
            onChange={(e) => setNeedCort(e.target.value)}
            options={selectList2Option(["需要", "不需要"])}
          />
        </Flex>
        {need_cort === "需要" && (
          <FileUpload
            name="上传纠正和预防措施计划"
            fileList={fileList2}
            setFileList={setFileList2}
          />
        )}
        <div>
          <Button type="primary" onClick={submit8d}>
            确认
          </Button>
        </div>
      </Flex>
    </Card>
  );
}

export default UnqualifiedDisposal;
