import React, { useEffect, useState } from "react";
import { CommonCard } from "../../../../../../components/CommonCard";
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
} from "antd";
import { timeFormat } from "../../../../../../utils/string";
import dayjs from "dayjs";
import { ComputeFormCol } from "../../../../../../utils/obj";
import {
  qmsStep3,
  qmsStep4confirm,
  qmsStep4ipt,
  qmsStep4vp,
} from "../../../../../../apis/qms_router";

const ChildOpinion = React.memo(
  ({ id = "", department = "", obj = null, requestData }) => {
    const [form] = Form.useForm();
    const submit = async () => {
      let val = await form.validateFields();
      qmsStep3(
        {
          review_id: id,
          department: department,
          opinion: val,
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
      if (obj) {
        form.setFieldsValue(obj);
      }
    }, [obj]);
    return (
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
          <Form.Item label="签名" name="signature" rules={[{ required: true }]}>
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
            <Button type="primary" onClick={submit} disabled>
              确认
            </Button>
          </Flex>
        </Flex>
      </Form>
    );
  }
);

function DisposalOpinion({
  id = "",
  data = null,
  detail = null,
  refresh = () => {},
}) {
  const [collapse_items, setCollapseItems] = useState([]);
  const [is_leader, setIsLeader] = useState(false);
  const [form] = Form.useForm();
  const submit1 = () => {
    const { 最终结果 = "" } = form.getFieldsValue();
    if (最终结果 === "") {
      message.warning("请填写完整信息！");
      return;
    }
    qmsStep4ipt(
      {
        review_id: id,
        final_decision: 最终结果,
        need_vp_sign: is_leader,
      },
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          message.success("提交成功");
          refresh();
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
    const { 质量部长 = "" } = form.getFieldsValue();
    if (质量部长 === "") {
      message.warning("请填写完整信息！");
      return;
    }
    qmsStep4confirm(
      {
        review_id: id,
        qm_signature: 质量部长,
      },
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          message.success("提交成功");
          refresh();
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
    const { 副总 = "" } = form.getFieldsValue();
    if (副总 === "") {
      message.warning("请填写完整信息！");
      return;
    }
    qmsStep4vp(
      {
        review_id: id,
        vp_signature: 副总,
      },
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          message.success("提交成功");
          refresh();
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
            obj={data ? data[item] : null}
          />
        ),
      });
    });
    setCollapseItems(colp_list);
  }, [id, data]);
  useEffect(() => {
    if (detail) {
      const {
        need_vp_sign = false,
        final_decision = "",
        quality_manager_signature = "",
        vp_signature = "",
      } = detail;
      setIsLeader(need_vp_sign);
      form.setFieldsValue({
        最终结果: final_decision,
        副总: vp_signature,
        质量部长: quality_manager_signature,
      });
    }
  }, [id, detail]);
  return (
    <CommonCard name="处置意见">
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
        initialValues={{ 最终结果: "", 副总: "", 质量部长: "" }}
      >
        <Flex vertical gap={10}>
          <Flex align="center" gap={20}>
            <Form.Item label="最终结果" name="最终结果">
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

            <Button type="primary" onClick={submit1} disabled>
              确认
            </Button>
          </Flex>
          <Form.Item label="质量部长">
            <Flex align="center" gap={20}>
              <Form.Item name="质量部长">
                <Input placeholder="请签名" />
              </Form.Item>
              <Button type="primary" onClick={submit2} disabled>
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
                <Form.Item name="副总">
                  <Input placeholder="请签名" />
                </Form.Item>
                <Button type="primary" onClick={submit3} disabled>
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
    </CommonCard>
  );
}

export default DisposalOpinion;
