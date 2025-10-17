import React, { useState } from "react";
import { Col, Row, Table, Flex, Spin, message } from "antd";
import { useEffect } from "react";
import { GeneralCard } from "../../../../../components/CommonCard";
import { MemoMultiLineChart, MemoScatterLineChart } from "../Chart";
import { getEvalution } from "../../../../../apis/anls_api";
import { Select } from "antd";
import { selectList2Option } from "../../../../../utils/string";
import { Descriptions } from "antd";

const PARA_LIST = [
  "模具真空压力_抽真空时长",
  "模具真空压力_漏真空次数",
  "A相电流_与设定电流差值均值",
  "A相电流_与设定电流差值最大值",
  "A相电流_与设定电流差值标准差",
  "A相电流_断弧次数",
  "B相电流_均值",
  "B相电流_最大值",
  "B相电流_断弧次数",
  "C相电流_均值",
  "C相电流_最大值",
  "C相电流_断弧次数",
  "A相电压_均值",
  "A相电压_最大值",
  "B相电压_均值",
  "B相电压_最大值",
  "C相电压_均值",
  "C相电压_最大值",
  "引弧时间_时长",
  "设定输出电流_均值",
  "设定输出电流_最大值",
  "设定输出电流_最小值",
  "电极设定位置_均值",
  "电极设定位置_最小值",
  "电极升降实际位置_均值",
  "电极升降实际位置_最小值",
  "功率_积分",
  "模具转速_平均值",
  "电极开闭速度_绝对值最大值",
  "直接电流值_均值",
  "直接电流值_最大值",
  "曲线电流值_均值",
  "曲线电流值_最大值",
  "总进水水压_平均值",
  "模具出水流量_平均值",
  "模具出水温度_平均值",
  "铜电极1水流量_平均值",
  "铜电极1水温_平均值",
  "铜电极2水流量_平均值",
  "铜电极2水温_平均值",
  "铜电极3水流量_平均值",
  "铜电极3水温_平均值",
  "下隔热板1水流量_平均值",
  "下隔热板1水温_平均值",
  "下隔热板2水流量_平均值",
  "下隔热板2水温_平均值",
  "电极开闭位置_平均值",
  "真空设定频率_最大值",
  "下隔热板实际位置_最小值",
  "下隔热板设定位置_最小值",
];

function AiPush({ dev }) {
  const [load, setLoad] = useState(false);
  const [data, setData] = useState({});
  const [dianliu, setDianLiu] = useState("A相电流");
  const [tb_data, setTbData] = useState([]);
  const [desc_items, setDescItems] = useState([]);
  const columns = [
    {
      title: "批号",
      dataIndex: "批号",
      key: "批号",
    },
    ...PARA_LIST.map((item) => ({
      title: item,
      dataIndex: item,
      key: item,
    })),
  ];
  const query = () => {
    setLoad(true);
    getEvalution(
      { device_id: dev.match(/\d{2}$/)?.[0] || "" },
      (res) => {
        setLoad(false);
        const { data, code, msg } = res.data;
        if (code === 0) {
          const { 历史批次加工过程指标统计 = {}, 工艺参数推荐结果 = {} } = data;
          setData(data);
          const history_list = Object.keys(历史批次加工过程指标统计);
          const temp = [];
          if (history_list.length > 0) {
            history_list.forEach((item) => {
              temp.push({
                批号: item,
                ...历史批次加工过程指标统计[item],
              });
            });
          }
          setTbData(temp);
          if (工艺参数推荐结果["status"] === "success") {
            const dataObj = 工艺参数推荐结果["data"] || {};
            // 将对象转换为Descriptions组件需要的items格式
            const items = Object.keys(dataObj).map((key) => ({
              label: key,
              children: dataObj[key].toString(),
            }));
            setDescItems(items);
          } else {
            setDescItems([
              {
                label: "结果",
                children: "",
              },
            ]);
          }
        } else {
          setTbData([]);
          message.error(msg);
        }
      },
      () => {
        setLoad(false);
        setTbData([]);
      }
    );
  };
  useEffect(() => {
    if (dev) {
      query();
      const interval = setInterval(() => {
        query();
      }, 10 * 60 * 1000); // 10分钟 = 10 * 60 * 1000毫秒
      return () => {
        clearInterval(interval);
      };
    }
  }, [dev]);
  return (
    <Spin spinning={load}>
      <Row gutter={[16, 16]}>
        <Col span={10}>
          <Flex vertical gap={16}>
            <GeneralCard name="AI工艺推荐(主操)">
              <Descriptions
                bordered
                column={2}
                items={desc_items}
                style={{ minHeight: 400, padding: 6 }}
              />
            </GeneralCard>
            <GeneralCard name="AI工艺优化推荐(工艺)">
              <Table
                size="small"
                bordered
                columns={columns}
                dataSource={tb_data}
                pagination={false}
                scroll={{ x: "max-content" }}
                style={{ padding: 6 }}
              />
            </GeneralCard>
          </Flex>
        </Col>
        <Col span={14}>
          <GeneralCard name="多批次过程分析曲线图">
            <Row gutter={[10, 10]}>
              <Col span={12}>
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      zIndex: 5,
                    }}
                  >
                    <Select
                      value={dianliu}
                      onChange={setDianLiu}
                      options={selectList2Option([
                        "A相电流",
                        "B相电流",
                        "C相电流",
                      ])}
                    />
                  </div>
                  <MemoScatterLineChart
                    title="电流工艺分析"
                    chart_data={data["起弧电流管控"]?.[dianliu] ?? {}}
                  />
                </div>
              </Col>
              <Col span={12}>
                <MemoScatterLineChart
                  title="真空工艺分析"
                  chart_data={data["起弧真空管控"]}
                />
              </Col>
              <Col span={12}>
                <MemoScatterLineChart
                  title="模具出水温度"
                  chart_data={data["模具出水温度堆叠图"]}
                />
              </Col>
              <Col span={12}>
                <MemoMultiLineChart
                  title="功率工艺分析"
                  chart_data={data["功率堆叠图"]}
                />
              </Col>
            </Row>
          </GeneralCard>
        </Col>
      </Row>
    </Spin>
  );
}

export default AiPush;
