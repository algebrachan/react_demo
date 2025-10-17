import React, { useEffect, useState } from "react";
import {
  Form,
  Modal,
  Row,
  Col,
  message,
  Flex,
  Table,
  Space,
  Button,
} from "antd";
import { GenerateFormItem, ComputeFormCol, FileUpload } from "@/utils/obj";
import { addReportFiles, delReportFile } from "@/apis/qms_router";
import { createInspectionTask } from "../../../../../../apis/nc_review_router";
import { use } from "react";

export const InspectionModal = ({ open, onCancel, requestData }) => {
  const [form] = Form.useForm();
  const default_form_data = {
    pkApplybill: "",
    nchecknumStr: "",
    graphid: "",
    usercode: "",
    dmakedate: "",
    materialname: "",
    orgcode: "",
    vapplybillcode: "",
    measdocname: "",
    fbillstatus: "",
    orgname: "",
    newversion: "",
    qualitygrade: "",
    dreportdate: "",
    judgeSamplePiece: "",
    suppliername: "",
    measdoccode: "",
    pkReportbill: "",
    ncUpdate: "",
    departmentName: "",
    materialcode: "",
    creationtime: "",
    vbillcode: "",
    suppliercode: "",
    dbilldate: "",
    departmentCode: "",
  };
  const formItems = [
    {
      label: "报检单号",
      name: "vapplybillcode",
      type: "input",
      required: true,
    },
    {
      label: "到货日期",
      name: "dbilldate",
      type: "time",
      required: true,
    },
    {
      label: "制单日期",
      name: "dmakedate",
      type: "time",
      required: true,
    },
    {
      label: "物料名称",
      name: "materialname",
      type: "input",
      required: true,
    },
    {
      label: "物料图号",
      name: "graphid",
      type: "input",
      required: true,
    },
    {
      label: "物料编码",
      name: "materialcode",
      type: "input",
      required: true,
    },
    {
      label: "主单位",
      name: "measdocname",
      type: "input",
      required: true,
    },
    {
      label: "检验主数量",
      name: "nchecknumStr",
      type: "input_number",
      required: true,
    },
    {
      label: "供应商名称",
      name: "suppliername",
      type: "input",
      required: true,
    },
    {
      label: "报告单号",
      name: "vbillcode",
      type: "input",
      required: true,
    },
    {
      label: "报告日期",
      name: "dreportdate",
      type: "time",
      required: true,
    },
    {
      label: "部门",
      name: "departmentName",
      type: "input",
    },
    {
      label: "是否nc修改",
      name: "ncUpdate",
      type: "input",
    },
    {
      label: "制单人",
      name: "usercode",
      type: "input",
    },
    {
      label: "创建时间",
      name: "creationtime",
      type: "time",
    },
  ];

  const handleOk = async () => {
    const values = await form
      .validateFields()
      .then((res) => res)
      .catch((err) => {
        const { errorFields } = err;
        let err_list = errorFields.map((e) => e.errors);
        message.warning(err_list.join("\n"));
        return false;
      });
    if (!values) return;
    createInspectionTask(
      values,
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0) {
          message.success("提交成功");
          requestData();
          onCancel();
        }
      },
      () => {}
    );
  };
  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open]);
  return (
    <Modal
      title="手动发起报检任务"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      width={900}
    >
      <Form
        {...ComputeFormCol(6)}
        form={form}
        initialValues={default_form_data}
      >
        <Row gutter={[10, 10]}>
          {formItems.map((item) => (
            <Col span={12} key={item.name}>
              <GenerateFormItem item={item} />
            </Col>
          ))}
        </Row>
      </Form>
    </Modal>
  );
};

export const FilePreviewModal = ({
  open = false,
  onCancel,
  file_url = [],
  v_code = "",
  is_del = false,
  requestData = () => {},
}) => {
  const [tb_data, setTbData] = useState([]);
  const del = (record) => {
    const { vapplybillcode, file_name, file_dir } = record;
    delReportFile(
      {
        vapplybillcode,
        file_name,
        file_dir,
      },
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0) {
          message.success("删除成功");
          requestData();
        }
      },
      () => {}
    );
  };
  const columns = [
    {
      title: "文件名",
      dataIndex: "file_name",
      key: "file_name",
    },
    {
      title: "报检单号",
      dataIndex: "vapplybillcode",
      key: "vapplybillcode",
    },
    {
      title: "操作",
      key: "opt",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => window.open(record.url)}>
            预览
          </Button>
          {is_del && (
            <Button type="link" danger onClick={() => del(record)}>
              删除
            </Button>
          )}
        </Space>
      ),
    },
  ];
  useEffect(() => {
    if (open) {
      let temp_data = file_url.map((item, _) => ({
        ...item,
        vapplybillcode: v_code,
        key: _,
      }));
      setTbData(temp_data);
    }
  }, [open, file_url]);
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={onCancel}
      title="附件预览"
      width={600}
    >
      <Table
        size="small"
        bordered
        columns={columns}
        dataSource={tb_data}
        pagination={false}
      />
    </Modal>
  );
};
export const FileUploadModal = ({
  open = false,
  v_code = "",
  onCancel,
  requestData,
}) => {
  const [file_list, setFileList] = useState([]);
  const handleOk = () => {
    if (!file_list || file_list.length === 0) {
      message.warning("请选择文件");
      return;
    }
    if (!v_code) {
      message.warning("报检单号不能为空");
      return;
    }
    const formData = new FormData();
    formData.append("vapplybillcode", v_code);
    if (file_list && file_list.length > 0) {
      file_list.forEach((file, index) => {
        const fileBlob = new Blob([file.originFileObj], {
          type: file.type,
        });
        // 使用带索引的键名，避免覆盖
        formData.append("report_file", fileBlob, file.name);
      });
    }
    addReportFiles(
      formData,
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0) {
          message.success(msg);
          requestData();
          onCancel();
        }
      },
      () => {}
    );
  };
  useEffect(() => {
    if (open) setFileList([]);
  }, [open]);
  return (
    <Modal title="上传附件" open={open} onCancel={onCancel} onOk={handleOk}>
      <Flex vertical gap={16}>
        <h3>报检单号:{v_code}</h3>
        <FileUpload
          maxCount={10}
          fileList={file_list}
          setFileList={setFileList}
          listType="text"
          accept=".pdf,image/*"
        />
      </Flex>
    </Modal>
  );
};
