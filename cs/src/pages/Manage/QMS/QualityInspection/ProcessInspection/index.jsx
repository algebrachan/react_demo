import React, { useState, useEffect } from "react";
import { MyBreadcrumb } from "@/components/CommonCard";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Table,
  Collapse,
  Row,
  Col,
  message,
} from "antd";
import { selectList2Option, timeFormat } from "@/utils/string";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {
  process_inspection,
  process_inspection_options,
  process_inspection_export,
} from "@/apis/qms_router";
import { dateFormat } from "../../../../../utils/string";
import { time } from "echarts/core";

const { RangePicker } = DatePicker;
const { Panel } = Collapse;
let id = "";
function ProcessInspection() {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const [cur, setCur] = useState(1);
  const [page_size, setPageSize] = useState(20);
  const [tb_total, setTbTotal] = useState(0);
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [opData, setOpData] = useState({});
  const navigate = useNavigate();
  const [editRecord, setEditRecord] = useState(null);
  const [activeKey, setActiveKey] = useState(null);

  const pagination = () => {
    return {
      current: cur,
      pageSize: page_size,
      position: ["bottomCenter"],
      total: tb_total,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
      onChange: (page, pageSize) => {
        setCur(page);
        setPageSize(pageSize);
        requestData(page, pageSize);
        // 请求数据
      },
    };
  };
  const initOpt = () => {
    process_inspection_options(
      {},
      (res) => {
        setOpData(res.data.data);
        form.setFieldsValue({
          result: res.data.data.检验结果[0] || "",
          status: res.data.data.状态[0] || "",
          rule: "",
          decive: "",
          time: [
            dayjs().subtract(14, "day").format(timeFormat),
            dayjs().format(timeFormat),
          ],
        });
        requestData(1, 20);
      },
      () => {
        console.log("请求失败");
      }
    );
  };
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      width: 50,
    },
    {
      title: "巡检任务",
      dataIndex: "巡检任务",
      key: "巡检任务",
      width: 120,
    },
    {
      title: "巡检设备",
      dataIndex: "巡检设备",
      key: "巡检设备",
      width: 120,
    },
    {
      title: "巡检规则",
      dataIndex: "巡检规则",
      key: "巡检规则",
      width: 120,
    },
    {
      title: "巡检方式",
      dataIndex: "巡检方式",
      key: "巡检方式",
      width: 120,
    },
    {
      title: "设备类型",
      dataIndex: "设备类型",
      key: "设备类型",
      width: 120,
    },
    {
      title: "所属系列",
      dataIndex: "所属系列",
      key: "所属系列",
    },
    {
      title: "巡检人",
      dataIndex: "巡检人",
      key: "巡检人",
      width: 120,
    },
    {
      title: "检验结果",
      dataIndex: "检验结果",
      key: "检验结果",
      width: 120,
    },
    {
      title: "创建时间",
      dataIndex: "创建时间",
      key: "创建时间",
      width: 180,
    },
    {
      title: "创建人",
      dataIndex: "创建人",
      key: "创建人",
      width: 120,
    },
    {
      title: "操作",
      key: "opt",
      fixed: "right",
      width: 60,
      // render: (record) => (
      //   <Space>
      // <Button
      //       type="link"
      //       style={{ padding: 0 }}
      //       danger
      //       onClick={() => {

      //       }}
      //     >
      //       查看
      //     </Button>
      //   </Space>
      // ),
    },
  ];
  const requestData = (page, pageSize) => {
    let val = form.getFieldsValue();
    setTbLoad(true);
    process_inspection(
      {
        limit: pageSize,
        page: page,
        ...val,
      },
      (res) => {
        setTbLoad(false);
        if (res.data.code === 0 && res.data.data) {
          setTbData(res.data.data);
          setTbTotal(res.data.length);
        } else {
          setTbData([]);
          setTbTotal(0);
        }
      },
      () => {
        setTbLoad(false);
        setTbData([]);
        setTbTotal(0);
      }
    );
  };

  useEffect(() => {
    initOpt();
    requestData(1, 20)
  }, []);

  // 显示编辑面板
  const showEditPanel = (record) => {
    setEditRecord(record);
    setActiveKey("edit");
    id = record.id;
    setTimeout(() => {
      const formValues = {
        ...record,
        发现日期: record.发现日期 ? dayjs(record.发现日期) : null,
        计划完成时间: record.计划完成时间 ? dayjs(record.计划完成时间) : null,
        提醒日期: record.提醒日期 ? dayjs(record.提醒日期) : null,
        实际完成时间: record.实际完成时间 ? dayjs(record.实际完成时间) : null,
      };
      editForm.setFieldsValue(formValues);
    }, 0);
  };

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "质量检验", "过程检验"]} />
      <div
        className="content_root"
        style={{
          display: "flex",
          rowGap: 20,
          flexDirection: "column",
        }}
      >
        <Form
          layout="inline"
          form={form}
          initialValues={{
            快捷检索: 1,
            time: [
              dayjs().subtract(1, "month").format(dateFormat),
              dayjs().format(dateFormat),
            ],
          }}
        >
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
                form.setFieldsValue({
                  time: [
                    dayjs().subtract(val, "month").format(dateFormat),
                    dayjs().format(dateFormat),
                  ],
                });
              }}
            />
          </Form.Item>
          <Form.Item
            label="时间"
            name="time"
            getValueProps={(value) => {
              return {
                value: value && value.map((e) => dayjs(e)),
              };
            }}
            normalize={(value) =>
              value && value.map((e) => dayjs(e).format(dateFormat))
            }
          >
            <RangePicker style={{ width: 240 }} allowClear={false} />
          </Form.Item>
          <Form.Item label="寻检设备" name="decive">
            <Input placeholder="请输入" style={{ width: 160 }} />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Select
              options={selectList2Option(opData.状态 || [])}
              style={{ width: 160 }}
            />
          </Form.Item>
          <Form.Item label="巡检规则" name="rule">
            <Input placeholder="请输入" style={{ width: 160 }} />
          </Form.Item>
          <Form.Item label="检验结果" name="result">
            <Select
              options={selectList2Option(opData.检验结果 || [])}
              style={{ width: 160 }}
            />
          </Form.Item>
          <Space>
            <Button type="primary" onClick={() => requestData(1, 20)}>
              查询
            </Button>
          </Space>
          <Space>
            <Button
              type="primary"
              onClick={() => {
                const val = form.getFieldsValue();
                process_inspection_export(
                  { ...val, page: 0, limit: 0 },
                  ({ data }) => {
                    const blob = new Blob([data]);
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.style.display = "none";
                    link.href = url;
                    link.download = "过程检验.csv";
                    document.body.appendChild(link);
                    link.click();
                    URL.revokeObjectURL(url);
                    document.body.removeChild(link);
                  }
                );
              }}
              style={{ marginLeft: 10 }}
            >
              导出
            </Button>
          </Space>
        </Form>
        <Table
          bordered
          loading={tb_load}
          size="small"
          columns={columns}
          dataSource={tb_data}
          scroll={{
            x: "max-content",
          }}
          pagination={pagination()}
        />
      </div>
    </div>
  );
}

export default ProcessInspection;
