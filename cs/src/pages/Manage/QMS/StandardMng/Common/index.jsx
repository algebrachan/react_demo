import React, { useState, useEffect } from "react";
import { Button, Table, Image, Space, Input, Upload, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { selectList2Option } from "../../../../../utils/string";

export const EditTable = ({
  title,
  add_name = "添加",
  columns_text = [],
  dataSource = [],
  setTbData = () => {},
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
      newRow[item] = "";
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
          />
        ) : (
          <Select
            style={{ width: "100%" }}
            value={text}
            options={selectList2Option(["OK", "NG"])}
            onChange={(val) => handleTableChange(val, item, index)}
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
          <Button type="link" danger onClick={() => handleDelete(record.key)}>
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
        <Button onClick={handleAddRow} icon={<PlusOutlined />}>
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
