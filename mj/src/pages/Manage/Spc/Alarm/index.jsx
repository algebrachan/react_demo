import React, { useEffect, useState } from "react";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import {
  Button,
  DatePicker,
  Form,
  Modal,
  Select,
  Space,
  Table,
  message,
} from "antd";
import dayjs from "dayjs";
import { selectList2Option, timeFormat } from "../../../../utils/string";
import {
  AuditOutlined,
  BookOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { ExamineModal } from "./Modal";
import { useNavigate } from "react-router-dom";
import {
  closeAlarmRecord,
  getAlarmRecord,
  getSpcOptions,
} from "../../../../apis/spc_api";
const { RangePicker } = DatePicker;

const default_query_form = {
  时间: [
    dayjs().subtract(30, "day").format(timeFormat),
    dayjs().format(timeFormat),
  ],
  图号: "全部",
  机台: "11#",
  状态: "",
};

function Alarm() {
  const navigate = useNavigate();
  const [modal, contextHolder] = Modal.useModal();
  const [form] = Form.useForm();
  const [query_opt, setQueryOpt] = useState({});
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [cur, setCur] = useState(1);
  const [page_size, setPageSize] = useState(20);
  const [tb_total, setTbTotal] = useState(0);
  const [e_modal, setEModal] = useState(false);
  const [cur_data, setCurData] = useState({});

  const closeRecord = async (record) => {
    const confirmed = await modal.confirm({
      title: `确认关闭`,
      content: <div>确认关闭该异常？</div>,
      okText: "是",
      cancelText: "否",
    });
    if (confirmed) {
      const { id } = record;
      closeAlarmRecord(
        { id },
        (res) => {
          const { data, code, msg } = res.data;
          if (code === 0 && data) {
            message.success("关闭成功");
            requestData(cur, page_size);
          } else {
            message.error(msg);
          }
        },
        () => {
          message.error("网络异常");
        }
      );
    }
  };
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
  const generateColumns = () => {
    let columns = [
      "日期",
      "图号",
      "批号",
      "特征",
      "机台",
      "判异规则",
      "属性",
      "异常现象",
      "异常原因",
      "异常对策",
      "责任部门",
      "期限",
      "异常原因分类",
      "紧急程度",
      "状态",
      "制定人",
      "审批人",
      "更新时间",
      "备注",
    ].map((e, _) => {
      let col = {
        title: e,
        dataIndex: e,
        key: e,
      };
      if (e === "责任部门") {
        col.render = (x) => x && x.join(",");
      }
      return col;
    });
    columns.push({
      title: "操作",
      key: "opt",
      fixed: "right",
      width: 250,
      render: (record) => (
        <Space>
          <Button icon={<EditOutlined />} type="link" style={{ padding: 0 }}>
            编辑
          </Button>
          <Button
            icon={<BookOutlined />}
            type="link"
            style={{ padding: 0 }}
            onClick={() =>
              navigate("/mng/alarm/strategy", {
                state: {
                  data: record,
                },
              })
            }
          >
            策略
          </Button>
          <Button
            icon={<AuditOutlined />}
            type="link"
            style={{ padding: 0 }}
            onClick={() => {
              setEModal(true);
              setCurData(record);
            }}
          >
            审核
          </Button>
          <Button
            icon={<CloseCircleOutlined />}
            type="link"
            style={{ padding: 0 }}
            onClick={() => closeRecord(record)}
            danger
          >
            关闭
          </Button>
          {/* <Button icon={<DeleteOutlined />} type="link" style={{ padding: 0 }}>
            删除
          </Button> */}
        </Space>
      ),
    });
    return columns;
  };
  const requestData = (page, size) => {
    let val = form.getFieldsValue();
    val["skip"] = page - 1;
    val["limit"] = size;
    setTbLoad(true);
    getAlarmRecord(
      val,
      (res) => {
        setTbLoad(false);
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          const { data_list, total } = data;
          setTbData(data_list);
          setTbTotal(total);
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

  const initOpt = () => {
    const { 时间 = [], 机台 = "" } = form.getFieldsValue();
    getSpcOptions(
      { 时间, 机台 },
      (res) => {
        const { code, msg, data } = res.data;
        form.setFieldsValue({
          图号: "全部",
        });
        if (code === 0 && data) {
          const { 图号: t = [] } = JSON.parse(JSON.stringify(data));
          t.unshift("全部");
          setQueryOpt({ 图号: t });
        } else {
          setQueryOpt({ 图号: ["全部"] });
        }
      },
      () => {
        setQueryOpt({ 图号: ["全部"] });
      }
    );
  };
  useEffect(() => {
    if (Object.keys(query_opt).length > 0) {
      requestData(cur, page_size);
    }
  }, [query_opt]);

  useEffect(() => {
    initOpt();
  }, []);
  return (
    <div>
      {contextHolder}
      <MyBreadcrumb items={[window.sys_name, "SPC分析", "告警处理"]} />
      <div
        className="content_root"
        style={{
          display: "flex",
          rowGap: 20,
          flexDirection: "column",
        }}
      >
        <Form layout="inline" initialValues={default_query_form} form={form}>
          <Form.Item
            label="时间"
            name="时间"
            getValueProps={(value) => {
              return {
                value: value && value.map((e) => dayjs(e)),
              };
            }}
            normalize={(value) =>
              value && value.map((e) => dayjs(e).format(timeFormat))
            }
          >
            <RangePicker
              showTime
              allowClear={false}
              onChange={() => initOpt()}
            />
          </Form.Item>
          <Form.Item label="图号" name="图号">
            <Select
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={selectList2Option(query_opt["图号"])}
              style={{ width: 150 }}
            />
          </Form.Item>
          <Form.Item label="机台" name="机台">
            <Select
              options={selectList2Option(["11#", "12#", "13#", "14#", "15#"])}
              style={{ width: 120 }}
              onChange={() => initOpt()}
            />
          </Form.Item>
          <Form.Item label="状态" name="状态">
            <Select
              options={selectList2Option([
                "",
                "未处理",
                "待审核",
                "已通过",
                "已驳回",
              ])}
              style={{ width: 120 }}
            />
          </Form.Item>
          <Space>
            <Button type="primary" onClick={() => requestData(cur, page_size)}>
              检索
            </Button>
          </Space>
        </Form>
        <Table
          size="small"
          loading={tb_load}
          columns={generateColumns()}
          dataSource={tb_data}
          bordered
          scroll={{
            x: "max-content",
          }}
          pagination={pagination()}
        />
      </div>
      <ExamineModal
        open={e_modal}
        onCancel={() => setEModal(false)}
        data={cur_data}
        requestData={() => requestData(cur, page_size)}
      />
    </div>
  );
}

export default Alarm;
