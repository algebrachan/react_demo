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
  Flex,
} from "antd";
import { selectList2Option, timeFormat } from "@/utils/string";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {
  rectify_opntions,
  process_inspection_rectify,
} from "@/apis/qms_router";
import { dateFormat } from "../../../../../utils/string";

const { RangePicker } = DatePicker;
const { Panel } = Collapse;
let id = "";
function ProcessInspection() {
  const [form] = Form.useForm();

  const [cur, setCur] = useState(1);
  const [page_size, setPageSize] = useState(20);
  const [tb_total, setTbTotal] = useState(0);
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [opData, setOpData] = useState({});

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
    rectify_opntions(
      {},
      (res) => {
        setOpData(res.data.data);
        form.setFieldsValue({
          task_number: "",
          department: res.data.data.所属部门?.[0] || "",
          task_type: res.data.data.任务类型?.[0] || "",
          judge_result: "",
          device: "",
          responsible_person: "",
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
      title: "任务编号",
      dataIndex: "任务编号",
      key: "任务编号",
      width: 120,
    },
    {
      title: "任务类型",
      dataIndex: "任务类型",
      key: "任务类型",
      width: 120,
    },
    {
      title: "所属部门",
      dataIndex: "所属部门",
      key: "所属部门",
      width: 120,
    },
    {
      title: "设备号",
      dataIndex: "设备号",
      key: "设备号",
      width: 120,
    },
    {
      title: "异常描述",
      dataIndex: "异常描述",
      key: "异常描述",
      width: 200,
      ellipsis: true,
    },
    {
      title: "根本原因",
      dataIndex: "根本原因",
      key: "根本原因",
      width: 200,
      ellipsis: true,
      render: (text) => text || "-",
    },
    {
      title: "纠正措施",
      dataIndex: "纠正措施",
      key: "纠正措施",
      width: 200,
      ellipsis: true,
    },
    {
      title: "责任人",
      dataIndex: "责任人",
      key: "责任人",
      width: 100,
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
      width: 100,
    },
    {
      title: "结束时间",
      dataIndex: "结束时间",
      key: "结束时间",
      width: 180,
    },
    {
      title: "操作",
      key: "opt",
      fixed: "right",
      width: 60,
      // render: (record) => (
      //   <Space>
      //     <Button
      //       type="link"
      //       style={{ padding: 0 }}
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

    // 处理时间参数
    const params = {
      limit: pageSize,
      page: page,
      task_number: val.task_number || "",
      department: val.department || "",
      task_type: val.task_type || "",
      judge_result: val.judge_result || "",
      device: val.device || "",
      responsible_person: val.responsible_person || "",
      end_time: val.end_time || [],
      create_time: val.create_time || [],
    };

    process_inspection_rectify(
      params,
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
  }, []);

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "质量检验", "过程检验整改"]} />
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
            快捷检索1: 1,
            快捷检索2: 1,
            create_time: [
              dayjs().subtract(1, "month").format(dateFormat),
              dayjs().format(dateFormat),
            ],
            end_time: [
              dayjs().subtract(1, "month").format(dateFormat),
              dayjs().format(dateFormat),
            ],
          }}
        >
          <Flex vertical gap={16}>
            <Flex gap={16}>
              <Form.Item label="任务编号" name="task_number">
                <Input placeholder="请输入" style={{ width: 160 }} />
              </Form.Item>
              <Form.Item label="所属部门" name="department">
                <Select
                  options={selectList2Option(opData.所属部门 || [])}
                  placeholder="请选择"
                  style={{ width: 160 }}
                />
              </Form.Item>
              <Form.Item label="任务类型" name="task_type">
                <Select
                  options={selectList2Option(opData.任务类型 || [])}
                  placeholder="请选择"
                  style={{ width: 160 }}
                />
              </Form.Item>
              <Form.Item label="判定结果" name="judge_result">
                <Input placeholder="请输入" style={{ width: 160 }} />
              </Form.Item>
              <Form.Item label="设备号" name="device">
                <Input placeholder="请输入" style={{ width: 160 }} />
              </Form.Item>
              <Form.Item label="责任人" name="responsible_person">
                <Input placeholder="请输入" style={{ width: 160 }} />
              </Form.Item>
            </Flex>
            <Flex gap={16}>
              <Form.Item label="快捷检索1" name="快捷检索1">
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
                      create_time: [
                        dayjs().subtract(val, "month").format(dateFormat),
                        dayjs().format(dateFormat),
                      ],
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="创建时间"
                name="create_time"
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
              <Form.Item label="快捷检索2" name="快捷检索2">
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
                      end_time: [
                        dayjs().subtract(val, "month").format(dateFormat),
                        dayjs().format(dateFormat),
                      ],
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="结束时间"
                name="end_time"
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
              <Button type="primary" onClick={() => requestData(1, 20)}>
                查询
              </Button>
              <Button onClick={() => {}}>导出</Button>
            </Flex>
          </Flex>
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
