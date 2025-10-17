import React, { useEffect, useState, memo } from "react";
import {
  Button,
  Checkbox,
  Collapse,
  DatePicker,
  Flex,
  Form,
  Input,
  message,
  Radio,
  Card,
  Space,
  Spin,
} from "antd";
import { timeFormat } from "@/utils/string";
import dayjs from "dayjs";
import { ComputeFormCol } from "@/utils/obj";
import {
  qmsStep3,
  qmsStep4confirm,
  qmsStep4ipt,
  qmsStep4vp,
} from "@/apis/qms_router";

const ChildOpinion = memo(
  ({ id = "", department = "", obj = null, requestData }) => {
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
      setLoad(true);
      qmsStep3(
        {
          review_id: id,
          department: department,
          opinion: values,
        },
        (res) => {
          setLoad(false);
          const { code, data, msg } = res.data;
          if (code === 0 && data) {
            message.success("提交成功");
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
            disposition: "",
            comment: "",
            signature: "",
            confirmation_time: dayjs().format(timeFormat),
          }}
          {...ComputeFormCol(2)}
        >
          <Flex vertical gap={10}>
            <Form.Item
              label="不合格品处理"
              name="disposition"
              rules={[{ required: true }]}
            >
              <Radio.Group
                options={[
                  "返工",
                  "返修",
                  "挑选",
                  "让步接收",
                  "报废",
                  "特采",
                  "退货",
                ]}
              />
            </Form.Item>
            <Form.Item
              label="输入意见"
              name="comment"
              rules={[{ required: true }]}
            >
              <Input.TextArea
                autoSize={{ minRows: 2, maxRows: 6 }}
                style={{ background: "rgb(250, 250, 250)" }}
              />
            </Form.Item>
            <Form.Item
              label="签名"
              name="signature"
              rules={[{ required: true }]}
            >
              <Input style={{ width: 208 }} />
            </Form.Item>
            <Form.Item
              label="时间"
              name="confirmation_time"
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

function UnqualifiedReview({ order_record = {}, review_data = {} }) {
  const [id, setId] = useState("");
  const [collapse_items, setCollapseItems] = useState([]);
  const [is_leader, setIsLeader] = useState(false);
  const [form] = Form.useForm();
  const submit1 = () => {
    const { final_decision = "" } = form.getFieldsValue();
    if (final_decision === "") {
      message.warning("请填写完整信息！");
      return;
    }
    qmsStep4ipt(
      {
        review_id: id,
        final_decision,
        need_vp_sign: is_leader,
      },
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          message.success("提交成功");
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("提交失败");
      }
    );
  };
  const submit2 = () => {
    const { quality_manager_signature = "" } = form.getFieldsValue();
    if (quality_manager_signature === "") {
      message.warning("请填写完整信息！");
      return;
    }
    qmsStep4confirm(
      {
        review_id: id,
        qm_signature: quality_manager_signature,
      },
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          message.success("提交成功");
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("提交失败");
      }
    );
  };
  const submit3 = () => {
    const { vp_signature = "" } = form.getFieldsValue();
    if (vp_signature === "") {
      message.warning("请填写完整信息！");
      return;
    }
    qmsStep4vp(
      {
        review_id: id,
        vp_signature,
      },
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          message.success("提交成功");
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("提交失败");
      }
    );
  };

  useEffect(() => {
    setId(order_record["编号"] ?? "");
    const { department_opinions, final_disposition } = review_data;
    let colp_list = [];
    ["QC工程师", "研发技术部", "制造部", "计划部", "其他"].forEach((item) => {
      // 需要一个决策状态
      colp_list.push({
        key: item,
        label: <div className="ocap_title">{item}</div>,
        children: (
          <ChildOpinion
            id={id}
            department={item}
            obj={department_opinions?.[item] ?? null}
          />
        ),
      });
    });
    setCollapseItems(colp_list);
    setIsLeader(final_disposition?.["need_vp_sign"] ?? false);
    if (final_disposition) {
      form.setFieldsValue(final_disposition);
    } else {
      form.resetFields();
    }
  }, [order_record, review_data]);
  return (
    <Card>
      <Space>
        <span>编号:</span>
        <Input
          style={{ width: 300 }}
          value={id}
          disabled
          placeholder="请选择编号"
        />
      </Space>
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
          final_decision: "",
          vp_signature: "",
          quality_manager_signature: "",
        }}
      >
        <Flex vertical gap={10}>
          <Flex align="center" gap={20}>
            <Form.Item label="最终结果" name="final_decision">
              <Radio.Group
                options={[
                  "返工",
                  "返修",
                  "让步接收",
                  "报废",
                  "挑选",
                  "拒收",
                  "特采",
                  "退货",
                ]}
              />
            </Form.Item>

            <Button type="primary" onClick={submit1}>
              确认
            </Button>
          </Flex>
          <Form.Item label="质量部长">
            <Flex align="center" gap={20}>
              <Form.Item name="quality_manager_signature">
                <Input placeholder="请签名" />
              </Form.Item>
              <Button type="primary" onClick={submit2}>
                确认
              </Button>
            </Flex>
          </Form.Item>
          <Checkbox
            onChange={(e) => setIsLeader(e.target.checked)}
            checked={is_leader}
          >
            副总签字
          </Checkbox>
          {is_leader && (
            <Form.Item label="副总">
              <Flex align="center" gap={20}>
                <Form.Item name="vp_signature">
                  <Input placeholder="请签名" />
                </Form.Item>
                <Button type="primary" onClick={submit3}>
                  确认
                </Button>
              </Flex>
            </Form.Item>
          )}
          <div style={{ color: "red" }}>
            <p>注:</p>
            <p>1、需副总以上领导参与评审的不合格:</p>
            <p>*质量损失金额超过5万元时</p>
            <p>*各部门评审意见有分歧时</p>
            <p>2、评审参与部门:</p>
            <p>
              质量管理部、研发技术部、制造部例行参与不合格品评审，其他部门可根据问题涉及范围按需参与评审
            </p>
          </div>
        </Flex>
      </Form>
    </Card>
  );
}

export default UnqualifiedReview;
