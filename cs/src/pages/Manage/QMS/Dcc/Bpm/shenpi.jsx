import React, { useEffect, useState } from "react";
import {
  Form,
  Row,
  Col,
  Select,
  Checkbox,
  Spin,
  Flex,
  Divider,
  Input,
  Space,
  Button,
  Modal,
  Table,
  message,
} from "antd";
import {
  DownloadOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  AddFormDataItems,
  CommonFormDataItems,
  DEPARTMENT_LIST,
  UpdateFormDataItems,
  CancelFormDataItems,
  ReceiveFormDataItems,
} from "./common";
import {
  CommonEditTable,
  ComputeFormCol,
  GenerateFormItem,
} from "../../../../../utils/obj";
import { selectList2Option } from "../../../../../utils/string";
import { getSession } from "../../../../../utils/storage";

import {
  qmsDccFileUrl,
  qmsDccApproveContent,
  qmsDccApproveFormat,
  qmsDccApproveCompliance,
  qmsDccApproveFinal,
  qmsDccApproveSignature,
  qmsDccSignAxterDocs,
} from "../../../../../apis/nc_review_router";

const FafangForm = (
  <Col span={24}>
    <Form.Item
      label="发放需求"
      name="发放需求"
      rules={[{ required: true }]}
      {...ComputeFormCol(3)}
    >
      <Form.List name="发放需求">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Row key={key} gutter={10} style={{ marginBottom: 8 }}>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "部门"]}
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="选择部门"
                      options={selectList2Option(DEPARTMENT_LIST)}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "份数"]}
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="选择份数"
                      options={selectList2Option([1, 2, 3])}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    {...restField}
                    name={[name, "发放格式"]}
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="选择发放格式"
                      options={selectList2Option(["电子", "电子+纸质"])}
                    />
                  </Form.Item>
                </Col>
              </Row>
            ))}
          </>
        )}
      </Form.List>
    </Form.Item>
  </Col>
);

const HuiqianForm = (
  <Col span={24}>
    <Form.Item
      name="会签部门"
      label="会签部门"
      rules={[{ required: true }]}
      {...ComputeFormCol(3)}
    >
      <Checkbox.Group options={selectList2Option(DEPARTMENT_LIST)} />
    </Form.Item>
  </Col>
);

const ChakanForm = (
  <Col span={24}>
    <Form.Item
      name="查看部门"
      label="查看部门"
      rules={[{ required: true }]}
      {...ComputeFormCol(3)}
    >
      <Checkbox.Group options={selectList2Option(DEPARTMENT_LIST)} />
    </Form.Item>
  </Col>
);

const ShenpiForm = (
  <>
    <Col span={24}>
      <Form.Item
        name="评审部门"
        label="评审部门"
        rules={[{ required: true }]}
        {...ComputeFormCol(3)}
      >
        <Checkbox.Group options={selectList2Option(DEPARTMENT_LIST)} />
      </Form.Item>
    </Col>
    <Col span={24}>
      <Form.Item
        name="查看部门"
        label="查看部门"
        rules={[{ required: true }]}
        {...ComputeFormCol(3)}
      >
        <Checkbox.Group options={selectList2Option(DEPARTMENT_LIST)} />
      </Form.Item>
    </Col>
  </>
);

const AddShenpiForm = ({ data }) => {
  const [form] = Form.useForm();
  const file_level = Form.useWatch("文件级别", form);
  useEffect(() => {
    form.setFieldsValue(data || {});
  }, [data]);

  return (
    <Form form={form} disabled={true} {...ComputeFormCol(6)}>
      <Row gutter={[16, 16]}>
        {CommonFormDataItems.map((item) => (
          <Col span={12} key={item.name}>
            <GenerateFormItem item={item} />
          </Col>
        ))}
        {AddFormDataItems.map((item) => (
          <Col span={12} key={item.name}>
            <GenerateFormItem item={item} />
          </Col>
        ))}
        {FafangForm}
        {HuiqianForm}
        {file_level !== "单点教育" && HuiqianForm}
      </Row>
    </Form>
  );
};
const UpdateShenpiForm = ({ data }) => {
  const [form] = Form.useForm();
  const file_level = Form.useWatch("文件级别", form);
  useEffect(() => {
    form.setFieldsValue(data || {});
  }, [data]);
  return (
    <Form form={form} disabled={true} {...ComputeFormCol(6)}>
      <Row gutter={[16, 16]}>
        {CommonFormDataItems.map((item) => (
          <Col span={12} key={item.name}>
            <GenerateFormItem item={item} />
          </Col>
        ))}
        {UpdateFormDataItems.map((item) => (
          <Col span={12} key={item.name}>
            <GenerateFormItem item={item} />
          </Col>
        ))}
        {FafangForm}
        {HuiqianForm}
        {file_level !== "单点教育" && HuiqianForm}
      </Row>
    </Form>
  );
};
const ReceiveShenpiForm = ({ data }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(data || {});
  }, [data]);
  return (
    <Form form={form} disabled={true} {...ComputeFormCol(6)}>
      <Row gutter={[16, 16]}>
        {CommonFormDataItems.map((item) => (
          <Col span={12} key={item.name}>
            <GenerateFormItem item={item} />
          </Col>
        ))}
        {ReceiveFormDataItems.map((item) => (
          <Col span={12} key={item.name}>
            <GenerateFormItem item={item} />
          </Col>
        ))}
        {ShenpiForm}
      </Row>
    </Form>
  );
};
const CancelShenpiForm = ({ data }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(data || {});
  }, [data]);
  return (
    <Form form={form} disabled={true} {...ComputeFormCol(6)}>
      <Row gutter={[16, 16]}>
        {CommonFormDataItems.map((item) => (
          <Col span={12} key={item.name}>
            <GenerateFormItem item={item} />
          </Col>
        ))}
        {CancelFormDataItems.map((item) => (
          <Col span={12} key={item.name}>
            <GenerateFormItem item={item} />
          </Col>
        ))}
      </Row>
    </Form>
  );
};

