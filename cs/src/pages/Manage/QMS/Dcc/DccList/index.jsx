import React, { useEffect, useState } from "react";
import {
  Form,
  Flex,
  DatePicker,
  Button,
  Table,
  Select,
  Input,
  Space,
  message,
  Popconfirm,
  Modal,
} from "antd";
import {
  dateFormat,
  selectList2Option,
  selectList2OptionAll,
} from "../../../../../utils/string";
import { useNavigate } from "react-router-dom";
import { DEPARTMENT_LIST, FILE_RANK, TIME_RANGE, URGENCY } from "../Bpm/common";
import { useSelector } from "react-redux";
import {
  qmsDccCloseProcess,
  qmsDccControlFile,
  qmsDccFilterProcess,
} from "../../../../../apis/nc_review_router";
import dayjs from "dayjs";

const CtrlModal = ({ open, cur_data, onCancel }) => {
  const [form] = Form.useForm();
  const handleSubmit = () => {
    const val = form.getFieldsValue();
    val["process_id"] = cur_data["流程单号"];
    qmsDccControlFile(
      val,
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0) {
          message.success("操作成功");
          onCancel();
        }
      },
      () => {
        // message.error("网络异常");
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
      title="设置生效时间"
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="提交"
      cancelText="取消"
    >
      <Form
        form={form}
        initialValues={{
          生效日期: dayjs().format(dateFormat),
        }}
        style={{ padding: 10 }}
      >
        <Form.Item
          name="生效日期"
          label="生效日期"
          rules={[{ required: true }]}
          getValueProps={(value) => {
            return {
              value: value && dayjs(value),
            };
          }}
          normalize={(value) => value && dayjs(value).format(dateFormat)}
        >
          <DatePicker style={{ width: "100%" }} allowClear={false} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

function DccList() {
  const navigate = useNavigate();
  const { cur_dcc_file_type } = useSelector((state) => state.mng.qms);
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [cur_data, setCurData] = useState(null);
  const [query_from] = Form.useForm();
  const [query_opt] = useState({
    状态: [
      "全部",
      "待审核",
      "内容审核",
      "格式审核",
      "合规性审核",
      "实用性审核",
      "完成",
    ],
  });
  const [is_modal, setIsModal] = useState(false);
  const tb_header = [
    "文件编号",
    "文件申请类型",
    "文件级别",
    "文件名称",
    "文件版本",
    "状态",
    "流程",
    "编辑人",
    "部门名称",
    "申请时间",
  ];
  const columns = [
    {
      title: "流程单号",
      dataIndex: "流程单号",
      key: "流程单号",
      width: 80,
    },
    ...tb_header.map((header) => ({
      title: header,
      dataIndex: header,
      key: header,
      //   width: 10,
    })),
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() =>
              navigate("/mng/qms_dcc/bpm", {
                state: { 流程单号: record["流程单号"] },
              })
            }
          >
            审核
          </Button>
          {record["是否受控"] ? (
            <span>已受控</span>
          ) : (
            <Button
              size="small"
              onClick={() => {
                setCurData(record);
                setIsModal(true);
              }}
            >
              受控
            </Button>
          )}
          <Popconfirm
            title="警告"
            description="确认关闭该条流程?"
            onConfirm={() => close(record["流程单号"])}
            okText="确认"
            cancelText="取消"
          >
            <Button size="small" danger>
              关闭
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const close = (process_id) => {
    qmsDccCloseProcess(
      { process_id },
      (res) => {
        const { code, msg } = res.data;
        if (code === 0) {
          message.success("关闭成功");
          query();
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };

  const pagination = () => {
    return {
      position: ["bottomCenter"],
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
    };
  };

  const query = () => {
    const values = query_from.getFieldsValue();
    const { 范围, ...other } = values;
    if (范围 > 0) {
      other["申请时间"] = [
        dayjs().subtract(范围, "month").format(dateFormat),
        dayjs().format(dateFormat),
      ];
    } else if (范围 === 0) {
      other["申请时间"] = [];
    } else if (范围 === -1) {
    }
    other["查询类型"] = cur_dcc_file_type;
    setTbLoad(true);
    qmsDccFilterProcess(
      other,
      (res) => {
        setTbLoad(false);
        const { code, data, msg } = res.data;
        if (code === 0) {
          setTbData(data || []);
        } else {
          setTbData([]);
          message.error(msg);
        }
      },
      () => {
        setTbLoad(false);
        setTbData([]);
        message.error("网络异常");
      }
    );
  };
  useEffect(() => {
    query();
  }, [cur_dcc_file_type]);
  return (
    <Flex gap={16} vertical>
      <Form
        form={query_from}
        initialValues={{
          文件申请类型: "全部",
          文件级别: "全部",
          编辑人: "",
          状态: "全部",
          申请部门: "全部",
          紧急程度: "全部",
          范围: 1,
          申请时间: [
            dayjs().subtract(7, "day").format(dateFormat),
            dayjs().format(dateFormat),
          ],
        }}
      >
        <Flex gap={16} wrap="wrap">
          <Form.Item label="文件申请类型" name="文件申请类型">
            <Select
              options={selectList2OptionAll([
                "新增",
                "更改",
                "接收外来文件",
                "作废",
              ])}
              style={{ width: 120 }}
            />
          </Form.Item>
          <Form.Item label="文件级别" name="文件级别">
            <Select
              options={selectList2OptionAll(FILE_RANK)}
              style={{ width: 100 }}
            />
          </Form.Item>
          <Form.Item label="申请部门" name="申请部门">
            <Select
              options={selectList2OptionAll(DEPARTMENT_LIST)}
              style={{ width: 130 }}
            />
          </Form.Item>
          <Form.Item label="紧急程度" name="紧急程度">
            <Select
              options={selectList2OptionAll(URGENCY)}
              style={{ width: 100 }}
            />
          </Form.Item>
          <Form.Item label="编辑人" name="编辑人">
            <Input placeholder="请输入" style={{ width: 120 }} />
          </Form.Item>
          <Form.Item label="状态" name="状态">
            <Select
              options={selectList2Option(query_opt.状态 || [])}
              style={{ width: 120 }}
            />
          </Form.Item>
          <Form.Item label="范围" name="范围">
            <Select options={TIME_RANGE} style={{ width: 100 }} />
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prev, current) => prev.范围 !== current.范围}
          >
            {({ getFieldValue }) =>
              getFieldValue("范围") === -1 && (
                <Form.Item
                  name="申请时间"
                  getValueProps={(value) => {
                    return {
                      value: value && value.map((e) => dayjs(e)),
                    };
                  }}
                  normalize={(value) =>
                    value && value.map((e) => dayjs(e).format(dateFormat))
                  }
                >
                  <DatePicker.RangePicker
                    format={dateFormat}
                    allowClear={false}
                  />
                </Form.Item>
              )
            }
          </Form.Item>
          <Button type="primary" onClick={query}>
            查询
          </Button>
          <Button
            onClick={() =>
              navigate("/mng/qms_dcc/bpm", {
                state: { 单号: "" },
              })
            }
          >
            发起流程
          </Button>
        </Flex>
      </Form>
      <Table
        loading={tb_load}
        size="small"
        columns={columns}
        dataSource={tb_data}
        bordered
        scroll={{ x: "max-content" }}
        pagination={pagination()}
      />
      <CtrlModal
        open={is_modal}
        onCancel={() => setIsModal(false)}
        cur_data={cur_data}
      />
    </Flex>
  );
}

export default DccList;
