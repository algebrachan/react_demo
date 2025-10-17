import React, { useState } from "react";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import { Button, Flex, Form, Popconfirm, Select, Space, Table } from "antd";
import { selectList2Option } from "../../../../utils/string";
import {
  AuditOutlined,
  CheckSquareOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
// import { ExamineModal } from "./Modal";
import { useNavigate } from "react-router-dom";

function ErrDetails() {
  const default_query_form = {
    工厂: "",
    车间: "",
    设备: "",
    参数: "",
    紧急程度: "",
    状态: "",
  };
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [tb_data, setTbData] = useState([{ key: 1 }]);
  const [tb_load, setTbLoad] = useState(false);
  const [cur, setCur] = useState(1);
  const [page_size, setPageSize] = useState(20);
  const [tb_total, setTbTotal] = useState(0);
  const [e_modal, setEModal] = useState(false);
  const [cur_data, setCurData] = useState({});
  const close = (record) => {
    console.log(record);
  };
  const generateColumns = () => {
    let columns = [
      "工厂",
      "车间",
      "工序",
      "设备",
      "参数",
      "紧急程度",
      "值",
      "规则",
      "上限",
      "标准",
      "下限",
      "偏差",
      "状态",
      "报警时间",
      "更新时间",
      "更新人",
    ].map((e, _) => {
      let col = {
        title: e,
        dataIndex: e,
        key: e,
      };
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
      render: (record) => (
        <Space>
          <Button style={{ padding: 0 }} type="link" icon={<EyeOutlined />}>
            查看
          </Button>
          <Button
            style={{ padding: 0 }}
            type="link"
            icon={<CheckSquareOutlined />}
            onClick={() =>
              navigate("/mng/fdc_err_details/dellwith", {
                state: {
                  data: record,
                },
              })
            }
          >
            处理
          </Button>
          <Button
            style={{ padding: 0 }}
            type="link"
            icon={<AuditOutlined />}
            onClick={() => {
              setEModal(true);
              setCurData(record);
            }}
          >
            审核
          </Button>
          <Popconfirm
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
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "异常详情"]} />
      <div className="content_root">
        <Flex vertical gap={20}>
          <Form form={form} initialValues={default_query_form} layout="inline">
            {["工厂", "车间", "设备", "参数", "紧急程度", "状态"].map(
              (item, _) => (
                <Form.Item label={item} name={item} key={_}>
                  <Select
                    options={selectList2Option([])}
                    style={{ width: 120 }}
                  />
                </Form.Item>
              )
            )}
            <Space>
              <Button type="primary">查询</Button>
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
      {/* <ExamineModal
        open={e_modal}
        onCancel={() => setEModal(false)}
        data={cur_data}
        requestData={() => requestData(cur, page_size)}
      /> */}
    </div>
  );
}

export default ErrDetails;