const PreviewModal = ({ open = false, onCancel = () => {}, data = {} }) => {
  const [tb_data, setTbData] = useState([]);
  const columns = [
    {
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "文件名",
      dataIndex: "文件名",
      key: "文件名",
    },
    {
      title: "类型",
      dataIndex: "类型",
      key: "类型",
    },
    {
      title: "操作",
      render: (_, record) => (
        <Space size={20}>
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => window.open(record["文件预览路径"], "_blank")}
          >
            预览
          </Button>
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => window.open(record["文件下载路径"], "_blank")}
          >
            下载
          </Button>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    if (open) {
      const {
        文件下载路径,
        文件预览路径,
        文件名,
        四级文件 = [],
        附件 = [],
      } = data;
      const tb_temp = [
        { key: 1, 文件下载路径, 文件预览路径, 文件名, 类型: "主文件" },
        ...四级文件.map((item, index) => ({
          key: index + 2,
          ...item,
          类型: "四级文件",
        })),
        ...附件.map((item, index) => ({
          key: index + 四级文件.length + 2,
          ...item,
          类型: "附件",
        })),
      ];
      setTbData(tb_temp);
    } else {
      setTbData([]);
    }
  }, [data, open]);
  return (
    <Modal
      title="文件预览"
      open={open}
      onCancel={onCancel}
      onOk={onCancel}
      width={600}
    >
      <Table
        bordered
        size="small"
        columns={columns}
        pagination={false}
        dataSource={tb_data}
      />
    </Modal>
  );
};

