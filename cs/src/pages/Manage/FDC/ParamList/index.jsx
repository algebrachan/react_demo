import React, { useEffect, useMemo, useState } from "react";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import {
  Button,
  Flex,
  Form,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  message,
} from "antd";
import { selectList2Option, selectList2OptionAll } from "../../../../utils/string";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { BatchParamModal, ParamModal } from "./Modal";
import {
  deletePointPosition,
  getDeviceSearch,
  getPointSearch,
  readPointPosition,
} from "../../../../apis/fdc_api";

function ParamList() {
  const default_query_form = {
    工厂: "",
    车间: "",
    工序: "",
    设备: "全部",
    状态: "全部",
  };
  const [query_opt, setQueryOpt] = useState({});
  const [dev_list, setDevList] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [tb_data, setTbData] = useState([]);
  const [cur, setCur] = useState(1);
  const [page_size, setPageSize] = useState(20);
  const [tb_total, setTbTotal] = useState(0);
  const [cur_data, setCurData] = useState({});
  const [param_modal, setParamModal] = useState(false);
  const [batch_modal, setBatchModal] = useState(false);
  const [form] = Form.useForm();
  const del = (record) => {
    const { id, 车间 } = record;
    deletePointPosition(
      { id, 车间 },
      (res) => {
        const { code, msg } = res.data;
        if (code === 200) {
          message.success("删除成功");
          requestData(cur, page_size);
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络错误");
      }
    );
  };
  const generateColumns = () => {
    let columns = [
      "工厂",
      "车间",
      "工序",
      "设备",
      "参数名",
      "参数类型",
      "点位开始地址",
      "点位长度",
      "类型",
      "点位状态",
      "报警状态",
      "描述",
      "添加时间",
      "更新时间",
      "更新人",
    ].map((e, _) => {
      let col = {
        title: e,
        dataIndex: e,
        key: e,
      };
      if (e === "点位状态" || e === "报警状态") {
        col.render = (x) => {
          return x ? "开启" : "关闭";
        };
      }
      return col;
    });
    columns.unshift({
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 50,
      render: (x) => x + 1,
    });
    columns.push({
      title: "操作",
      key: "opt",
      width: 100,
      fixed: "right",
      render: (record) => (
        <Space>
          <Button
            style={{ padding: 0 }}
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setParamModal(true);
              setCurData({ name: "编辑", record });
            }}
          >
            修改
          </Button>
          <Button
            style={{ padding: 0 }}
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setBatchModal(true);
              setCurData({ name: "批量", record });
            }}
          >
            批量修改
          </Button>
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
        </Space>
      ),
    });
    return columns;
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
  const requestData = (page, size) => {
    const { 工厂, 车间, 工序, 设备, 状态 } = form.getFieldsValue();
    let val = {
      工厂,
      车间,
      工序,
      设备名: 设备,
      状态,
      page,
      limit: size,
    };
    setTbLoad(true);
    readPointPosition(
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
  const initDevice = () => {
    const { 车间 = "", 工序 = "" } = form.getFieldsValue();
    getPointSearch(
      { 车间, 工序 },
      (res) => {
        const { code, data } = res.data;
        if (code === 200 && data) {
          const { 设备 = [] } = data;
          setDevList(设备);
        } else {
          setDevList([]);
        }
      },
      () => {
        setDevList([]);
      }
    );
  };
  useEffect(() => {
    if (Object.keys(query_opt).length > 0) {
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
      // 查询设备
      initDevice();
      requestData(cur, page_size);
    }
  }, [query_opt]);

  useEffect(() => {
    initOpt();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "参数管理"]} />
      <div className="content_root">
          <Flex vertical gap={20}>
            <Form
              form={form}
              initialValues={default_query_form}
              layout="inline"
            >
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
                      设备: "全部",
                    });
                    initDevice();
                  }}
                />
              </Form.Item>
              <Form.Item label="工序" name="工序">
                <Select
                  options={selectList2Option([])}
                  style={{ width: 120 }}
                />
              </Form.Item>
              <Form.Item label="设备" name="设备">
                <Select
                  options={selectList2OptionAll(dev_list)}
                  style={{ width: 160 }}
                  showSearch
                />
              </Form.Item>
              <Form.Item label="状态" name="状态">
                <Select
                  options={[
                    { label: "全部", value: "全部" },
                    { label: "开启", value: 1 },
                    { label: "关闭", value: 0 },
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
                <Button
                  type="primary"
                  onClick={() => {
                    setCurData({ name: "新增", record: {} });
                    setParamModal(true);
                  }}
                >
                  新增
                </Button>
              </Space>
            </Form>
          <Table
            loading={tb_load}
            size="small"
            columns={generateColumns()}
            dataSource={tb_data}
            bordered
            scroll={{
              x: "max-content",
            }}
            pagination={pagination()}
          />
        </Flex>
      </div>
      <ParamModal
        open={param_modal}
        onCancel={() => setParamModal(false)}
        data={cur_data}
        requestData={() => requestData(cur, page_size)}
        query_opt={query_opt}
      />
      <BatchParamModal
        open={batch_modal}
        onCancel={() => setBatchModal(false)}
        data={cur_data}
        requestData={() => requestData(cur, page_size)}
      />
    </div>
  );
}

export default ParamList;
