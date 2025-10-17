import React, { useEffect, useState } from "react";
import { CommonCard } from "../../../../../../components/CommonCard";
import { Button, Flex, message, Radio, Upload } from "antd";
import { selectList2Option } from "../../../../../../utils/string";
import { UploadOutlined } from "@ant-design/icons";
import { qmsStep6 } from "../../../../../../apis/qms_router";

const FileUpload = ({ name = "", fileList = [], setFileList = () => {} }) => {
  return (
    <div style={{ width: 400 }}>
      <Upload
        listType="picture"
        maxCount={1}
        fileList={fileList}
        beforeUpload={(file) => {
          // 对图片的大小做限制
          if (file.size > 1024 * 1024 * 10) {
            message.error("文件大小不能超过10MB");
            return false;
          }
          setFileList([file]);
          return false; // 阻止自动上传
        }}
        onRemove={(file) => {
          setFileList([]);
        }}
      >
        <Button icon={<UploadOutlined />}>{name}</Button>
      </Upload>
    </div>
  );
};

function Correct({ id = "", data = null, refresh = () => {} }) {
  const [need_8d, setNeed8d] = useState("");
  const [need_cort, setNeedCort] = useState("");
  const [fileList1, setFileList1] = useState([]);
  const [fileList2, setFileList2] = useState([]);
  const submit = () => {
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
        formData.append("eight_d_report", fileList1[0]);
      }
    }
    if (need_cort === "需要") {
      if (fileList2.length === 0) {
        message.warning("请上传纠正预防措施");
        return;
      } else {
        formData.append("corrective_measures_plan", fileList1[0]);
      }
    }
    formData.append("request_data", JSON.stringify(param));

    qmsStep6(
      formData,
      (res) => {
        const { data, code, msg } = res.data;
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
      setNeed8d(data.start_8d ? "需要" : "不需要");
      setNeedCort(data.start_corrective_preventive ? "需要" : "不需要");
    }
  }, [data]);

  return (
    <CommonCard name="纠正和预防措施">
      <Flex vertical gap={20} className="correct_root">
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
        {/* <div>
          <Button type="primary" onClick={submit} disabled>
            确认
          </Button>
        </div> */}
      </Flex>
    </CommonCard>
  );
}

export default Correct;
