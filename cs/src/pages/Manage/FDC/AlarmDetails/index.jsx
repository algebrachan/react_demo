import React, { useEffect, useState } from "react";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import {
  Button,
  Flex,
  Form,
  Select,
  Space,
  Table,
  DatePicker,
  message,
} from "antd";
import { selectList2Option, timeFormat } from "../../../../utils/string";
import {
  AuditOutlined,
} from "@ant-design/icons";
import { ExamineModal } from "./Modal"; 
import dayjs from "dayjs";
import {
  getAlarmData,
  getDeviceSearch,
  getSearchPara,
} from "../../../../apis/fdc_api";
const { RangePicker } = DatePicker;
function AlarmDetails() {
  const default_form = {
    时间: [
      dayjs().subtract(30, "day").format(timeFormat),
      dayjs().format(timeFormat),
    ],
    工厂: "",
    车间: "",
    工序: "",
    设备: "",
    参数: "",
    紧急程度: "全部",
    状态: 1,
  };
  const [form] = Form.useForm();
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [cur, setCur] = useState(1);
  const [page_size, setPageSize] = useState(20);
  const [tb_total, setTbTotal] = useState(0);
  const [e_modal, setEModal] = useState(false);
  const [cur_data, setCurData] = useState({});
  const [query_opt, setQueryOpt] = useState({});
  const [param_opt, setParamOpt] = useState({});
  const [param_load, setParamLoad] = useState(false);
  const [dev_list, setDevList] = useState([]);
  const [param_list, setParamList] = useState([]);
  const levelObj = {
    1: "一般",
    2: "中等",
    3: "紧急",
  };

  const columns = [
    {
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 50,
    },
    ...[
      "工厂",
      "车间",
      "工序",
      "工步",
      "批次号",
      "设备号",
      "点位名",
      "紧急程度",
      "值",
      "基准",
      "下限",
      "状态",
      "故障原因描述",
      "处理措施描述",
      "提交人",
      "提交时间",
    ].map((e, _) => {
      let col = {
        title: e,
        dataIndex: e,
        key: e,
      };
      if (e === "状态") {
        col.render = (x) => {
          return x ? "未处理" : "已处理";
        };
      }
      if (e === "紧急程度") {
        col.render = (x) => {
          return levelObj[x];
        };
      }
      return col;
    }),
    {
      title: "操作",
      key: "opt",
      width: 100,
      render: (record) => (
        <Space>
          <Button
            style={{ padding: 0 }}
            type="link"
            icon={<AuditOutlined />}
            onClick={() => {
              setEModal(true);
              setCurData(record);
            }}
          >
            处理
          </Button>
          {/* <Popconfirm
            title="警告"
            description="确认关闭该条异常?"
            onConfirm={() => close(record)}
            okText="确认"
            cancelText="取消"
          >
            <Button
              style={{ padding: 0 }}
              type="link"
              danger
              icon={<CloseCircleOutlined />}
            >
              关闭
            </Button>
          </Popconfirm> */}
        </Space>
      ),
    },
  ];

  const pagination = {
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
    },
  };
  const requestData = async (page, size) => {
    let val = await form
      .validateFields()
      .then((res) => res)
      .catch((err) => {
        const { errorFields } = err;
        let err_list = errorFields.map((e) => e.errors);
        message.warning(err_list.join("\n\n"));
        return false;
      });
    if (val) {
      val["page"] = page;
      val["limit"] = size;
      setTbLoad(true);
      getAlarmData(
        val,
        (res) => {
          setTbLoad(false);
          const { code, msg, data, length } = res.data;
          setTbTotal(length);
          if (code === 200) {
            setTbData(data);
          } else {
            message.error(msg);
            setTbData([]);
          }
        },
        () => {
          setTbTotal(0);
          setTbLoad(false);
          setTbData([]);
        }
      );
    }
  };
  const initOpt = () => {
    getDeviceSearch(
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 200 && data) {
          setQueryOpt(data);
        } else {
          setQueryOpt({});
        }
      },
      () => {
        setQueryOpt({});
      }
    );
  };
  const initParam = () => {
    const { 车间 = "", 工序 = "" } = form.getFieldsValue();
    setParamLoad(true);
    getSearchPara(
      { 车间, 工序 },
      (res) => {
        setParamLoad(false);
        const { code, data } = res.data;
        if (code === 200 && data) {
          const { dev_list = [] } = data;
          let temp_list = dev_list.map((e) => e.设备);
          setDevList(temp_list);
          setParamOpt(data);
        } else {
          setDevList([]);
          setParamOpt({});
        }
      },
      () => {
        setParamLoad(false);
        setDevList([]);
        setParamOpt({});
      }
    );
  };
  useEffect(() => {
    if (Object.keys(query_opt).length > 0) {
      // 设置初始化数据
      const { 工厂 = [], 车间 = [], 工序 = {} } = query_opt;
      let val = {};
      if (工厂.length > 0) {
        val["工厂"] = 工厂[0];
      }
      if (车间.length > 0) {
        val["车间"] = 车间[0];
        val["工序"] = 工序[车间[0]];
      }
      form.setFieldsValue(val);
      initParam();
      requestData(cur, page_size);
    }
  }, [query_opt]);
  useEffect(() => {
    initOpt();
  }, []);

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "报警详情处理"]} />
      <div className="content_root">
        <Flex vertical gap={20}>
          <Form
            form={form}
            initialValues={default_form}
            layout="inline"
            style={{ alignItems: "flex-start" }}
          >
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
              <RangePicker showTime style={{ width: 330 }} allowClear={false} />
            </Form.Item>
            <Form.Item label="工厂" name="工厂">
              <Select
                options={selectList2Option(query_opt["工厂"])}
                style={{ width: 120 }}
              />
            </Form.Item>
            <Form.Item label="车间" name="车间">
              <Select
                options={selectList2Option(query_opt["车间"])}
                style={{ width: 120 }}
                onChange={(val) => {
                  form.setFieldsValue({
                    工序: query_opt["工序"][val],
                    设备: "",
                    参数: "",
                  });
                  initParam();
                }}
              />
            </Form.Item>
            <Form.Item label="工序" name="工序">
              <Select options={selectList2Option([])} style={{ width: 120 }} />
            </Form.Item>

            <Form.Item label="设备" name="设备">
              <Select
                showSearch
                options={selectList2Option(dev_list)}
                style={{ width: 120 }}
                loading={param_load}
                onChange={(val) => {
                  form.setFieldsValue({
                    参数: "",
                  });
                  // 从设备列表中匹配对应的设备
                  const { dev_list = [] } = param_opt;
                  let dev = dev_list.find((e) => e.设备 === val);
                  setParamList(dev?.参数);
                }}
              />
            </Form.Item>
            <Form.Item label="参数" name="参数">
              <Select
                showSearch
                options={selectList2Option(param_list)}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                loading={param_load}
                style={{ width: 180 }}
              />
            </Form.Item>
            <Form.Item label="紧急程度" name="紧急程度">
              <Select
                options={[
                  { label: "全部", value: "全部" },
                  { label: "一般", value: 1 },
                  { label: "中等", value: 2 },
                  { label: "紧急", value: 3 },
                ]}
                style={{ width: 120 }}
              />
            </Form.Item>
            <Form.Item label="状态" name="状态">
              <Select
                options={[
                  { label: "全部", value: "全部" },
                  { label: "已处理", value: 0 },
                  { label: "未处理", value: 1 },
                ]}
                style={{ width: 120 }}
              />
            </Form.Item>
            <Space>
              <Button
                type="primary"
                onClick={() => requestData(cur, page_size)}
              >
                查询
              </Button>
            </Space>
          </Form>
          <Table
            rowKey="id"
            loading={tb_load}
            size="small"
            columns={columns}
            dataSource={tb_data}
            bordered
            scroll={{
              x: "max-content",
            }}
            pagination={pagination}
          />
        </Flex>
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

export default AlarmDetails;
