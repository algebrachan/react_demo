import React, { useState } from "react";
import { MyBreadcrumb } from "../../../../components/CommonCard";
import { Flex, Form, Button, Input, Table } from "antd";
import { getProductionConditionComparison } from "../../../../apis/search_api";
import { message } from "antd";

// 生产条件对比
function ProductionCondition() {
  const default_query_form = {
    批号: "",
  };
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);

  const [query_form] = Form.useForm();
  const columns = [
    {
      title: "序号",
      dataIndex: "key",
      key: "key",
      width: 60,
      render: (_, __, index) => index + 1,
      fixed: "left",
    },
    {
      title: "坩埚lotNo",
      dataIndex: "坩埚lotNo",
      key: "坩埚lotNo",
      width: 100,
      onCell: () => ({
        style: { background: "#bae0ff" },
      }),
      fixed: "left",
    },
    ...["监控id", "电极厂家", "电极结余"].map((item) => ({
      title: item,
      dataIndex: item,
      key: item,
      onCell: () => ({
        style: { background: "#bae0ff" },
      }),
    })),
    ...[
      "再生砂LotNo",
      "再生砂重量",
      "外层LotNo",
      "外层重量",
      "中外LotNo",
      "中外重量",
      "中内LotNo",
      "中内重量",
      "内层LotNo",
      "内层重量",
    ].map((item) => ({
      title: item,
      dataIndex: item,
      key: item,
      onCell: () => ({
        style: { background: "#ffd8bf" },
      }),
    })),
    ...[
      "外径D1",
      "外径D2",
      "外径D3",
      "壁厚T1",
      "壁厚T2",
      "壁厚T3",
      "TR",
      "BR",
      "TB",
      "RG",
      "BG",
    ].map((item) => ({
      title: item,
      dataIndex: item,
      key: item,
      onCell: () => ({
        style: { background: "#ffffb8" },
      }),
    })),
    ...[
      "熔融时间分",
      "熔融时间秒",
      "模具出水温度起弧前",
      "模具出水温度断弧时",
      "模具出水温度差",
      "真空极限压力",
      "电极更换时结余",
      "备注",
    ].map((item) => ({
      title: item,
      dataIndex: item,
      key: item,
      onCell: () => ({
        style: { background: "#fff0f6" },
      }),
    })),
    ...[
      "不良项目",
      "改型",
      "高度",
      "重量",
      "后道报废",
      "后道报废原因",
      "外观自检",
    ].map((item) => ({
      title: item,
      dataIndex: item,
      key: item,
      onCell: () => ({
        style: { background: "#f0f0f0" },
      }),
    })),
    ...[
      "监控id",
      "电极厂家",
      "电极结余",
      "熔融机号",
      "作业日期",
      "班次",
      "电极批次",
      "确认人",
      "主操",
      "辅操",
    ].map((item) => ({
      title: item,
      dataIndex: item,
      key: item,
      onCell: () => ({
        style: { background: "#bae0ff" },
      }),
    })),
    ...["作业时间1", "作业时间2", "生产数量"].map((item) => ({
      title: item,
      dataIndex: item,
      key: item,
      onCell: () => ({
        style: { background: "#ffe7ba" },
      }),
    })),
    ...["制造编号", "产品图号", "生产规格", "电极规格", "英寸"].map((item) => ({
      title: item,
      dataIndex: item,
      key: item,
      onCell: () => ({
        style: { background: "#b5f5ec" },
      }),
    })),
    ...["再生砂", "外层", "中外", "中内", "内层"].map((item) => ({
      title: item,
      dataIndex: item,
      key: item,
      onCell: () => ({
        style: { background: "#fff1f0" },
      }),
    })),
    ...[
      "模具R角",
      "模具内径",
      "内成型棒",
      "外成型棒",
      "底座编号",
      "内胆编号",
      "抽真空时间",
      "边料高度",
      "上邦编号",
    ].map((item) => ({
      title: item,
      dataIndex: item,
      key: item,
      onCell: () => ({
        style: { background: "#f4ffb8" },
      }),
    })),
  ];
  const pagination = {
    position: ["bottomCenter"],
    total: tb_data.length,
    showTotal: (total) => `共 ${total} 条`,
    showQuickJumper: true,
    showSizeChanger: true,
    defaultPageSize: 20,
  };
  const query = () => {
    const { 批号 } = query_form.getFieldsValue();
    if (!批号) return message.warning("请输入编号");
    const batchList = 批号
      ? 批号.split(/[\t\s\n\r]+/).filter((item) => item.trim() !== "")
      : [];
    setTbLoad(true);
    getProductionConditionComparison(
      { 批号: batchList },
      (res) => {
        setTbLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0) {
          const { data_list = [] } = data;
          setTbData(data_list);
        } else {
          setTbData([]);
          message.error(msg);
        }
      },
      () => {
        setTbLoad(false);
        setTbData([]);
        message.error("查询失败");
      }
    );
  };
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "生产条件对比"]} />
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
          layout="inline"
          initialValues={default_query_form}
        >
          <Flex gap={20}>
            <Form.Item label="批号" name="批号">
              <Input.TextArea
                placeholder="请复制批号"
                style={{ width: 500 }}
                autoSize={{ minRows: 1, maxRows: 3 }}
              />
            </Form.Item>
            <Button onClick={() => query_form.resetFields()}>重置</Button>
            <Button type="primary" onClick={query}>
              查询
            </Button>
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
          pagination={pagination}
        />
      </div>
    </div>
  );
}

export default ProductionCondition;
