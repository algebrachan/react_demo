import React, { useState, useEffect } from "react";
import { CommonCard } from "../../../../../../components/CommonCard";
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
  Upload,
  Image,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { dateFormat, timeFormat } from "../../../../../../utils/string";
import {
  qmsStep5AddEmptyItem,
  qmsStep5Confirm,
  qmsStep5DeleteItem,
  qmsStep5EditItem,
} from "../../../../../../apis/qms_router";

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

const ImageUpload = ({ fileList = [], setFileList = () => {} }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPeviewImage] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPeviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, []);
  return (
    <>
      <Upload
        listType="picture-card"
        accept="image/*"
        maxCount={1}
        fileList={fileList}
        beforeUpload={(file) => {
          // 对图片的大小做限制
          if (file.size > 1024 * 1024 * 10) {
            message.error("图片大小不能超过10MB");
            return false;
          }
          // 生成临时的url链接
          let imageUrl = URL.createObjectURL(file);
          setImageUrl(imageUrl);
          file.url = imageUrl;
          setFileList([file]);
          return false; // 阻止自动上传
        }}
        onRemove={(file) => {
          setFileList([]);
          setImageUrl(null);
        }}
        onPreview={handlePreview}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPeviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

function ExecutionTrack({ id = "", data = null, refresh = () => {} }) {
  const [form] = Form.useForm();
  const [tb_data, setTbData] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [save_load, setSaveLoad] = useState(false);
  const addClassify = () => {
    qmsStep5AddEmptyItem(
      { review_id: id },
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          refresh();
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
      defaultPageSize: 20,
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
    qmsStep5DeleteItem(
      { review_id: id, item_id: record["item_id"] },
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          message.success("删除成功");
          refresh();
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
      const row = await form.validateFields();
      row["item_id"] = item_id;
      row["review_id"] = id;
      const formData = new FormData();
      formData.append("request_data", JSON.stringify(row));
      if (fileList.length > 0 && fileList[0]["uid"] !== "-1") {
        formData.append("image", fileList[0]);
      }
      // 请求
      qmsStep5EditItem(
        formData,
        (res) => {
          setEditingKey("");
          const { data, code, msg } = res.data;
          if (code === 0 && data) {
            message.success("提交成功");
            refresh();
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
          return <ImageUpload fileList={fileList} setFileList={setFileList} />;
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
    // {
    //   title: "操作",
    //   dataIndex: "操作",
    //   width: 100,
    //   fixed: "right",
    //   render: (_, record) => {
    //     const editable = isEditing(record);
    //     return editable ? (
    //       <Space>
    //         <Button
    //           loading={save_load}
    //           type="link"
    //           style={{ padding: 5 }}
    //           onClick={() => save(record.item_id)}
    //         >
    //           保存
    //         </Button>
    //         <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
    //           <a>取消</a>
    //         </Popconfirm>
    //       </Space>
    //     ) : (
    //       <Space>
    //         <Button
    //           type="link"
    //           disabled={editingKey !== ""}
    //           style={{ padding: 5 }}
    //           onClick={() => edit(record)}
    //         >
    //           编辑
    //         </Button>
    //         <Popconfirm
    //           title="警告"
    //           description="确认删除该条数据?"
    //           onConfirm={() => del(record)}
    //           okText="确认"
    //           cancelText="取消"
    //         >
    //           <Button
    //             disabled={editingKey !== ""}
    //             style={{ padding: 5 }}
    //             type="link"
    //             danger
    //           >
    //             删除
    //           </Button>
    //         </Popconfirm>
    //       </Space>
    //     );
    //   },
    // },
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
    qmsStep5Confirm(
      { review_id: id },
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          message.success("提交成功");
          refresh();
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
    if (data) {
      let temp = data.map((item, index) => {
        return {
          key: index + 1,
          ...item,
        };
      });
      setTbData(temp);
    }
  }, [data]);
  return (
    <CommonCard name="不合格处置执行跟踪">
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
          scroll={{ x: "max-content", y: 300 }}
        />
      </Form>
      <Flex justify="end" style={{ marginTop: 10 }}>
        <Button type="primary" onClick={submit} disabled>
          确认
        </Button>
      </Flex>
    </CommonCard>
  );
}

export default ExecutionTrack;
