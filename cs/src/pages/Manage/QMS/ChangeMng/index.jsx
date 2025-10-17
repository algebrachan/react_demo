import React, { useState, useEffect } from "react";
import { MyBreadcrumb } from "@/components/CommonCard";
import {
  Button,
  Table,
  message,
  Flex,
  Space,
  Form,
  DatePicker,
  Popconfirm,
  Select,
} from "antd";
import dayjs from "dayjs";
import { dateFormat } from "@/utils/string";
import { qmsDelChangeNumber, qmsGetNumberInfo } from "@/apis/qms_router";
import { DeleteOutlined } from "@ant-design/icons";
import ShenQingModal from "./Modal/index.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getNickName } from "../../../../apis/nc_review_router.jsx";
import { setCommonParam } from "../../mngSlice.jsx";

export default function BianGeng() {
  const [is_modal, setIsModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // dispatch(
  //   setCommonParam({
  //     param_name: "qms",
  //     param_val: { cur_dcc_file_type: name },
  //   })
  // );
  const [query_form] = Form.useForm();
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const columns = [
    {
      title: "序号",
      dataIndex: "序号",
      key: "序号",
      width: 50,
    },
    {
      title: "变更单号",
      dataIndex: "编号",
      key: "编号",
      width: 100,
    },
    {
      title: "日期",
      dataIndex: "日期",
      key: "日期",
      render: (text) => text && dayjs(text).format(dateFormat),
      width: 60,
    },
    {
      title: "产品名称",
      dataIndex: "产品名称",
      key: "产品名称",
      width: 60,
    },
    {
      title: "产品规格",
      dataIndex: "产品规格",
      key: "产品规格",
      width: 60,
    },
    {
      title: "变更类型",
      dataIndex: "变更类型",
      key: "变更类型",
      width: 60,
      render: (t) => t && t.join(","),
    },
    ...[
      "变更级别",
      "变更内容",
      "实际完成时间",
      "申请人",
      "变更申请",
      "变更受理",
      "可行性方案",
      "会签评估",
      "测试需求单",
      "部门会签测试",
      "结案报告",
      "部门会签结案",
      "变更通知",
      "变更跟踪",
    ].map((item) => ({
      title: item,
      dataIndex: item,
      key: item,
      width: 60,
    })),
    {
      title: "变更结论",
      dataIndex: "变更结论",
      key: "变更结论",
      fixed: "right",
      width: 60,
    },
    {
      title: "目前状态",
      dataIndex: "目前状态",
      key: "目前状态",
      fixed: "right",
      width: 60,
    },
    {
      title: "已评审",
      dataIndex: "已评审",
      key: "已评审",
      fixed: "right",
      width: 60,
    },
    {
      title: "未评审",
      dataIndex: "未评审",
      key: "未评审",
      fixed: "right",
      width: 60,
    },
    {
      title: "操作",
      key: "opt",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="警告"
            description="确认删除该条数据?"
            onConfirm={() => del(record)}
            okText="确认"
            cancelText="取消"
          >
            <Button
              icon={<DeleteOutlined />}
              style={{ padding: 0 }}
              type="link"
              danger
            >
              删除
            </Button>
          </Popconfirm>
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() =>
              navigate("/mng/qms_change/bpm", {
                state: { record },
              })
            }
          >
            审批
          </Button>
        </Space>
      ),
      width: 100,
    },
  ];
  const del = (record) => {
    qmsDelChangeNumber(
      { number: record.编号 },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 200) {
          message.success("删除成功");
          requestData();
        }
      },
      () => {}
    );
  };

  const pagination = {
    position: ["bottomCenter"],
    showTotal: (total) => `共 ${total} 条`,
    showQuickJumper: true,
    showSizeChanger: true,
    defaultPageSize: 20,
  };
  const initUser = () => {
    getNickName(
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 200) {
          dispatch(
            setCommonParam({
              param_name: "qms",
              param_val: { user_list: data || [] },
            })
          );
        }
      },
      () => {}
    );
  };
  const requestData = () => {
    const { 时间 } = query_form.getFieldsValue();
    setTbLoad(true);
    qmsGetNumberInfo(
      { start_time: 时间[0], end_time: 时间[1] },
      (res) => {
        const { code, msg, data } = res.data;
        setTbLoad(false);
        if (code === 200 && data.length > 0) {
          let temp = data.map((e, _) => ({ ...e, key: _ }));
          setTbData(temp);
        }
      },
      () => {
        setTbData([]);
      }
    );
  };
  useEffect(() => {
    requestData();
    initUser();
  }, []);

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "变更管理"]} />
      <div className="content_root">
        <Flex vertical gap={16}>
          <Form
            layout="inline"
            form={query_form}
            initialValues={{
              快捷检索: 1,
              时间: [
                dayjs().subtract(1, "month").format(dateFormat),
                dayjs().format(dateFormat),
              ],
            }}
          >
            <Flex gap={16}>
              <Form.Item label="快捷检索" name="快捷检索">
                <Select
                  style={{ width: 100 }}
                  options={[
                    { label: "一月", value: 1 },
                    { label: "三月", value: 3 },
                    { label: "半年", value: 6 },
                    { label: "一年", value: 12 },
                  ]}
                  onChange={(val) => {
                    query_form.setFieldsValue({
                      时间: [
                        dayjs().subtract(val, "month").format(dateFormat),
                        dayjs().format(dateFormat),
                      ],
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="时间"
                name="时间"
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
                  allowClear={false}
                  style={{ width: 240 }}
                  placeholder={["开始日期", "结束日期"]}
                />
              </Form.Item>
              <Button type="primary" onClick={requestData}>
                查询
              </Button>
              <Button onClick={() => setIsModal(true)}>发起申请</Button>
            </Flex>
          </Form>
          <Table
            loading={tb_load}
            columns={columns}
            dataSource={tb_data}
            // rowKey="序号"
            bordered
            size="small"
            pagination={pagination}
            scroll={{ x: "max-content" }}
          />
          <ShenQingModal
            open={is_modal}
            onCancel={() => setIsModal(false)}
            requestData={requestData}
          />
        </Flex>
      </div>
    </div>
  );
}
