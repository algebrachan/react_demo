import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Form,
  DatePicker,
  Table,
  Space,
  Flex,
  message,
  Spin,
  AutoComplete,
  Popconfirm,
  Modal,
  Collapse,
} from "antd";
import { ComputeFormCol } from "@/utils/obj";
import { selectList2Option, timeFormat } from "@/utils/string";
import dayjs from "dayjs";
import {
  createReviews,
  inspectionUnqualified,
  readInspectionReport,
  updateInspectionReport,
  createInspectionReport,
} from "@/apis/qms_router";
import { EditTable } from "../Common";
import { useDispatch, useSelector } from "react-redux";
import { setCommonParam } from "../../../../mngSlice";
import { CommonEditTable, FileUpload } from "../../../../../../utils/obj";
import { FileSearchOutlined } from "@ant-design/icons";
import { FilePreviewModal, FileUploadModal } from "../Modal";

const MemoizedCommonEditTable = React.memo(CommonEditTable);

const Report = () => {
  const [is_file_modal, setIsFileModal] = useState(false);
  const [is_preview_modal, setIsPreviewModal] = useState(false);
  const { inspection_code, inspection_tab } = useSelector(
    (state) => state.mng.qms
  );
  const dispatch = useDispatch();
  const [is_submit, setIsSubmit] = useState(false);
  const [file_url, setFileUrl] = useState("");
  const [guideline, setGuideline] = useState([]);
  const [modal, contextHolder] = Modal.useModal();
  const [query_form] = Form.useForm();
  const [form] = Form.useForm();
  const v_code = Form.useWatch("vapplybillcode", form);
  const initFormData = {
    instruction_number: "",
    category: "",
    materialname: "",
    specification: "",
    quantity: "",
    quality_approval: "",
    vapplybillcode: "",
    materialcode: "",
    material_type: "",
    inspection_date: "",
    batch: "",
    inspection_status: "",
    judgment_result: "",
    reviser: "赵仕伟",
  };
  const [form_load, setFormLoad] = useState(false);
  const [tb_data, setTbData] = useState([]);
  const [tb_head, setTbHead] = useState(["产品编码", "检验结果"]);
  const [fileList, setFileList] = useState([]);

  const columnsItems = [
    { label: "检验项目", name: "inspection_item", type: "text" },
    {
      label: "检验方法",
      name: "inspection_method",
      type: "text",
    },
    { label: "技术要求", name: "technical_requirements", type: "text" },
    { label: "检验特性", name: "inspection_property", type: "text" },
    { label: "标准图", name: "standard_graph", type: "image_prew" },
    { label: "限度图", name: "limit_graph", type: "image_prew" },
    { label: "单位", name: "unit", type: "text" },
    { label: "上限", name: "upper_limit", type: "text" },
    { label: "下限", name: "lower_limit", type: "text" },
    { label: "抽样要求", name: "sample_requirement", type: "text" },
    {
      label: "判定方案",
      name: "judgment_plan",
      type: "text",
    },
    { label: "结果", name: "result", type: "text" },
  ];
  const formItems = [
    {
      label: "检验指导书编号",
      name: "instruction_number",
      required: true,
      disabled: true,
    },
    {
      label: "报检单号",
      name: "vapplybillcode",
      required: true,
      disabled: true,
    },
    {
      label: "物料编码",
      name: "materialcode",
      required: true,
    },
    { label: "产品名称", name: "materialname", required: true },
    { label: "分类", name: "category" },
    { label: "规格", name: "specification", required: true },
    { label: "检测数量", name: "quantity" },
    { label: "物料类型", name: "material_type" },
    { label: "检测人", name: "reviser", required: true },
    {
      label: "检测时间",
      name: "inspection_date",
      type: "date",
      required: true,
    },
    { label: "批次号", name: "batch", required: true },
    { label: "判定结果", name: "judgment_result" },
  ];

  const resetData = () => {
    setIsSubmit(false);
    form.resetFields();
    setTbData([]);
    setGuideline([]);
    setTbHead(["产品编码", "检验结果"]);
    setFileUrl("");
  };
  const search = () => {
    const { 报检单号 } = query_form.getFieldsValue();
    setFormLoad(true);
    dispatch(
      setCommonParam({
        param_name: "qms",
        param_val: { inspection_code: "" },
      })
    );
    readInspectionReport(
      { 报检单号 },
      (res) => {
        setFormLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          const { guideline = [] } = data;
          setGuideline(guideline);
          const {
            items = [],
            IS_OK = false,
            report_file_path = "",
          } = data["report_data"] || {};
          setFileUrl(report_file_path);
          setIsSubmit(IS_OK);
          if (items.length > 0) {
            let header = Object.keys(items[0]);
            setTbHead(header);
          }
          let tb = items.map((item, _) => ({
            key: _,
            ...Object.fromEntries(
              Object.entries(item).map(([k, v]) => [
                k,
                k === "产品编码" ? v : v === "" ? "OK" : v,
              ])
            ),
          }));
          setTbData(tb);
          form.setFieldsValue({
            ...initFormData,
            ...data["report_data"],
          });
        }
      },
      () => {
        setFormLoad(false);
        resetData();
      }
    );
  };
  const submit = async () => {
    // 提交逻辑
    let val = await form.validateFields();
    val["items"] = tb_data;
    const formData = new FormData();
    formData.append("inspection_report", JSON.stringify(val));
    if (fileList && fileList.length > 0) {
      fileList.forEach((file, index) => {
        const fileBlob = new Blob([file.originFileObj], {
          type: file.type,
        });
        // 使用带索引的键名，避免覆盖
        formData.append("report_file", fileBlob, file.name);
      });
    }
    setFormLoad(true);
    createInspectionReport(
      formData,
      (res) => {
        setFormLoad(false);
        const { code, data, msg } = res.data;
        if (code === 0) {
          setFileList([]);
          message.success(msg);
          search();
        }
      },
      () => {
        setFormLoad(false);
      }
    );
  };

  const submitNG = async () => {
    // 提交不合格逻辑
    const val = await form
      .validateFields()
      .then((res) => res)
      .catch((err) => {
        const { errorFields } = err;
        let err_list = errorFields.map((e) => e.errors);
        message.warning(err_list.join("\n"));
        return false;
      });
    if (val) {
      inspectionUnqualified(
        { 报检单号: [val["vapplybillcode"]] },
        (res) => {
          const { code, msg } = res.data;
          if (code === 0) {
            message.success(msg);
          }
        },
        () => {}
      );
      let param = {
        产品名称: val["materialname"],
        规格: val["specification"],
        物料编号: val["materialcode"],
        批次号: val["batch"],
        检验员: val["reviser"],
        检验日期: val["inspection_date"],
        批次信息: tb_data,
        单位: "",
      };
      createReviews(
        param,
        (res) => {
          const { code, data, msg } = res.data;
          if (code === 0) {
            message.success("提交成功");
          }
        },
        () => {}
      );
    }
  };
  useEffect(() => {
    if (inspection_code && inspection_tab == "2") {
      query_form.setFieldsValue({
        报检单号: inspection_code,
      });
      search();
    }
    return () => {};
  }, [inspection_code, inspection_tab]);
  useEffect(() => {}, []);

  return (
    <Flex vertical gap={16}>
      {contextHolder}
      <Form
        layout="inline"
        form={query_form}
        initialValues={{
          报检单号: "",
        }}
      >
        <Space>
          <Form.Item label="报检单号" name="报检单号">
            <Input placeholder="请输入报检单号" />
          </Form.Item>
          <Button type="primary" onClick={search}>
            查询
          </Button>
          <Button
            onClick={() => {
              modal.confirm({
                title: "确认提交",
                content: "确定要提交检验报告吗？",
                onOk: submit,
              });
            }}
            disabled={is_submit}
          >
            提交
          </Button>
          <Button
            onClick={() => {
              modal.confirm({
                title: "确认发起",
                content: "确定要发起不合格吗？",
                onOk: submitNG,
              });
            }}
          >
            发起不合格
          </Button>
          {is_submit && (
            <Button onClick={() => setIsFileModal(true)}>上传报告</Button>
          )}
          {file_url && file_url.length > 0 && (
            <Button
              icon={<FileSearchOutlined />}
              onClick={() => setIsPreviewModal(true)}
              // onClick={() => window.open(file_url, "_blank")}
            >
              预览文件
            </Button>
          )}
        </Space>
      </Form>
      <Spin spinning={form_load}>
        <Card>
          <Form
            form={form}
            initialValues={initFormData}
            {...ComputeFormCol(7)}
            disabled={is_submit}
          >
            <Row gutter={[10, 10]}>
              {formItems.map((item, index) => (
                <Col span={6} key={index}>
                  {item.type === "date" ? (
                    <Form.Item
                      label={item.label}
                      name={item.name}
                      rules={[{ required: item.required }]}
                      getValueProps={(value) => {
                        return {
                          value: value && dayjs(value),
                        };
                      }}
                      normalize={(value) =>
                        value && dayjs(value).format(timeFormat)
                      }
                    >
                      <DatePicker
                        showTime
                        style={{ width: "100%" }}
                        disabled={item.disabled}
                      />
                    </Form.Item>
                  ) : (
                    <Form.Item
                      label={item.label}
                      name={item.name}
                      rules={[{ required: item.required }]}
                    >
                      <Input disabled={item.disabled} />
                    </Form.Item>
                  )}
                </Col>
              ))}
              <Col span={6}>
                <Form.Item label="检测报告">
                  <FileUpload
                    maxCount={10}
                    fileList={fileList}
                    setFileList={setFileList}
                    listType="text"
                    accept=".pdf,image/*"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Spin>
      {guideline.length > 0 && (
        <Collapse
          defaultActiveKey={[]}
          animation
          items={[
            {
              key: "1",
              label: "检验指导书",
              children: (
                <MemoizedCommonEditTable
                  dataSource={guideline}
                  columnsItems={columnsItems}
                  is_del={false}
                />
              ),
            },
          ]}
        />
      )}
      <Spin spinning={form_load}>
        <EditTable
          title={() => "检验报告项目"}
          add_name="添加"
          columns_text={tb_head}
          dataSource={tb_data}
          setTbData={setTbData}
          disabled={is_submit}
        />
      </Spin>
      <FileUploadModal
        requestData={search}
        v_code={v_code}
        open={is_file_modal}
        onCancel={() => setIsFileModal(false)}
      />
      <FilePreviewModal
        file_url={file_url}
        requestData={search}
        v_code={v_code}
        open={is_preview_modal}
        is_del={true}
        onCancel={() => setIsPreviewModal(false)}
      />
    </Flex>
  );
};

export default Report;
