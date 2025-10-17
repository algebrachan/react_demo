import React, { useEffect, useState } from "react";
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
} from "antd";
import { selectList2Option } from "../../../../utils/string";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { RuleModal } from "./Modal";
import {
  deleteAbnormalRule,
  getAbnormalRules,
  getSearchPara,
} from "../../../../apis/fdc_api";
import { message } from "antd";

function ErrRules() {
  const default_query_form = {
    工厂: "全部",
    车间: "全部",
    工序: "全部",
    设备: "全部",
    参数: "全部",
    报警等级: "全部",
    状态: "全部",
  };
  const [form] = Form.useForm();
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const [cur, setCur] = useState(1);
  const [page_size, setPageSize] = useState(20);
  const [tb_total, setTbTotal] = useState(0);
  const [cur_data, setCurData] = useState({});
  const [rule_modal, setRuleModal] = useState(false);
  const [query_opt, setQueryOpt] = useState({});
  const [factory_list, setFactoryList] = useState([]);
  const [ws_list, setWsList] = useState([]);
  const [process_list, setProcessList] = useState([]);
  const [dev_list, setDevList] = useState([]);
  const [param_list, setParamList] = useState([]);
  const del = (record) => {
    deleteAbnormalRule(
      { id: record["id"] },
      (res) => {
        const { code, msg } = res.data;
        if (code === 200) {
          message.success("删除成功");
          // TODO
          // 删除的时候，如果是这一页最后一项，需要回退一页
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
      "参数",
      "相关点位",
      "基准类型",
      "限制类型",
      "规则名",
      "上限",
      "基准",
      "下限",
      "报警等级",
      "添加时间",
      "更新时间",
      "状态",
      "更新人",
    ].map((e, _) => {
      let col = {
        title: e,
        dataIndex: e,
        key: e,
      };
      if (e === "状态") {
        col.render = (x) => {
          return x ? "正常" : "遗弃";
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
              setRuleModal(true);
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
    const val = form.getFieldsValue();
    val["page"] = page;
    val["limit"] = size;
    setTbLoad(true);
    getAbnormalRules(
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
    getSearchPara(
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
      // 默认加载3个
      let {
        工厂: f = [],
        车间: w = [],
        工序 = [],
      } = JSON.parse(JSON.stringify(query_opt));
      f.unshift("全部");
      w.unshift("全部");
      let p = 工序.map((e) => e.name);
      p.unshift("全部");
      setFactoryList(f);
      setWsList(w);
      setProcessList(p);
      setDevList(["全部"]);
      setParamList(["全部"]);
      requestData(cur, page_size);
    }
  }, [query_opt]);
  useEffect(() => {
    initOpt();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "异常规则"]} />
      <div className="content_root">
        <Flex vertical gap={20}>
          <Form form={form} initialValues={default_query_form} layout="inline">
            <Form.Item label="工厂" name="工厂">
              <Select
                options={selectList2Option(factory_list)}
                style={{ width: 120 }}
              />
            </Form.Item>
            <Form.Item label="车间" name="车间">
              <Select
                options={selectList2Option(ws_list)}
                style={{ width: 120 }}
              />
            </Form.Item>
            <Form.Item label="工序" name="工序">
              <Select
                options={selectList2Option(process_list)}
                style={{ width: 120 }}
                onChange={(val) => {
                  form.setFieldsValue({ 设备: "全部", 参数: "全部" });
                  setParamList(["全部"]);
                  if (val === "全部") {
                    setDevList(["全部"]);
                  } else {
                    const { 工序 = [] } = query_opt;
                    let temp = 工序.find((e) => e.name === val);
                    if (temp) {
                      const { dev_list = [] } = temp;
                      let d = dev_list.map((e) => e.设备);
                      d.unshift("全部");
                      setDevList(d);
                    } else {
                      setDevList(["全部"]);
                    }
                  }
                }}
              />
            </Form.Item>
            <Form.Item label="设备" name="设备">
              <Select
                options={selectList2Option(dev_list)}
                style={{ width: 120 }}
                onChange={(val) => {
                  form.setFieldsValue({ 参数: "全部" });
                  if (val === "全部") {
                    setParamList(["全部"]);
                  } else {
                    const { 工序 = [] } = query_opt;
                    let craft = form.getFieldValue("工序");
                    let temp = 工序.find((e) => e.name === craft);
                    const { dev_list = [] } = temp;
                    let temp1 = dev_list.find((e) => e.设备 === val);
                    const { 参数 = [] } = JSON.parse(JSON.stringify(temp1));
                    参数.unshift("全部");
                    setParamList(参数);
                  }
                }}
              />
            </Form.Item>
            <Form.Item label="参数" name="参数">
              <Select
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={selectList2Option(param_list)}
                style={{ width: 180 }}
              />
            </Form.Item>
            <Form.Item label="报警等级" name="报警等级">
              <Select
                options={[
                  { label: "全部", value: "全部" },
                  { label: "一般", value: "一般" },
                  { label: "中等", value: "中等" },
                  { label: "紧急", value: "紧急" },
                ]}
                style={{ width: 120 }}
              />
            </Form.Item>
            <Form.Item label="状态" name="状态">
              <Select
                options={[
                  { label: "全部", value: "全部" },
                  { label: "正常", value: 1 },
                  { label: "遗弃", value: 0 },
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
                  setRuleModal(true);
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
      <RuleModal
        open={rule_modal}
        onCancel={() => setRuleModal(false)}
        data={cur_data}
        opt_obj={query_opt}
        requestData={() => requestData(cur, page_size)}
      />
    </div>
  );
}

export default ErrRules;
