import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import dayjs from "dayjs"; // 新增时间处理库
import {
  Input,
  DatePicker,
  Form,
  Select,
  Radio,
  Button,
  Upload,
  Image,
  message,
  Table,
  Cascader,
  InputNumber,
  Space,
  Checkbox,
} from "antd"; // 补充antd组件
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { AutoComplete } from "antd";
import { selectList2Option } from "./string";

export const ComputeFormCol = (label_num) => {
  return {
    labelCol: {
      span: label_num,
    },
    wrapperCol: {
      span: 24 - label_num,
    },
  };
};
// 下载链接
export const downloadFile = (url, fileName = "") => {
  const link = document.createElement("a");
  link.href = url;
  link.style.display = "none";
  link.target = "_blank";
  link.download = fileName || "download"; // 可以指定下载的文件名
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
export const base64ToBlob = (base64) => {
  const byteString = atob(base64.split(",")[1]);
  const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};
export const parseRFC5987Filename = (header) => {
  const prefix = "filename*=utf-8''";
  const start = header.indexOf(prefix);
  if (start === -1) {
    const fileNameMatch = header?.match(/filename="([^"]+)"/);
    return fileNameMatch?.[1] || null;
  }

  const encoded = header.slice(start + prefix.length);
  return decodeURIComponent(encoded);
};
// 下载blob文件
export const downloadFileBlob = (res) => {
  const contentDisposition = res.headers["content-disposition"];
  // const fileNameMatch = contentDisposition?.match(/filename="([^"]+)"/);
  const fileName = parseRFC5987Filename(contentDisposition);
  const blob = new Blob([res.data]);
  saveAs(blob, fileName || "未命名文件");
};

export const printBinaryFile = (binaryData, fileType, fileName = "") => {
  console.log("打印二进制文件", binaryData, fileType, fileName);
  try {
    // 创建Blob对象
    const blob =
      binaryData instanceof Blob
        ? binaryData
        : new Blob([binaryData], { type: fileType });

    // 创建临时URL
    const url = URL.createObjectURL(blob);

    // 根据文件类型决定如何打印
    if (fileType === "application/pdf") {
      // 对于PDF，打开新窗口打印
      const printWindow = window.open(url, "_blank");
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
          // 打印后关闭窗口
          // setTimeout(() => {
          //   printWindow.close();
          //   URL.revokeObjectURL(url);
          // }, 1000);
        };
      } else {
        console.error("无法打开打印窗口，可能是浏览器阻止了弹出窗口");
        URL.revokeObjectURL(url);
      }
    } else if (fileType.startsWith("image/")) {
      // 对于图片，创建img元素并打印
      const img = document.createElement("img");
      img.src = url;
      img.style.position = "fixed";
      img.style.top = "-9999px";
      img.style.left = "-9999px";
      document.body.appendChild(img);

      img.onload = () => {
        // 创建一个临时打印区域
        const printContainer = document.createElement("div");
        printContainer.style.position = "fixed";
        printContainer.style.top = "-9999px";
        printContainer.style.left = "-9999px";
        printContainer.appendChild(img.cloneNode(true));
        document.body.appendChild(printContainer);

        // 打印
        window.print();

        // 清理
        setTimeout(() => {
          document.body.removeChild(img);
          document.body.removeChild(printContainer);
          URL.revokeObjectURL(url);
        }, 1000);
      };
    } else {
      // 对于其他类型，提示用户下载后打印
      console.warn(`不支持直接打印 ${fileType} 类型的文件，请下载后打印`);
      downloadFile(url, fileName);
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error("打印文件时出错:", error);
  }
};

export const handleImport = (func, accept = ".xlsx,.xls,.csv") => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = accept;
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      func(
        formData,
        (res) => {
          const { code, msg } = res.data;
          if (code === 200) {
            message.success("导入成功");
          } else {
            message.error(msg);
          }
        },
        () => {
          message.error("导入失败，请检查网络连接");
        }
      );
    }
    input.remove();
  };
  input.click();
};

