import { Button, Flex, Space, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import "./wwo.less";
import dayjs from "dayjs";
import { timeFormat } from "../../../../utils/string";
import { getTaskList } from "../../../../apis/dispatch_api";

const Time = () => {
  const getNowTime = () => {
    let now = dayjs();
    return now.format(timeFormat);
  };
  const [time, setTime] = useState(getNowTime());
  const timer = useRef(-1);
  useEffect(() => {
    timer.current = setInterval(() => {
      setTime(getNowTime());
    }, 500);
    return () => {
      clearInterval(timer.current);
    };
  }, []);
  return (
    <Flex justify="end" style={{ fontSize: 20 }}>
      时间: {time}
    </Flex>
  );
};

// 车间工单列表
function WorkshopWorkOrder() {
  const [tb_load, setTbLoad] = useState(false);
  const [tb_data, setTbData] = useState([{ key: 1 }]);
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

  const generateColumns = () => {
    let columns = [
      "编号",
      "标题",
      "状态",
      "责任人",
      "优先级",
      "设备",
      "操作事项",
      "剩余时间",
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
      render: (x) => x + 1,
    });
    columns.push({
      title: "操作",
      key: "opt",
      render: (record) => (
        <Space>
          <Button type="link" style={{ padding: 0, fontSize: 20 }}>
            完成
          </Button>
        </Space>
      ),
    });
    columns.push({
      title: "上报",
      key: "submit",
      render: (record) => (
        <Space>
          <Button type="link" style={{ padding: 0, fontSize: 20 }}>
            上报
          </Button>
        </Space>
      ),
    });
    return columns;
  };
  const requestData = () => {
    setTbLoad(true);
    getTaskList(
      (res) => {
        setTbLoad(false);
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          const { data_list } = data;
          setTbData(data_list);
        } else {
          setTbData([]);
        }
      },
      () => {
        setTbLoad(false);
        setTbData([]);
      }
    );
  };
  useEffect(() => {
    requestData();
    // 定时刷新
  }, []);
  return (
    <Flex vertical gap={10} className="workshop_root">
      <Flex justify="center" className="title">
        熔融车间工单显示
      </Flex>
      <Time />
      <Table
        size="large"
        loading={tb_load}
        columns={generateColumns()}
        dataSource={tb_data}
        bordered
        scroll={{
          x: "max-content",
        }}
        pagination={pagination()}
      />
    </Flex>
  );
}

export default WorkshopWorkOrder;
