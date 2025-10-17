import React, { useEffect, useState } from "react";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import {
  Button,
  Flex,
  Form,
  Popconfirm,
  Select,
  Space,
  Table,
  message,
} from "antd";
import { selectList2Option } from "../../../../utils/string";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { EditDevModal } from "./Modal";
import {
  deleteDevice,
  getDeviceByConditions,
  getDeviceSearch,
} from "../../../../apis/fdc_api";

const COLL_TYPE = {
  1: "modbus",
  2: "MySQL",
  3: "MongoDB",
  4: "http",
  5: "SqlServer",
};
// 设备列表
function DevList() {
  const default_query_form = {
    工厂: "",
    车间: "",
    工序: "",
    状态: "全部",
  };
  const [form] = Form.useForm();
  const [query_opt, setQueryOpt] = useState({});
  const [tb_load, setTbLoad] = useState(false);
  const [tb_data, setTbData] = useState([]);
  const [cur, setCur] = useState(1);
  const [page_size, setPageSize] = useState(20);
  const [tb_total, setTbTotal] = useState(0);
  const [cur_data, setCurData] = useState({});
  const [dev_modal, setDevModal] = useState(false);
  const del = (record) => {
    deleteDevice(
      { id: record["id"],车间:record['车间'] },
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
      "设备名",
      "参数总量",
      "状态",
      "ip",
      "port",
      "数据库",
      "表名",
      "采集类型",
      "路径",
      "查询条件",
      "唯一标识符",
      "批次号",
      "时间字段",
      "来源数据库",
      "来源数据表",
      "用户",
      "添加时间",
      "更新时间",
      "添加人",
      "修改人",
    ].map((e, _) => {
      let col = {
        title: e,
        dataIndex: e,
        key: e,
      };
      if (e === "状态") {
        col.render = (x) => {
          return x ? "开启" : "关闭";
        };
      }
      if (e === "采集类型") {
        col.render = (x) => {
          return COLL_TYPE[x];
        };
      }
      return col;
    });
    columns.unshift({
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 50,
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
              setDevModal(true);
              setCurData({ name: "编辑", record });
            }}
          >
            修改
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
    const { 工厂, 车间, 工序, 状态 } = form.getFieldsValue();
    let val = {
      factory: 工厂,
      workshop: 车间,
      process: 工序,
      status: 状态,
      page: page,
      limit: size,
    };
    setTbLoad(true);
    getDeviceByConditions(
      val,
      (res) => {
        setTbLoad(false);
        const { code, msg, data, length } = res.data;
        if (code === 200 && data) {
          setTbData(data);
          setTbTotal(length);
        } else {
          message.error(msg);
          setTbData([]);
          setTbTotal(0);
        }
      },
      () => {
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
      requestData(cur, page_size);
    }
  }, [query_opt]);
  useEffect(() => {
    initOpt();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "设备管理"]} />
      <div className="content_root">
        <Flex vertical gap={20}>
          <Form form={form} initialValues={default_query_form} layout="inline">
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
                onChange={(val)=>form.setFieldsValue({工序:query_opt["工序"][val]})}
              />
            </Form.Item>
            <Form.Item label="工序" name="工序">
              <Select options={selectList2Option([])} style={{ width: 120 }} />
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
                  setDevModal(true);
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
            onRow={(record, index) => {
              if (record.状态) {
                return { style: { background: "#d9f7be" } };
              }
            }}
            pagination={pagination()}
          />
        </Flex>
      </div>
      <EditDevModal
        open={dev_modal}
        onCancel={() => setDevModal(false)}
        data={cur_data}
        query_opt={query_opt}
        requestData={() => requestData(cur, page_size)}
      />
    </div>
  );
}

export default DevList;
