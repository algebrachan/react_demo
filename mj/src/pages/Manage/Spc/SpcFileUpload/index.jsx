import React, { useState } from "react";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import { Button, Form, Select, message, Space, Flex } from "antd";
import { selectList2Option } from "../../../../utils/string";
import { FileUpload } from "../../../../utils/obj";
import { uploadSpcFile } from "../../../../apis/spc_api";
import { Spin } from "antd";

function SpcFileUpload() {
  const [form] = Form.useForm();
  const [load, setLoad] = useState(false); // 加载中
  const [fileList, setFileList] = useState([]);
  const submit = () => {
    if (fileList.length === 0) {
      message.error("请上传文件");
      return;
    }
    const values = form.getFieldsValue();
    const formData = new FormData();
    formData.append("request_data", JSON.stringify(values));
    // 获取原始文件对象并转换为二进制
    const fileBlob = new Blob([fileList[0].originFileObj], {
      type: fileList[0].type,
    });
    formData.append("file", fileBlob, fileList[0].name);
    setLoad(true);
    uploadSpcFile(
      formData,
      (res) => {
        setLoad(false);
        const { code, msg } = res.data;
        if (code === 0) {
          message.success(msg);
        } else {
          message.error(msg);
        }
      },
      () => {
        setLoad(false);
        message.error("提交失败");
      }
    );
  };
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "文件上传"]} />
      <div
        className="content_root"
        style={{
          display: "flex",
          rowGap: 20,
          flexDirection: "column",
        }}
      >
        <Spin spinning={load}>
          <Form form={form} initialValues={{ file_type: "出货COA" }}>
            <Flex vertical gap={20}>
              <Form.Item label="文件类型" name="file_type">
                <Select
                  options={selectList2Option([
                    "出货COA",
                    "来料COA",
                    "受入检查",
                    "定期分析",
                  ])}
                  style={{ width: 200 }}
                />
              </Form.Item>
              <Form.Item label="文件上传">
                <FileUpload fileList={fileList} setFileList={setFileList} />
              </Form.Item>
              <Space>
                <Button type="primary" onClick={submit}>
                  提交
                </Button>
              </Space>
            </Flex>
          </Form>
        </Spin>
      </div>
    </div>
  );
}

export default SpcFileUpload;
