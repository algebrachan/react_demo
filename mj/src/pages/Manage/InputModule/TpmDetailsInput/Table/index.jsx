import React, { useEffect, useState } from "react";
import { GeneralCard } from "../../../../../components/CommonCard";
import {
  DatePicker,
  Form,
  InputNumber,
  Select,
  Table,
  Input,
  Popconfirm,
  Space,
  Button,
  message,
  Image,
} from "antd";
import "./tb.less";
import dayjs from "dayjs";
import { dateFormat, selectList2Option } from "../../../../../utils/string";
import { useSelector } from "react-redux";
import {
  deleteTpmDetails,
  insertShutdownInfomations,
  updateTpmDetails,
} from "../../../../../apis/tpm_api";
import { ImageUpload } from "../Form";
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
  const tpm_details_opt = useSelector((state) => state.mng.tpm_details_opt);
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
      case "image":
        temp = "";
        break;
      case "select":
        temp = (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
          >
            <Select options={selectList2Option(tpm_details_opt[dataIndex])} />
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
export const TpmDetailsTable = ({ data = [], requestData }) => {
  const [form] = Form.useForm();
  const [tb_data, setTbData] = useState([]);
  const [fileList1, setFileList1] = useState([]);
  const [fileList2, setFileList2] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [save_load,setSaveLoad] = useState(false);
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
    const { 照片 = "", 整改照片 = "", ...newRecord } = record;
    form.setFieldsValue(newRecord);
    setFileList1(照片?[
      {
        uid: "-1",
        name: "image.png",
        status: "done",
        url: 照片,
      },
    ]:[]);
    setFileList2(整改照片?[
      {
        uid: "-1",
        name: "image.png",
        status: "done",
        url: 整改照片,
      },
    ]:[]);
    setEditingKey(record.key);
  };
  const del = (record) => {
    deleteTpmDetails(
      { _id: record["_id"] },
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          message.success("删除成功");
          requestData();
        } else {
          message.error(msg);
        }
      },
      (err) => {
        message.error("提交失败", err);
      }
    );
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (_id) => {
    try {
      const row = await form.validateFields();
      row["_id"] = _id;
      // 请求
      const formData = new FormData();
      formData.append("details", JSON.stringify(row));
      if (fileList1.length > 0) {
        if (fileList1[0].uid !== '-1') {
          formData.append("image_1", fileList1[0]);
        }
      } else {
        const empty = new Blob([],{type:"image/png"});
        formData.append("image_1", empty);
      }
      if (fileList2.length > 0) {
        if (fileList2[0].uid !== '-1') {
          formData.append("image_2", fileList2[0]);
        }
      } else {
        const empty = new Blob([],{type:"image/png"});
        formData.append("image_2", empty);
      }
      setSaveLoad(true)
      updateTpmDetails(
        formData,
        (res) => {
          const { data, code, msg } = res.data;
          setSaveLoad(false)
          setEditingKey("");
          if (code === 0 && data) {
            message.success("提交成功");
            requestData();
          } else {
            message.error(msg);
          }
        },
        () => {
          setSaveLoad(false)
          setEditingKey("");
          message.error("提交失败");
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
      title: "日期",
      dataIndex: "日期",
      width: 120,
      inputType: "date",
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
      title: "机台",
      dataIndex: "机台",
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
      title: "描述",
      dataIndex: "描述",
      width: 100,
      inputType: "text",
      editable: true,
    },
    {
      title: "照片",
      dataIndex: "照片",
      width: 100,
      inputType: "image",
      editable: false,
      render: (url, record) => {
        const editable = isEditing(record);
        console.log(editable);
        if (editable) {
          return (
            <ImageUpload fileList={fileList1} setFileList={setFileList1} />
          );
        } else {
          return url && <Image width={100} src={url} loading="lazy" />;
        }
      },
    },
    {
      title: "整改措施",
      dataIndex: "整改措施",
      width: 100,
      inputType: "text",
      editable: true,
    },
    {
      title: "整改照片",
      dataIndex: "整改照片",
      width: 100,
      inputType: "image",
      editable: false,
      render: (url, record) => {
        const editable = isEditing(record);
        if (editable) {
          return (
            <ImageUpload fileList={fileList2} setFileList={setFileList2} />
          );
        } else {
          return url && <Image width={100} src={url} loading="lazy" />;
        }
      },
    },
    {
      title: "整改日期",
      dataIndex: "整改日期",
      width: 120,
      inputType: "date",
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
      title: "是否完成",
      dataIndex: "是否完成",
      width: 100,
      inputType: "select",
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
            loading={save_load}
              type="link"
              style={{ padding: 5 }}
              onClick={() => save(record._id)}
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
    <GeneralCard name="TPM活动明细">
      <div style={{ padding: 5 }}>
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
            scroll={{ x: "max-content" }}
          />
        </Form>
      </div>
    </GeneralCard>
  );
};
