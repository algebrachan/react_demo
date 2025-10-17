import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Collapse,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Select,
  Switch,
} from "antd";
import { CommonCard } from "../../../../../../components/CommonCard";
import { selectList2Option } from "../../../../../../utils/string";
import { DeleteTwoTone, PlusOutlined } from "@ant-design/icons";
import {
  addReasonAnlsDepartment,
  closeZhuandan,
  getReasonAnalysis,
  submitReasonAnalysis,
} from "../../../../../../apis/ocap_api";
import "./comp.less";
import { RecommendedComp, StatusGreen, StatusRed } from "./common";
import { useDispatch, useSelector } from "react-redux";
import { setCommonParam } from "../../../../mngSlice";
const { TextArea } = Input;
const ZhuandanModal = ({
  open = false,
  id,
  onCancel,
  setIsZhuandan,
  requestData,
}) => {
  const [form] = Form.useForm();
  const department = ["设备", "工艺"];
  const handleOk = async () => {
    let val = await form.validateFields();
    const param = { ...val, _id: id };
    addReasonAnlsDepartment(
      param,
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          setIsZhuandan(true);
          requestData();
          onCancel();
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
    if (open) {
      form.resetFields();
    }
  }, [open]);

  return (
    <Modal
      title="转单"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="确定"
      cancelText="取消"
      width={560}
      footer={[
        <Button key="back" onClick={onCancel}>
          取消
        </Button>,
        <Button key="reset" onClick={() => form.resetFields()}>
          重置
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          确认
        </Button>,
      ]}
    >
      <Form
        form={form}
        initialValues={{ 转单: [{ 转单部门: "", 转单人: "" }] }}
      >
        <Form.List name="转单">
          {(fields, { add, remove }) => (
            <Flex vertical gap={10}>
              {fields.map(({ key, name, ...restField }) => (
                <Flex key={key} align="center" justify="space-between">
                  <Form.Item
                    {...restField}
                    label="转单部门"
                    name={[name, "转单部门"]}
                    rules={[{ required: true }]}
                  >
                    <Select
                      options={selectList2Option(department)}
                      style={{ width: 160 }}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="转单人"
                    name={[name, "转单人"]}
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="请输入" style={{ width: 160 }} />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <DeleteTwoTone
                      style={{ fontSize: 20 }}
                      onClick={() => remove(name)}
                    />
                  ) : (
                    <div>&nbsp;</div>
                  )}
                </Flex>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add({})}
                  block
                  icon={<PlusOutlined />}
                >
                  新增
                </Button>
              </Form.Item>
            </Flex>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};
const reason_arr = [
  "末端电极，电极开度变大，热量上升，B部石英砂移动较多，导致b厚度下降",
  "水温偏低，导致熔制未完全，B度厚度偏薄",
];

const ChildReason = React.memo(
  ({ id = "", obj = {}, flag = false, requestData }) => {
    const dispatch = useDispatch();
    const refresh_count = useSelector(
      (state) => state.mng.ocap["refresh_count"]
    );
    const [form] = Form.useForm();
    const useReson = (idx) => {
      const val = form.getFieldValue("原因");
      form.setFieldsValue({
        原因: val ? val + "\n" + reason_arr[idx] : reason_arr[idx],
      });
    };
    const submitReason = () => {
      const { 原因 = "" } = form.getFieldsValue();
      if (原因.trim() === "") {
        message.warning("请输入原因");
        return;
      }
      let val = {
        _id: id,
        key: obj["key"],
        原因,
      };
      submitReasonAnalysis(
        val,
        (res) => {
          const { code, msg, data } = res.data;
          if (code === 0 && data) {
            message.success(msg);
            dispatch(
              setCommonParam({
                param_name: "ocap",
                param_val: { refresh_count: refresh_count + 1 },
              })
            );
            requestData();
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
      const { 原因 = "" } = obj;
      form.setFieldsValue({ 原因 });
    }, [obj]);
    return (
      <Flex vertical gap={5}>
        {!flag && <div>负责人:{obj.负责人}</div>}
        <Form form={form} initialValues={{ 原因: "" }}>
          <Form.Item name="原因">
            <TextArea
              autoSize={{ minRows: 3, maxRows: 6 }}
              style={{ background: "#FAFAFA" }}
              placeholder="请输入"
            />
          </Form.Item>
        </Form>
        {flag && (
          <div style={{ color: "#FF3B30" }}>提示：此处请填写制造相关原因</div>
        )}
        <RecommendedComp arr={reason_arr} useReson={useReson} />
        <Flex justify="end">
          <Button type="primary" onClick={submitReason}>
            确认
          </Button>
        </Flex>
      </Flex>
    );
  }
);

function ReasonAnls({ id = "" }) {
  const [is_zhuandan, setIsZhuandan] = useState(false);
  const [is_modal, setIsModal] = useState(false);
  const [reason_content, setReasonContent] = useState({});
  const [collapse_items, setCollapseItems] = useState([]);

  const requestData = () => {
    getReasonAnalysis(
      { _id: id },
      (res) => {
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          setReasonContent(data);
        }
      },
      () => {}
    );
  };

  const closeZd = () => {
    closeZhuandan(
      { _id: id },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          message.success(msg);
        } else message.error(msg);
      },
      () => {
        message.error("网络异常");
      }
    );
    setIsZhuandan(false);
  };

  useEffect(() => {
    if (Object.keys(reason_content).length > 0) {
      const { 是否转单 = false, 工艺原因 = [], 设备原因 = [] } = reason_content;
      if (是否转单) {
        // 生成下载列表
        let colp_list = [];
        if (工艺原因.length > 0) {
          // 判断原因输入情况
          let status = 工艺原因.some((item) => item["原因"] === "");
          colp_list.push({
            key: "工艺原因",
            label: (
              <Flex gap={10} align="center">
                <div className="ocap_title">工艺原因</div>
                {status ? <StatusRed /> : <StatusGreen />}
              </Flex>
            ),
            children: (
              <Flex vertical>
                {工艺原因.map((item, _) => (
                  <ChildReason
                    key={_}
                    id={id}
                    requestData={requestData}
                    obj={item}
                  />
                ))}
              </Flex>
            ),
          });
        }
        if (设备原因.length > 0) {
          // 判断原因输入情况
          let status = 设备原因.some((item) => item["原因"] === "");
          colp_list.push({
            key: "设备原因",
            label: (
              <Flex gap={10} align="center">
                <div className="ocap_title">设备原因</div>
                {status ? <StatusRed /> : <StatusGreen />}
              </Flex>
            ),
            children: (
              <Flex vertical>
                {设备原因.map((item, _) => (
                  <ChildReason
                    key={_}
                    id={id}
                    requestData={requestData}
                    obj={item}
                  />
                ))}
              </Flex>
            ),
          });
        }
        setCollapseItems(colp_list);
        setIsZhuandan(true);
      }
    }
  }, [reason_content]);

  useEffect(() => {
    if (id) {
      requestData();
    }
  }, [id]);
  return (
    <CommonCard name="原因分析">
      <Flex vertical gap={10} className="ocap_reason_root">
        <Flex gap={10} align="center">
          <div className="ocap_title">现场原因</div>
          <div style={{ marginLeft: 10 }}>是否转单</div>
          <Switch
            size="small"
            checked={is_zhuandan}
            onChange={(val) => {
              if (val) {
                setIsModal(true);
              } else {
                closeZd();
              }
            }}
          />
        </Flex>
        <ChildReason
          flag={true}
          id={id}
          requestData={requestData}
          obj={reason_content["现场原因"]}
        />
        {is_zhuandan && (
          <Collapse
            defaultActiveKey={["工艺原因", "设备原因"]}
            ghost
            items={collapse_items}
          />
        )}
      </Flex>
      <ZhuandanModal
        id={id}
        open={is_modal}
        onCancel={() => setIsModal(false)}
        setIsZhuandan={setIsZhuandan}
        requestData={requestData}
      />
    </CommonCard>
  );
}

export default ReasonAnls;
