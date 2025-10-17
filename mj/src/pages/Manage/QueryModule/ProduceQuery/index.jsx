import React, { useEffect, useState } from "react";
import { GeneralCard, MyBreadcrumb } from "../../../../components/CommonCard";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  Space,
  Table,
  Tooltip
} from "antd";
import { selectList2Option, timeFormat } from "../../../../utils/string";
import dayjs from "dayjs";
import { getSearchList } from "../../../../apis/anls_api";
import { ExportOutlined } from "@ant-design/icons";
import {
  exportProductionSchedule,
  getProductionSchedule,
} from "../../../../apis/search_api";
import { downloadFile } from "../../../../utils/obj";
const { RangePicker } = DatePicker;

const default_query_form = {
  起止时间: [
    dayjs().subtract(30, "day").format(timeFormat),
    dayjs().format(timeFormat),
  ],
  图号: "",
  批号: "",
};

function ProduceQuery() {
  const [query_form] = Form.useForm();
  const [option_obj, setOptionObj] = useState({});
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);

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
      "图号",
      "型号",
      "英寸",
      "批号",
      "机台",
      "批号打印时间",
      "生产日期",
      "班长",
      "主操",
      "辅操",
      "流向",
      "作业点",
      "判定",
      "工检1判定",
      "备注",
      "工检1时间",
      "工检2判定",
      "工检2时间",
      "终检判定",
      "终检时间",
      "工检检查表判定",
      "D1",
      "D2",
      "D3",
      "T1",
      "T2",
      "T3",
      "R",
      "B",
      "TT1",
      "TT2",
      "TT3",
      "TTR",
      "TTB",
      "QT1",
      "QT2",
      "QT3",
      "QTR",
      "QTB",
      "BG_RG",
      "黑点0.6-1.0mm",
      "黑点1.1-1.5mm",
      "黑点1.6-2.0mm",
      "黑点2.1-2.5mm",
      "黑点2.6-3.0mm",
      "气泡0.6-1.0mm",
      "气泡1.1-1.5mm",
      "气泡1.6-2.0mm",
      "气泡2.1-2.5mm",
      "气泡2.6-3.0mm",
      "白点0.0-6.0mm",
      "白点6.0-9.9mm",
      "白点0.0-1.0mm",
      "白点1.0-3.0mm",
      "白点3.0-9.9mm",
      "波纹",
      "脱落",
      "橘子皮",
      "其他缺陷",
      "高度",
      "重量",
    ].map((e, _) => {
      let col = {
        // width: e.length > 3 ? 80 : 60,
        title: e,
        dataIndex: e,
        key: e,
      };
      if (e === "备注") {
        col.render = (x) => {
          // 如果没有内容或内容为空，直接返回
          if (!x || x.trim() === "") return "";

          return (
            <Tooltip
              title={
                <div style={{ whiteSpace: "pre-wrap", maxWidth: 300 }}>{x}</div>
              }
            >
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "help",
                  maxWidth: 100, // 确保文本不会超出单元格宽度
                }}
              >
                {x}
              </div>
            </Tooltip>
          );
        };
      }
      return col;
    });
    columns.unshift({
      width: 60,
      title: "序号",
      key: "key",
      dataIndex: "key",
      render: (x) => x + 1,
    });
    return columns;
  };
  const requestData = () => {
    let val = query_form.getFieldsValue();
    setTbLoad(true);
    getProductionSchedule(
      val,
      (res) => {
        const { data, code, msg } = res.data;
        setTbLoad(false);
        if (code === 0 && data) {
          const { data_list = [] } = data;
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
  const download = () => {
    let val = query_form.getFieldsValue();
    exportProductionSchedule(
      val,
      (res) => {
        const { code, data, msg } = res.data;
        if (code === 0 && data) {
          const { url } = data;
          downloadFile(url);
        } else {
          message.error(msg);
        }
      },
      () => {
        message.error("网络异常");
      }
    );
  };
  const initOption = () => {
    getSearchList(
      (res) => {
        const { data, code, msg } = res.data;
        if (code === 0 && data) {
          const { 图号 = [] } = data;
          let val = {
            图号: 图号[0] ? 图号[0] : "",
          };
          query_form.setFieldsValue(val);
          setOptionObj(data);
        } else {
          setOptionObj({});
        }
      },
      () => {
        setOptionObj({});
      }
    );
  };
  useEffect(() => {
    if (Object.keys(option_obj).length > 0) {
      requestData();
    }
  }, [option_obj]);
  useEffect(() => {
    initOption();
  }, []);
  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "生产进度查询"]} />
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
          <Form.Item
            label="起止时间"
            name="起止时间"
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
          <Form.Item label="图号" name="图号">
            <Select
              showSearch
              options={selectList2Option(option_obj["图号"])}
              style={{ width: 160 }}
            />
          </Form.Item>
          <Form.Item label="批号" name="批号">
            <Input placeholder="请输入" />
          </Form.Item>
          <Space size={20}>
            <Button type="primary" onClick={requestData} loading={tb_load}>
              查询
            </Button>
            <Button type="primary" icon={<ExportOutlined />} onClick={download}>
              导出
            </Button>
          </Space>
        </Form>
        <GeneralCard name="生产进度表">
          <Table
            bordered
            loading={tb_load}
            size="small"
            columns={generateColumns()}
            dataSource={tb_data}
            scroll={{
              x: "max-content",
            }}
            pagination={pagination()}
          />
        </GeneralCard>
      </div>
    </div>
  );
}

export default ProduceQuery;
