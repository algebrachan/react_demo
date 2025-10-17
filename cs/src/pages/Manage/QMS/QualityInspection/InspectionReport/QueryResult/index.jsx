import React, { useState, useEffect } from "react";
import {
  Form,
  Flex,
  DatePicker,
  Button,
  Table,
  Input,
  message,
  Select,
  Space,
  Modal,
} from "antd";
import dayjs from "dayjs";
import { readReportLike } from "@/apis/qms_router";
import { dateFormat } from "../../../../../../utils/string";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { qmsReportError } from "../../../../../../apis/nc_review_router";
import { FilePreviewModal } from "../Modal";

function QueryResult() {
  const [query_form] = Form.useForm();
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [is_preview_modal, setIsPreviewModal] = useState(false);
  const [cur_data, setCurData] = useState({});
  // const preview = (record) => {
  //   const { report_file_path = "" } = record;
  //   if (report_file_path) {
  //     window.open(report_file_path, "_blank");
  //   } else {
  //     message.warning("暂无文件");
  //   }
  // };
  const handleErr = (record) => {
    const putErr = () => {
      qmsReportError(
        { vapplybillcode: record["vapplybillcode"] },
        (res) => {
          const { code, msg, data } = res.data;
          if (code === 0 && data) {
            message.success("操作成功");
            handleSearch();
          }
        },
        () => {}
      );
    };
    Modal.confirm({
      title: "确认提交报错",
      icon: <ExclamationCircleOutlined />,
      content: "您确定要提交该记录的报错信息吗？",
      okText: "确认",
      cancelText: "取消",
      onOk() {
        putErr();
      },
      onCancel() {},
    });
  };

  const columns = [
    {
      title: "序号",
      key: "key",
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: "报检单号",
      dataIndex: "vapplybillcode",
      key: "vapplybillcode",
      width: 120,
    },
    {
      title: "物料名称",
      dataIndex: "materialname",
      key: "materialname",
      width: 120,
    },
    {
      title: "物料编码",
      dataIndex: "materialcode",
      key: "materialcode",
      width: 120,
    },
    {
      title: "物料类型",
      dataIndex: "material_type",
      key: "material_type",
      width: 120,
    },
    {
      title: "检验指导书编号",
      dataIndex: "instruction_number",
      key: "instruction_number",
      width: 120,
    },
    {
      title: "规格",
      dataIndex: "specification",
      key: "specification",
      width: 100,
    },
    {
      title: "分类",
      dataIndex: "category",
      key: "category",
      width: 100,
    },
    {
      title: "批次号",
      dataIndex: "batch",
      key: "batch",
      width: 100,
    },
    {
      title: "检测数量",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
    },
    { title: "检测人", dataIndex: "reviser", key: "reviser", width: 100 },
    {
      title: "检测时间",
      dataIndex: "inspection_date",
      key: "inspection_date",
      width: 160,
    },
    {
      title: "判定结果",
      dataIndex: "judgment_result",
      key: "judgment_result",
      width: 100,
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      fixed: "right",
      render: (record) => {
        return (
          <Space>
            <Button
              onClick={() => {
                setCurData(record);
                setIsPreviewModal(true);
              }}
            >
              预览
            </Button>
            <Button danger onClick={() => handleErr(record)}>
              报错
            </Button>
          </Space>
        );
      },
    },
  ];
  const pagination = {
    position: ["bottomCenter"],
    showTotal: (total) => `共 ${total} 条`,
    showQuickJumper: true,
    showSizeChanger: true,
    defaultPageSize: 20,
  };
  const handleSearch = () => {
    const values = query_form.getFieldsValue();
    setTbLoad(true);
    readReportLike(
      values,
      (res) => {
        setTbLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          setTbData(data);
        }
      },
      () => {
        setTbLoad(false);
        setTbData([]);
      }
    );
  };
  useEffect(() => {
    handleSearch();
  }, []);
  return (
    <Flex vertical gap={16}>
      <Form
        layout="inline"
        form={query_form}
        initialValues={{
          报检单号: "",
          物料名称: "",
          物料编码: "",
          物料类型: "",
          检验指导书编号: "",
          规格: "",
          分类: "",
          批次号: "",
          快捷检索: 1,
          检验日期: [
            dayjs().subtract(1, "month").format(dateFormat),
            dayjs().format(dateFormat),
          ],
        }}
      >
        <Flex vertical gap={10}>
          <Flex gap={10}>
            {[
              "报检单号",
              "物料名称",
              "物料编码",
              "物料类型",
              "检验指导书编号",
              "规格",
              "分类",
            ].map((item) => (
              <Form.Item label={item} name={item} key={item}>
                <Input placeholder="请输入" />
              </Form.Item>
            ))}
          </Flex>
          <Flex gap={10}>
            {["批次号"].map((item) => (
              <Form.Item label={item} name={item} key={item}>
                <Input placeholder="请输入" />
              </Form.Item>
            ))}
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
                    检验日期: [
                      dayjs().subtract(val, "month").format(dateFormat),
                      dayjs().format(dateFormat),
                    ],
                  });
                }}
              />
            </Form.Item>
            <Form.Item
              label="检验日期"
              name="检验日期"
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
                style={{ width: 240 }}
                placeholder={["开始日期", "结束日期"]}
              />
            </Form.Item>
            <Button type="primary" onClick={handleSearch}>
              查询
            </Button>
          </Flex>
        </Flex>
      </Form>
      <Table
        rowKey="id"
        size="small"
        loading={tb_load}
        bordered
        columns={columns}
        dataSource={tb_data}
        scroll={{ x: "max-content" }}
        pagination={pagination}
        onRow={(record) => ({
          style: {
            backgroundColor: record["is_refill"] ? "#fff1f0" : "transparent",
          },
        })}
      />
      <FilePreviewModal
        file_url={cur_data["report_file_path"] || []}
        v_code={cur_data["vapplybillcode"] || ""}
        open={is_preview_modal}
        onCancel={() => setIsPreviewModal(false)}
      />
    </Flex>
  );
}

export default QueryResult;