export const DccShenPi = ({
  id = "",
  review_data = {},
  disabled = false,
  reFresh = () => {},
  name = "内容审核",
}) => {
  const [load, setLoad] = useState(false);
  const [form] = Form.useForm();
  const [reject_form] = Form.useForm();
  const [file_type, setFileType] = useState("");
  const [file_preview, setFilePreview] = useState({});
  const [is_preview, setIsPreview] = useState(false);
  const [btn_load, setBtnLoad] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const [tb_data, setTbData] = useState([]);
  const columnsItems = [
    { name: "部门", type: "text" },
    { name: "负责人工号", type: "text" },
    {
      name: "意见",
      type: "select",
      options: [
        "直接使用",
        "翻译后使用",
        "转换成内部文件后使用",
        "参考使用",
        "不使用",
        "存在异议需与发文单位沟通",
      ],
      width: 120,
    },
    { name: "是否同意", type: "radio", opt: ["同意", "驳回"], width: 120 },
    { name: "签名", type: "input" },
    { name: "时间", type: "text" },
  ];
  const handleSubmit = (record) => {
    const { 部门, 意见, 是否同意, 签名 } = record;
    const values = {
      process_id: id,
      部门,
      意见,
      是否同意,
      签名,
    };
    setLoad(true);
    qmsDccSignAxterDocs(
      values,
      (res) => {
        setLoad(false);
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          message.success("提交成功");
          reFresh();
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
  const apiMap = {
    内容审核: qmsDccApproveContent,
    格式卡控: qmsDccApproveFormat,
    合规性审核: qmsDccApproveCompliance,
    批准: qmsDccApproveFinal,
  };
  const submit = async (opt, reason = "") => {
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
    values["process_id"] = id;
    values["操作"] = opt;
    values["驳回原因"] = reason;
    const api = apiMap[name] || apiMap["批准"];
    // 根据不同的类型采用不同接口
    setLoad(true);
    api(
      values,
      (res) => {
        setLoad(false);
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          message.success("提交成功");
          reFresh();
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
  const reject = () => {
    reject_form.resetFields();
    modal.confirm({
      title: "驳回原因",
      icon: <ExclamationCircleOutlined />,
      content: (
        <Form form={reject_form}>
          <Form.Item
            name="rejectReason"
            rules={[{ required: true, message: "请输入驳回理由" }]}
          >
            <Input.TextArea placeholder="请详细描述驳回原因" rows={4} />
          </Form.Item>
        </Form>
      ),
      onOk: () => {
        reject_form
          .validateFields(["rejectReason"])
          .then((values) => {
            submit("驳回", values.rejectReason);
          })
          .catch((e) => message.error("请输入原因"));
      },
      okText: "确认驳回",
      cancelText: "取消",
      okButtonProps: { danger: true },
    });
  };
  const download = () => {
    setBtnLoad(true);
    qmsDccFileUrl(
      { process_id: id },
      (res) => {
        setBtnLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          setFilePreview(data);
          setIsPreview(true);
        } else {
          message.error(msg);
        }
      },
      () => {
        setBtnLoad(false);
        message.error("预览失败");
      }
    );
  };
  useEffect(() => {
    const { 发起申请 = {}, 评审 } = review_data;
    //
    let nickname = "";
    const user_str = getSession("user_info");
    if (user_str) {
      const user_info = JSON.parse(user_str);
      nickname = user_info.nickname || "";
    }
    const { 审批人 = nickname, 审批意见 = "" } = review_data[name] || {};

    setFileType(发起申请?.文件申请类型 || "");
    form.setFieldsValue({ 审批人, 审批意见 });
    if (评审 && typeof 评审 === "object") {
      const tableData = Object.entries(评审).map(([department, data]) => ({
        key: department,
        部门: department,
        负责人工号: data["负责人工号"] || "",
        意见: data["意见"] || "",
        是否同意: data["是否同意"] || "同意",
        签名: data["签名"] || "",
        时间: data["时间"] || "",
      }));
      setTbData(tableData);
    }
  }, [review_data, name]);

  return (
    <Flex vertical gap={16}>
      {contextHolder}
      <div className="no_review_title">{name}</div>
      <Spin spinning={load}>
        {file_type === "新增" && (
          <AddShenpiForm data={review_data["发起申请"]} />
        )}
        {file_type === "更改" && (
          <UpdateShenpiForm data={review_data["发起申请"]} />
        )}
        {file_type === "接收外来文件" && (
          <ReceiveShenpiForm data={review_data["发起申请"]} />
        )}
        {file_type === "作废" && (
          <CancelShenpiForm data={review_data["发起申请"]} />
        )}
        <Divider style={{ margin: "16px 0" }} />
        <Form
          form={form}
          initialValues={{
            审批意见: "",
            审批人: "",
          }}
          {...ComputeFormCol(6)}
          disabled={disabled}
        >
          {file_type === "接收外来文件" && (
            <>
              {name === "内容审核" && (
                <div>
                  <CommonEditTable
                    dataSource={tb_data}
                    setTbData={setTbData}
                    is_submit={true}
                    is_del={false}
                    columnsItems={columnsItems}
                    onSubmit={handleSubmit}
                  />
                </div>
              )}
              {name === "批准" && (
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item label="审批意见" name="审批意见">
                      <Input.TextArea placeholder="请输入审批意见" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="审批人">
                      <Flex vertical gap={10}>
                        <Form.Item
                          noStyle
                          name="审批人"
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                        <Space>
                          <Button
                            icon={<DownloadOutlined />}
                            onClick={download}
                            loading={btn_load}
                          >
                            预览
                          </Button>
                          <Button type="primary" onClick={() => submit("通过")}>
                            通过
                          </Button>
                          <Button danger onClick={reject}>
                            驳回
                          </Button>
                        </Space>
                      </Flex>
                    </Form.Item>
                  </Col>
                </Row>
              )}
            </>
          )}
          {["新增", "更改", "作废"].includes(file_type) && (
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item label="审批意见" name="审批意见">
                  <Input.TextArea placeholder="请输入审批意见" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="审批人">
                  <Flex vertical gap={10}>
                    <Form.Item
                      noStyle
                      name="审批人"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Space>
                      <Button
                        icon={<DownloadOutlined />}
                        onClick={download}
                        loading={btn_load}
                      >
                        预览
                      </Button>
                      <Button type="primary" onClick={() => submit("通过")}>
                        通过
                      </Button>
                      <Button danger onClick={reject}>
                        驳回
                      </Button>
                    </Space>
                  </Flex>
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </Spin>
      <PreviewModal
        open={is_preview}
        onCancel={() => setIsPreview(false)}
        data={file_preview}
      />
    </Flex>
  );
};