export const GenerateFormItem = ({ item }) => {
  const label = item.label || item.name;
  return (
    <Form.Item
      label={label}
      name={item.name}
      rules={
        item.required ? [{ required: true, message: `请输入${label}` }] : []
      }
      getValueProps={(value) => {
        if (item.type === "date" || item.type === "time") {
          return {
            value: value ? dayjs(value) : null,
          };
        } else {
          return { value };
        }
      }}
      normalize={(value) => {
        if (item.type === "date") {
          return value?.format("YYYY-MM-DD");
        } else if (item.type === "time") {
          return value?.format("YYYY-MM-DD HH:mm:ss");
        } else {
          return value;
        }
      }}
    >
      {item.type === "customize" && item.component}
      {item.type === "input" && (
        <Input
          placeholder={item.placeholder || "请输入"}
          disabled={item.disabled}
        />
      )}
      {item.type === "input_number" && (
        <InputNumber
          style={{ width: "100%" }}
          placeholder={item.placeholder || "请输入"}
          disabled={item.disabled}
          addonAfter={item.addonAfter || ""}
        />
      )}
      {item.type === "text_area" && (
        <Input.TextArea
          autoSize
          disabled={item.disabled}
          placeholder={item.placeholder || "请输入"}
        />
      )}
      {item.type === "date" && (
        <DatePicker style={{ width: "100%" }} disabled={item.disabled} />
      )}
      {item.type === "time" && (
        <DatePicker
          showTime
          placeholder={"请选择时间"}
          style={{ width: "100%" }}
          disabled={item.disabled}
        />
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
      {item.type === "checkbox" && (
        <Checkbox.Group
          options={selectList2Option(item.opt)}
          disabled={item.disabled}
        />
      )}
      {item.type === "multi_select" && (
        <Select
          placeholder={item.placeholder || "请选择"}
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
      {item.type === "cascader" && (
        <Cascader
          options={item.opt || []}
          placeholder={item.placeholder || "请选择"}
          disabled={item.disabled}
          expandTrigger="hover"
          displayRender={(labels) => labels[labels.length - 1]}
        />
      )}
    </Form.Item>
  );
};

export const ImageUpload = ({
  fileList = [],
  setFileList = () => {},
  size = 5,
  maxCount = 5,
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
        maxCount={maxCount}
        fileList={fileList}
        beforeUpload={(file) => {
          if (fileList.length >= maxCount) {
            message.error(`最多上传${maxCount}张图片`);
            return false;
          }
          if (file.size > size * 1024 * 1024) {
            message.error(`文件大小不能超过${size}MB`);
            return false;
          }
          const newFile = {
            ...file,
            url: URL.createObjectURL(file),
          };
          setFileList((prev) => [...prev, newFile]);
          return false;
        }}
        onChange={({ fileList: newFileList }) => {
          setFileList(newFileList.slice(-maxCount));
        }}
        showUploadList={{ showRemoveIcon: true }}
        onPreview={handlePreview}
      >
        {fileList.length >= maxCount ? null : uploadButton}
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

export const FileUpload = ({
  name = "选择文件",
  fileList = [],
  setFileList = () => {},
  maxCount = 1,
  size = 10,
  accept,
  listType = "picture",
}) => {
  return (
    <div style={{ width: "100%", maxWidth: 400 }}>
      <Upload
        accept={accept || "*"}
        listType={listType}
        maxCount={maxCount}
        fileList={fileList}
        beforeUpload={(file) => {
          if (fileList.length > maxCount) {
            message.error(`最多上传${maxCount}个文件`);
            return false;
          }
          if (file.size > size * 1024 * 1024) {
            message.error(`文件大小不能超过${size}MB`);
            return false;
          }
          setFileList((prev) => [...prev, file]);
          return false;
        }}
        onChange={({ fileList: newFileList }) => {
          setFileList(newFileList.slice(-maxCount));
        }}
      >
        <Button icon={<UploadOutlined />}>{name}</Button>
      </Upload>
    </div>
  );
};

// 一个通用的可编辑表格
export const CommonEditTable = ({
  dataSource = [],
  columnsItems = [],
  setTbData = () => {},
  name = "",
  is_del = true,
  is_submit = false,
  onSubmit = () => {},
}) => {
  const columns = [
    {
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    ...columnsItems.map((item) => ({
      title: item.label || item.name,
      dataIndex: item.name,
      key: item.name,
      width: item.width || 100,
      render: (text, record, index) => {
        return (
          <div>
            {item.type === "text" && <span>{text}</span>}
            {item.type === "select" && (
              <Select
                style={{ width: "100%" }}
                placeholder="请选择"
                value={text}
                onChange={(val) => handleTableChange(val, item.name, index)}
              >
                {item.options?.map((opt) => (
                  <Option key={opt} value={opt}>
                    {opt}
                  </Option>
                ))}
              </Select>
            )}
            {item.type === "input" && (
              <Input
                style={{ width: "100%" }}
                value={text}
                placeholder="请输入"
                onChange={(e) =>
                  handleTableChange(e.target.value, item.name, index)
                }
              />
            )}
            {item.type === "text_area" && (
              <Input.TextArea
                autoSize
                style={{ width: "100%" }}
                value={text}
                onChange={(e) =>
                  handleTableChange(e.target.value, item.name, index)
                }
              />
            )}
            {item.type === "image" && (
              <ImageUpload
                fileList={
                  Array.isArray(record[item.name]) ? record[item.name] : []
                }
                setFileList={(fileList) => {
                  const newData = [...dataSource];
                  newData[index][item.name] = fileList;
                  setTbData(newData);
                }}
                maxCount={1}
              />
            )}
            {item.type === "image_prew" && <Image src={text || ""} />}
            {item.type === "file" && (
              <FileUpload
                fileList={
                  Array.isArray(record[item.name]) ? record[item.name] : []
                }
                setFileList={(fileList) => {
                  const newData = [...dataSource];
                  newData[index][item.name] = fileList;
                  setTbData(newData);
                }}
              />
            )}
            {item.type === "time" && (
              <DatePicker
                value={text ? dayjs(text) : null}
                style={{ width: "100%" }}
                showTime
                placeholder="请选择时间"
                onChange={(_, val) => handleTableChange(val, item.name, index)}
              />
            )}
            {item.type === "cascader" && (
              <Cascader
                value={text}
                options={item.opt || []}
                placeholder="请选择"
                expandTrigger="hover"
                onChange={(val) => handleTableChange(val, item.name, index)}
              />
            )}
            {item.type === "radio" && (
              <Radio.Group
                value={text}
                onChange={(e) =>
                  handleTableChange(e.target.value, item.name, index)
                }
                options={item.opt || []}
              />
            )}
          </div>
        );
      },
    })),
  ];
  (is_del || is_submit) &&
    columns.push({
      title: "操作",
      dataIndex: "operation",
      fixed: "right",
      width: 60,
      render: (_, record) => {
        return (
          <Space>
            {is_del && (
              <Button
                type="link"
                danger
                onClick={() => handleDelete(record.key)}
              >
                删除
              </Button>
            )}
            {is_submit && (
              <Button type="primary" onClick={() => onSubmit(record)}>
                提交
              </Button>
            )}
          </Space>
        );
      },
    });
  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setTbData(newData.map((item, index) => ({ ...item, key: index + 1 })));
  };

  const handleTableChange = (value, field, index) => {
    const newData = [...dataSource];
    if (newData[index]) {
      newData[index][field] = value;
      setTbData(newData);
    }
  };
  const handleAddRow = () => {
    const newRow = { key: Date.now().toString() };
    columnsItems.forEach((item) => {
      newRow[item.name] = "";
    });
    setTbData([...dataSource, newRow]);
  };

  return (
    <Table
      title={() => name}
      size="small"
      columns={columns}
      dataSource={dataSource}
      bordered
      pagination={false}
      scroll={{ x: "max-content" }}
      footer={() =>
        is_del && (
          <Button onClick={handleAddRow} icon={<PlusOutlined />}>
            添加行
          </Button>
        )
      }
    />
  );
};
