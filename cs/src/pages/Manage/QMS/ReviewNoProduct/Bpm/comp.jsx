import React, { useEffect, useState, memo, useRef } from "react";
import {
  Button,
  Descriptions,
  Flex,
  Form,
  Card,
  Radio,
  Input,
  Spin,
  message,
  Space,
  Collapse,
  DatePicker,
  Divider,
  Typography,
  Checkbox,
  Modal,
} from "antd";
import { timeFormat } from "@/utils/string";
import dayjs from "dayjs";
import {
  ComputeFormCol,
  ImageUpload,
  base64ToBlob,
  CommonEditTable,
  FileUpload,
} from "@/utils/obj";
import {
  qmsNoReview1,
  qmsNoReview2,
  qmsNoReview2Total,
  qmsNoReviewQm,
  qmsNoReviewVp,
  qmsNoReview4,
  qmsNoReview5,
  qmsBackToStep2,
} from "@/apis/nc_review_router";
import "./bpm.less";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const { Text } = Typography;

// 不合格隔离
export const NoIsolation = ({
  id = "",
  order_record = {},
  user_opt = [],
  review_data = {},
  disabled = false,
  reFresh = () => {},
}) => {
  const [form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [tb_data, setTbData] = useState([]);
  const default_form_data = {
    现象描述: "",
    不合格品发生地: "",
    风险识别: "",
    评审部门: ["QC工程师", "计划部", "制造部", "研发技术部"],
  };
  const desc_items = [
    "产品名称",
    "规格",
    "物料编号",
    "批次号",
    "批次总数量",
    "不合格数量",
    "单位",
    "不合格占比",
    "检验员",
    "检验日期",
  ].map((item, _) => ({
    key: _ + 1,
    label: item,
    children: order_record[item],
  }));
  const submit = async () => {
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
    values["review_id"] = id;
    values["临时措施"] = tb_data.map(({ key, ...rest }) => rest);
    const formData = new FormData();
    formData.append("request_data", JSON.stringify(values));
    fileList.forEach((item) => {
      if (item.uid.startsWith("-")) {
        formData.append(
          "images",
          new File([base64ToBlob(item.url)], item.name, {
            type: item.mimetype || "image/png",
            lastModified: new Date().getTime(),
          })
        );
      } else {
        formData.append("images", item.originFileObj);
      }
    });
    setLoad(true);
    qmsNoReview1(
      formData,
      (res) => {
        setLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0) {
          message.success(msg);
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
  const reback = () => {
    qmsBackToStep2(
      { review_id: id },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0) {
          message.success("回撤成功");
          reFresh();
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };
  const columnsItems = [
    { name: "处置项目", type: "input", width: 160 },
    {
      name: "部门-责任人",
      type: "cascader",
      width: 200,
      opt: user_opt,
    },
  ];
  useEffect(() => {
    const { 图片 = [], 临时措施 = [] } = review_data;
    let new_tb = 临时措施.map((item, index) => {
      let { item_id, ...rest } = item;
      return { key: item_id || index, ...rest };
    });
    setTbData(new_tb);
    const initialFiles = 图片.map((base64, index) => ({
      uid: `-${index}`,
      name: `image_${index}.png`,
      url: base64,
    }));
    setFileList(initialFiles);
    form.setFieldsValue(review_data); // 初始化表单数据
  }, [review_data]);

  return (
    <Flex vertical gap={16}>
      <div className="no_review_title">不合格品隔离</div>
      <Descriptions bordered items={desc_items} />
      <Card>
        <Spin spinning={load}>
          <Form
            form={form}
            initialValues={default_form_data}
            {...ComputeFormCol(4)}
            disabled={disabled}
          >
            <Flex vertical gap={16}>
              <Form.Item
                label="不合格品发生地"
                name="不合格品发生地"
                rules={[{ required: true }]}
              >
                <Radio.Group
                  options={["来料", "生产工序", "出货", "仓库", "其他"]}
                />
              </Form.Item>
              <Form.Item
                label="现象描述"
                name="现象描述"
                rules={[{ required: true }]}
              >
                <Input.TextArea
                  autoSize={{ minRows: 2, maxRows: 6 }}
                  style={{ background: "rgb(250, 250, 250)" }}
                />
              </Form.Item>
              <Form.Item label="附件上传" htmlFor="attachment">
                <ImageUpload
                  id="attachment"
                  fileList={fileList}
                  setFileList={setFileList}
                />
              </Form.Item>
              <Form.Item
                label="风险识别"
                name="风险识别"
                rules={[{ required: true }]}
              >
                <Input.TextArea
                  autoSize={{ minRows: 2, maxRows: 6 }}
                  style={{ background: "rgb(250, 250, 250)" }}
                />
              </Form.Item>
              <Form.Item label="临时措施">
                <CommonEditTable
                  columnsItems={columnsItems}
                  dataSource={tb_data}
                  setTbData={setTbData}
                />
              </Form.Item>
              <Form.Item
                label="评审部门"
                name="评审部门"
                rules={[{ required: true }]}
              >
                <Checkbox.Group
                  options={[
                    "QC工程师",
                    "计划部",
                    "制造部",
                    "研发技术部",
                    "长晶生产车间",
                    "原料合成车间",
                    "坩埚车间",
                    "设备动力科",
                  ].map((dpt) => ({
                    label: dpt,
                    value: dpt,
                    disabled:
                      disabled ||
                      ["QC工程师", "计划部", "制造部", "研发技术部"].includes(
                        dpt
                      ),
                  }))}
                />
              </Form.Item>
            </Flex>
          </Form>
          <Flex justify="end" style={{ marginTop: 10 }} gap={20}>
            <Button onClick={reback}>撤回</Button>
            <Button type="primary" onClick={submit} disabled={disabled}>
              提交
            </Button>
          </Flex>
        </Spin>
      </Card>
    </Flex>
  );
};
const RES_LIST = ["返工", "返修", "挑选", "让步接收", "报废", "特采", "退货"];
const ChildOpinion = memo(
  ({ id = "", department = "", obj = null, reFresh, disabled = false }) => {
    const [form] = Form.useForm();
    const [load, setLoad] = useState(false);
    const submit = async () => {
      if (!id) {
        message.warning("请先选择编号");
        return;
      }
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
      values["部门"] = department;
      values["review_id"] = id;
      setLoad(true);
      qmsNoReview2(
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
    useEffect(() => {
      if (obj) {
        form.setFieldsValue(obj);
      } else {
        form.resetFields();
      }
    }, [id, obj]);
    return (
      <Spin spinning={load}>
        <Form
          form={form}
          initialValues={{
            不合格品处理: "",
            输入意见: "",
            签名: "",
            时间: dayjs().format(timeFormat),
          }}
          {...ComputeFormCol(3)}
          disabled={disabled}
        >
          <Flex vertical gap={10}>
            <Form.Item
              label="不合格品处理"
              name="不合格品处理"
              rules={[{ required: true }]}
            >
              <Radio.Group options={RES_LIST} />
            </Form.Item>
            <Form.Item
              label="输入意见"
              name="输入意见"
              rules={[{ required: true }]}
            >
              <Input.TextArea
                autoSize={{ minRows: 2, maxRows: 6 }}
                style={{ background: "rgb(250, 250, 250)" }}
              />
            </Form.Item>
            <Form.Item label="签名" name="签名" rules={[{ required: true }]}>
              <Input style={{ width: 208 }} />
            </Form.Item>
            <Form.Item
              label="时间"
              name="时间"
              getValueProps={(value) => {
                return {
                  value: value && dayjs(value),
                };
              }}
              normalize={(value) => value && dayjs(value).format(timeFormat)}
              rules={[{ required: true }]}
            >
              <DatePicker showTime allowClear={false} />
            </Form.Item>
            <Flex justify="end">
              <Button type="primary" onClick={submit}>
                确认
              </Button>
            </Flex>
          </Flex>
        </Form>
      </Spin>
    );
  }
);
export const NoReview = ({
  id = "",
  review_data = {},
  reFresh = () => {},
  disabled = false,
}) => {
  const [collapse_items, setCollapseItems] = useState([]);
  const [form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const submit = async () => {
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
    values["review_id"] = id;
    setLoad(true);
    qmsNoReview2Total(
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
  useEffect(() => {
    const { 最终结果 = "", 部门意见 = {}, 责任人 = "" } = review_data;
    form.setFieldsValue({ 最终结果, 责任人 });
    let department_lit = Object.keys(部门意见);
    let colp_list = [];
    department_lit.forEach((item) => {
      // 需要一个决策状态
      let person = 部门意见?.[item]?.["责任人"] ?? "";
      colp_list.push({
        key: item,
        label: <div className="ocap_title">{`${item} (${person})`}</div>,
        children: (
          <ChildOpinion
            id={id}
            department={item}
            obj={部门意见[item] || null}
            disabled={disabled}
            reFresh={reFresh}
          />
        ),
      });
    });
    setCollapseItems(colp_list);
  }, [review_data]);

  return (
    <Flex vertical gap={16}>
      <div className="no_review_title">不合格评审</div>
      <Card>
        <Spin spinning={load}>
          <Collapse
            defaultActiveKey={[
              "QC工程师",
              "研发技术部",
              "制造部",
              "计划部",
              "其他",
            ]}
            ghost
            items={collapse_items}
          />
          <Form
            form={form}
            initialValues={{
              最终结果: "",
              责任人: "",
            }}
            disabled={disabled}
          >
            <Flex vertical gap={10}>
              <Form.Item
                label="最终结果"
                name="最终结果"
                rules={[{ required: true }]}
              >
                <Radio.Group options={RES_LIST} />
              </Form.Item>
              <Flex gap={30}>
                <Form.Item
                  label="责任人"
                  name="责任人"
                  rules={[{ required: true }]}
                >
                  <Input style={{ width: 200 }} />
                </Form.Item>
                <Button type="primary" onClick={submit}>
                  确认
                </Button>
              </Flex>
            </Flex>
          </Form>
        </Spin>
      </Card>
    </Flex>
  );
};

export const QmReview = ({
  id = "",
  review_data = {},
  disabled = false,
  reFresh = () => {},
}) => {
  const [form] = Form.useForm();
  const [reject_form] = Form.useForm();
  const [form_] = Form.useForm();
  const originalValueRef = useRef();
  const [load, setLoad] = useState(false);
  const [modal, contextHolder] = Modal.useModal();

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
    values["review_id"] = id;
    values["操作"] = opt;
    values["驳回原因"] = reason;
    setLoad(true);
    qmsNoReviewQm(
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
  const handleReject = () => {
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
  useEffect(() => {
    const { 签名, 最终结果, 原因 } = review_data;
    form.setFieldsValue({ 最终结果, 签名, 原因 });
    originalValueRef.current = 最终结果;
  }, [review_data]);

  return (
    <Flex vertical gap={16}>
      {contextHolder}
      <div className="no_review_title">质量部长审批</div>
      <Card>
        <Spin spinning={load}>
          <Form
            form={form}
            initialValues={{
              签名: "",
              最终结果: "",
              原因: "",
            }}
            disabled={disabled}
          >
            <Flex vertical gap={20}>
              <Form.Item
                label="最终结果"
                name="最终结果"
                rules={[{ required: true }]}
              >
                <Radio.Group
                  options={RES_LIST}
                  onChange={(e) => {
                    form_.setFieldsValue({
                      reason: form.getFieldValue("原因"),
                    });
                    Modal.confirm({
                      title: "确认修改",
                      content: (
                        <Form form={form_}>
                          <Form.Item name="reason">
                            <Input.TextArea placeholder="原因" rows={4} />
                          </Form.Item>
                        </Form>
                      ),
                      onOk: () => {
                        form.setFieldsValue({
                          最终结果: e.target.value,
                          原因: form_.getFieldValue("reason"),
                        });
                        originalValueRef.current = e.target.value;
                      },
                      onCancel: () => {
                        form.setFieldsValue({
                          最终结果: originalValueRef.current,
                        });
                      },
                      okText: "确认",
                      cancelText: "取消",
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="原因" name="原因">
                <Input style={{ width: 200 }} />
              </Form.Item>

              <Form.Item label="签名" name="签名" rules={[{ required: true }]}>
                <Input style={{ width: 200 }} />
              </Form.Item>
              <Space>
                <Button type="primary" onClick={() => submit("通过")}>
                  通过
                </Button>
                <Button type="primary" danger onClick={handleReject}>
                  驳回
                </Button>
                <Button type="primary" onClick={() => submit("同意报总经理")}>
                  同意报总经理
                </Button>
              </Space>
            </Flex>
          </Form>
        </Spin>
      </Card>
    </Flex>
  );
};
export const GmReview = ({
  id = "",
  review_data = {},
  disabled = false,
  reFresh = () => {},
}) => {
  const [form] = Form.useForm();
  const [reject_form] = Form.useForm();
  const [form_] = Form.useForm();
  const originalValueRef = useRef();
  const [load, setLoad] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
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
    values["review_id"] = id;
    values["操作"] = opt;
    values["驳回原因"] = reason;
    setLoad(true);
    qmsNoReviewVp(
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
  const handleReject = () => {
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
  useEffect(() => {
    const { 最终结果, 质量部长审批, 原因 } = review_data;
    let r = 最终结果 ? 最终结果 : 质量部长审批["最终结果"];
    form.setFieldsValue({ 最终结果: r, 原因 });
    originalValueRef.current = r;
  }, [review_data]);
  return (
    <Flex vertical gap={16}>
      {contextHolder}
      <div className="no_review_title">总经理审批</div>
      <Card>
        <Spin spinning={load}>
          <Form
            form={form}
            initialValues={{
              最终结果: "",
              原因: "",
            }}
            disabled={disabled}
          >
            <Flex vertical gap={20}>
              <Form.Item
                label="最终结果"
                name="最终结果"
                rules={[{ required: true }]}
              >
                <Radio.Group
                  options={RES_LIST}
                  onChange={(e) => {
                    form_.setFieldsValue({
                      reason: form.getFieldValue("原因"),
                    });
                    Modal.confirm({
                      title: "确认修改",
                      content: (
                        <Form form={form_}>
                          <Form.Item name="reason">
                            <Input.TextArea placeholder="原因" rows={4} />
                          </Form.Item>
                        </Form>
                      ),
                      onOk: () => {
                        form.setFieldsValue({
                          最终结果: e.target.value,
                          原因: form_.getFieldValue("reason"),
                        });
                        originalValueRef.current = e.target.value;
                      },
                      onCancel: () => {
                        form.setFieldsValue({
                          最终结果: originalValueRef.current,
                        });
                      },
                      okText: "确认",
                      cancelText: "取消",
                    });
                  }}
                />
              </Form.Item>
              <Form.Item label="原因" name="原因">
                <Input style={{ width: 200 }} />
              </Form.Item>
              <Space>
                <Button type="primary" onClick={() => submit("通过")}>
                  通过
                </Button>
                <Button type="primary" danger onClick={handleReject}>
                  驳回
                </Button>
              </Space>
            </Flex>
          </Form>
        </Spin>
      </Card>
    </Flex>
  );
};

export const NoTrace = ({
  id = "",
  review_data = {},
  disabled = false,
  reFresh = () => {},
}) => {
  const [tb_data, setTbData] = useState([]);
  const [load, setLoad] = useState(false);
  const [fileList1, setFileList1] = useState([]);
  const [fileList2, setFileList2] = useState([]);
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");
  const [form] = Form.useForm();
  const submitTb = () => {
    const formData = new FormData();
    let items = [];
    tb_data.forEach((item) => {
      let { key, 照片, ...rest } = item;
      if (照片 && 照片.length > 0) {
        if (照片[0].uid.startsWith("-")) {
          formData.append(
            "images",
            new File([base64ToBlob(照片[0].url)], 照片[0].name, {
              type: 照片[0].mimetype || "image/png",
              lastModified: new Date().getTime(),
            })
          );
        } else {
          formData.append("images", 照片[0].originFileObj);
        }
      } else {
        formData.append("images", new Blob([], { type: "text/plain" }));
      }
      items.push(rest);
    });
    let val = {};
    val["不合格处置执行跟踪"] = items;
    val["review_id"] = id;
    formData.append("request_data", JSON.stringify(val));
    setLoad(true);
    qmsNoReview4(
      formData,
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
  const submit = async () => {
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

    const formData = new FormData();
    if (fileList1.length > 0) {
      const fileBlob = new Blob([fileList1[0].originFileObj], {
        type: fileList1[0].type,
      });
      formData.append("eight_d_report", fileBlob, fileList1[0].name);
    }

    if (fileList2.length > 0) {
      const fileBlob = new Blob([fileList2[0].originFileObj], {
        type: fileList2[0].type,
      });
      formData.append("corrective_measures_plan", fileBlob, fileList2[0].name);
    }
    values["review_id"] = id;
    formData.append("request_data", JSON.stringify(values));
    setLoad(true);
    qmsNoReview5(
      formData,
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
  const priview = (url) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      message.warning("没有预览文件");
    }
  };
  const columnsItems = [
    { name: "主要事项", type: "text_area" },
    { name: "责任人", type: "input" },
    { name: "计划完成时间", type: "time", width: 160 },
    { name: "实际完成时间", type: "time", width: 160 },
    { name: "备注", type: "text_area" },
    { name: "照片", type: "image" },
  ];
  useEffect(() => {
    const { 不合格处置执行跟踪 = [], 跟踪报告 = {} } = review_data;
    let new_tb = 不合格处置执行跟踪.map((item, index) => {
      let { item_id, 图片, ...rest } = item;
      let picture = 图片
        ? [
            {
              uid: `-${index}`,
              name: `image_${index}.png`,
              url: 图片,
            },
          ]
        : [];
      return { key: item_id || index, 照片: picture, ...rest };
    });
    setTbData(new_tb);
    const {
      是否需要启动8D,
      是否需要启动纠正和预防措施,
      上传8D报告 = "",
      纠正与预防措施计划 = "",
    } = 跟踪报告;
    form.setFieldsValue({ 是否需要启动8D, 是否需要启动纠正和预防措施 });
    setUrl1(上传8D报告);
    setUrl2(纠正与预防措施计划);
  }, [review_data]);
  return (
    <Flex vertical gap={16}>
      <div className="no_review_title">不合格处置跟踪</div>
      <Card>
        <Spin spinning={load}>
          <Form
            form={form}
            initialValues={{
              是否需要启动8D: "",
              是否需要启动纠正和预防措施: "",
            }}
            disabled={disabled}
          >
            <Flex vertical gap={10}>
              <CommonEditTable
                columnsItems={columnsItems}
                dataSource={tb_data}
                setTbData={setTbData}
              />
              <Flex justify="end">
                <Button type="primary" onClick={submitTb}>
                  确认
                </Button>
              </Flex>

              <Divider />
              <Form.Item
                name="是否需要启动8D"
                label="是否需要启动8D"
                rules={[{ required: true }]}
              >
                <Radio.Group options={["需要", "不需要"]} />
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prev, current) =>
                  prev.是否需要启动8D !== current.是否需要启动8D
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue("是否需要启动8D") === "需要" && (
                    <>
                      {disabled ? (
                        <a onClick={() => priview(url1)}>点击查看报告</a>
                      ) : (
                        <FileUpload
                          name="上传8D报告"
                          fileList={fileList1}
                          setFileList={setFileList1}
                          accept=".pdf"
                        />
                      )}
                    </>
                  )
                }
              </Form.Item>
              <Form.Item
                name="是否需要启动纠正和预防措施"
                label="是否需要启动纠正和预防措施"
                rules={[{ required: true }]}
              >
                <Radio.Group options={["需要", "不需要"]} />
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prev, current) =>
                  prev.是否需要启动纠正和预防措施 !==
                  current.是否需要启动纠正和预防措施
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue("是否需要启动纠正和预防措施") === "需要" && (
                    <>
                      {disabled ? (
                        <a onClick={() => priview(url2)}>点击查看报告</a>
                      ) : (
                        <FileUpload
                          name="上传纠正和预防措施计划"
                          fileList={fileList2}
                          setFileList={setFileList2}
                          accept=".pdf"
                        />
                      )}
                    </>
                  )
                }
              </Form.Item>
              <Text type="danger"> *注: 报告格式限制为.pdf</Text>
              <Flex justify="end">
                <Button type="primary" onClick={submit}>
                  确认
                </Button>
              </Flex>
              <Flex justify="end">
                <Button type="primary" onClick={submit}>
                  确认文件
                </Button>
              </Flex>
            </Flex>
          </Form>
        </Spin>
      </Card>
    </Flex>
  );
};
