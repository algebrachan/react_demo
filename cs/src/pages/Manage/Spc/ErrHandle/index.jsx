import React, { useState } from "react";
import { GeneralCard, MyBreadcrumb } from "../../../../components/CommonCard";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import { selectList2Option } from "../../../../utils/string";
import { ComputeFormCol } from "../../../../utils/obj";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const default_query_form = {
  工厂: "",
  车间: "",
  工序: "",
  机台: "",
  特征: "",
};

const default_add_form = {
  工厂: "",
  车间: "",
  工序: "",
  机台: "",
  特征: "",
  异常分类: "",
  异常表现: "",
  严重程度: "",
  备注: "",
};

function ErrHandle() {
  const [query_form] = Form.useForm();
  const [add_form] = Form.useForm();
  const [query_opt, setQueryOpt] = useState({});
  const [tb_data, setTbData] = useState([{ key: 1, 工厂: "晶瑞" }]);
  const columns = Object.keys(default_add_form).map((e) => ({
    title: e,
    key: e,
    dataIndex: e,
    width: 100,
  }));
  columns.push({
    title: "操作",
    key: "opt",
    width: 120,
    render: (x) => (
      <Space>
        <Button type="link" icon={<EditOutlined />} style={{ padding: 5 }}>
          编辑
        </Button>
        <Button type="link" icon={<DeleteOutlined />} style={{ padding: 5 }}>
          删除
        </Button>
      </Space>
    ),
  });
  const pagination = () => {
    return {
      position: ["bottomCenter"],
      total: tb_data.length,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
      defaultPageSize: 20,
    };
  };

  return (
    <div>
      <MyBreadcrumb items={["创盛长晶智能集控系统", "异常处理"]} />
      <div
        className="content_root"
        style={{
          display: "flex",
          rowGap: 20,
          flexDirection: "column",
        }}
      >
        <Form
          form={query_form}
          initialValues={default_query_form}
          layout="inline"
        >
          {Object.keys(default_query_form).map((e, _) => (
            <Form.Item name={e} label={e} key={_}>
              <Select
                options={selectList2Option(query_opt[e])}
                style={{ width: 120 }}
              />
            </Form.Item>
          ))}
          <Button type="primary">查询</Button>
        </Form>
        <GeneralCard name="异常管理列表">
          <Row className="ctt">
            <Col span={5}>
              <div className="sider_root of" style={{ height: 740 }}>
                <Form
                  form={add_form}
                  initialValues={{}}
                  style={{
                    display: "flex",
                    rowGap: 16,
                    flexDirection: "column",
                    padding: 16,
                  }}
                  {...ComputeFormCol(5)}
                >
                  {Object.keys(default_add_form).map((e, _) => (
                    <Form.Item name={e} label={e} key={_}>
                      {e === "备注" ? (
                        <Input />
                      ) : (
                        <Select options={selectList2Option(query_opt[e])} />
                      )}
                    </Form.Item>
                  ))}
                  <Flex justify="flex-end">
                    <Button type="primary">新增</Button>
                  </Flex>
                </Form>
              </div>
            </Col>
            <Col span={19}>
              <div className="of" style={{ width: "100%", height: 740 }}>
                <Table
                  bordered
                  size="small"
                  columns={columns}
                  dataSource={tb_data}
                  pagination={pagination()}
                  className="common_table_root"
                />
              </div>
            </Col>
          </Row>
        </GeneralCard>
      </div>
    </div>
  );
}

export default ErrHandle;
