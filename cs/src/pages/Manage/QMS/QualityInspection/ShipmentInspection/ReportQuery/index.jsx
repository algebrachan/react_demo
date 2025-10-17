import React, { useState, useEffect } from "react";
import {
  Form,
  Flex,
  Space,
  DatePicker,
  Button,
  Table,
  Input,
  message,
  Select,
  Modal,
} from "antd";
import dayjs from "dayjs";
import { qmsReadShipReportLike } from "@/apis/qms_router";
import { dateFormat } from "@/utils/string";
import { ExclamationCircleOutlined, PrinterOutlined } from "@ant-design/icons";
import { qmsReportPrinting } from "../../../../../../apis/nc_review_router";
import {
  downloadFileBlob,
  parseRFC5987Filename,
  printBinaryFile,
} from "../../../../../../utils/obj";

function ReportQuery() {
  const [query_form] = Form.useForm();
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [printLoading, setPrintLoading] = useState({});
  const print = async (record) => {
    setPrintLoading({ ...printLoading, [record.id]: true });
    qmsReportPrinting(
      { 报检单号: record["vapplybillcode"] },
      (res) => {
        setPrintLoading({ ...printLoading, [record.id]: false });
        Modal.confirm({
          title: "打印确认",
          content: "确定要打印这份报告吗？",
          icon: <ExclamationCircleOutlined />,
          onOk: () => {
            const blob = new Blob([res.data], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const printWindow = window.open(url, "_blank");
            if (printWindow) {
              printWindow.onload = () => {
                printWindow.print();
                // 打印后关闭窗口
              };
            } else {
              console.error("无法打开打印窗口，可能是浏览器阻止了弹出窗口");
              URL.revokeObjectURL(url); // 修正变量名从data改为url
            }
          },
          onCancel: () => {
            console.log("取消打印");
          },
        });
      },
      (e) => {
        setPrintLoading({ ...printLoading, [record.id]: false });
        message.error("打印异常", e);
      }
    );
  };
  const columns = [
    {
      title: "序号",
      key: "key",
      width: 60,
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
      title: "物料类型",
      dataIndex: "material_type",
      key: "material_type",
      width: 120,
    },
    {
      title: "分类",
      dataIndex: "category",
      key: "category",
      width: 80,
    },
    {
      title: "批次号",
      dataIndex: "batch",
      key: "batch",
      width: 100,
    },
    {
      title: "检验数量",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: "检验状态",
      dataIndex: "inspection_status",
      key: "inspection_status",
      width: 100,
    },
    { title: "检测人", dataIndex: "reviser", key: "reviser", width: 100 },
    {
      title: "检验时间",
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
      key: "opt",
      width: 100,
      fixed: "right",
      render: (record) => (
        <Space>
          <Button
            icon={<PrinterOutlined />}
            onClick={() => print(record)}
            loading={printLoading[record.id]}
            disabled={printLoading[record.id]}
          >
            打印
          </Button>
        </Space>
      ),
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
    const { 报检单号, 检验日期 } = query_form.getFieldsValue();
    setTbLoad(true);
    qmsReadShipReportLike(
      { 报检单号, 检验日期 },
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
          快捷检索: 1,
          检验日期: [
            dayjs().subtract(1, "month").format(dateFormat),
            dayjs().format(dateFormat),
          ],
        }}
      >
        <Space>
          <Form.Item label="报检单号" name="报检单号">
            <Input placeholder="请输入报检单号" />
          </Form.Item>
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
              allowClear={false}
              style={{ width: 240 }}
              placeholder={["开始日期", "结束日期"]}
            />
          </Form.Item>
          <Button type="primary" onClick={handleSearch}>
            查询
          </Button>
        </Space>
      </Form>
      <Table
        rowKey="id"
        loading={tb_load}
        bordered
        size="small"
        columns={columns}
        dataSource={tb_data}
        pagination={pagination}
        scroll={{ x: "max-content" }}
      />
    </Flex>
  );
}

export default ReportQuery;
