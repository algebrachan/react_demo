import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Image,
  Space,
  Input,
  Upload,
  Select,
  Form,
  InputNumber,
  DatePicker,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { selectList2Option } from "@/utils/string";
import dayjs from "dayjs";
import { AutoComplete } from "antd";

export const EditTable = ({
  title,
  add_name = "添加",
  columns_text = [],
  dataSource = [],
  setTbData = () => {},
  disabled = false,
}) => {
  const handleTableChange = (value, field, index) => {
    const newData = [...dataSource];
    if (newData[index]) {
      newData[index][field] = value;
      setTbData(newData);
    }
  };

  const handleAddRow = () => {
    const newRow = { key: Date.now().toString() };
    columns_text.forEach((item) => {

      newRow[item] = item==="产品编码"? "" : "OK";
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
      width: 60,
      render: (_, __, index) => index + 1,
    },
    ...columns_text.map((item) => ({
      title: item,
      dataIndex: item,
      key: item,
      width: 200,
      render: (text, record, index) => {
        return item === "产品编码" ? (
          <Input
            style={{ width: "100%" }}
            value={text}
            onChange={(e) => handleTableChange(e.target.value, item, index)}
            disabled={disabled}
          />
        ) : (
          <Select
            style={{ width: "100%" }}
            value={text}
            options={selectList2Option(["OK", "NG"])}
            onChange={(val) => handleTableChange(val, item, index)}
            disabled={disabled}
          />
        );
      },
    })),
    {
      title: "操作",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Button
            disabled={disabled}
            type="link"
            danger
            onClick={() => handleDelete(record.key)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      title={title}
      size="small"
      columns={columns}
      dataSource={dataSource}
      bordered
      pagination={false}
      scroll={{ x: "max-content" }}
      footer={() => (
        <Button
          onClick={handleAddRow}
          icon={<PlusOutlined />}
          disabled={disabled}
        >
          {add_name}
        </Button>
      )}
    />
  );
};

export const ImageUpload = ({
  fileList = [],
  setFileData = () => {},
  size = 5,
}) => {
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
        点击上传
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
          if (file.size > size * 1024 * 1024) {
            message.error(`文件大小不能超过${size}MB`);
            return false;
          }
          let imageUrl = URL.createObjectURL(file);
          setImageUrl(imageUrl);
          file.url = imageUrl;
          setFileData([file]);
          return false;
        }}
        onRemove={() => {
          setFileData([]);
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

export const CustomizeEditTable = ({
  title,
  add_name = "添加",
  columns_list = [],
  dataSource = [],
  setTbData = () => {},
  disabled = false,
}) => {
  const handleTableChange = (value, field, index) => {
    const newData = [...dataSource];
    if (newData[index]) {
      newData[index][field] = value;
      setTbData(newData);
    }
  };

  const handleAddRow = () => {
    const newRow = { key: Date.now().toString() };
    columns_list.forEach((item) => {
      newRow[item.name] = "";
    });
    setTbData([...dataSource, newRow]);
  };

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setTbData(newData.map((item, index) => ({ ...item, key: index + 1 })));
  };
  const columns = [
    {
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    ...columns_list.map((item) => ({
      title: item.name,
      dataIndex: item.name,
      key: item,
      name,
      width: 200,
      render: (text, record, index) => (
        <>
          {item.type === "input" && (
            <Input
              style={{ width: "100%" }}
              value={text}
              onChange={(e) =>
                handleTableChange(e.target.value, item.name, index)
              }
            />
          )}
          {item.type === "input_number" && (
            <InputNumber
              style={{ width: "100%" }}
              value={text}
              onChange={(val) => handleTableChange(val, item.name, index)}
            />
          )}
          {item.type === "date" && (
            <DatePicker
              style={{ width: "100%" }}
              value={text && dayjs(text)}
              onChange={(_, dateStr) =>
                handleTableChange(dateStr, item.name, index)
              }
            />
          )}
        </>
      ),
    })),
    {
      title: "操作",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Button
            disabled={disabled}
            type="link"
            danger
            onClick={() => handleDelete(record.key)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      title={title}
      size="small"
      columns={columns}
      dataSource={dataSource}
      bordered
      pagination={false}
      scroll={{ x: "max-content" }}
      footer={() => (
        <Button
          onClick={handleAddRow}
          icon={<PlusOutlined />}
          disabled={disabled}
        >
          {add_name}
        </Button>
      )}
    />
  );
};

export const GenerateFormItem = ({ item }) => {
  return (
    <Form.Item
      label={item.label}
      name={item.name}
      rules={
        item.required
          ? [{ required: true, message: `请输入${item.label}` }]
          : []
      }
      getValueProps={(value) => {
        if (item.type === "date") {
          return {
            value: value ? dayjs(value) : null,
          };
        } else {
          return { value };
        }
      }}
      normalize={(value) => {
        if (item.type === "date") {
          return value?.format(dateFormat);
        } else {
          return value;
        }
      }}
    >
      {item.type === "input" && (
        <Input
          placeholder={item.placeholder || "请输入"}
          disabled={item.disabled}
        />
      )}
      {item.type === "text_area" && (
        <Input.TextArea autoSize disabled={item.disabled} />
      )}
      {item.type === "date" && (
        <DatePicker style={{ width: "100%" }} disabled={item.disabled} />
      )}
      {item.type === "select" && (
        <Select
          placeholder={item.placeholder || "请选择"}
          options={selectList2Option(item.opt)}
          disabled={item.disabled}
        />
      )}
      {item.type === "radio" && (
        <Radio.Group options={item.opt} disabled={item.disabled} />
      )}
      {item.type === "multi_select" && (
        <Select
          mode="multiple"
          maxTagCount="responsive"
          options={selectList2Option(item.opt)}
          disabled={item.disabled}
        />
      )}
      {item.type === "auto_complete" && (
        <AutoComplete
          options={selectList2Option(item.opt)}
          placeholder={item.placeholder || "请选择"}
          disabled={item.disabled}
        />
      )}
    </Form.Item>
  );
};
