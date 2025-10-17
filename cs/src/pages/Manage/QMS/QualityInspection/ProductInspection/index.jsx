import React, { useState, useEffect } from "react";
import { MyBreadcrumb } from "@/components/CommonCard";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Table,
  Collapse,
  Row,
  Col,
  message,
  Modal,
  Descriptions,
} from "antd";
import { selectList2Option, dateFormat } from "@/utils/string";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {
  finished_product_inspection,
  finished_product_inspection_export,
} from "@/apis/qms_router";
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
let id = "";
function ProductInspection() {
  const [form] = Form.useForm();
  const [cur, setCur] = useState(1);
  const [page_size, setPageSize] = useState(20);
  const [tb_total, setTbTotal] = useState(0);
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  // 弹框相关状态
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailData, setDetailData] = useState({});
  const [detailLoading, setDetailLoading] = useState(false);
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
  const initOpt = () => {
    requestData();
  };
  const columns = [
    {
      title: "检验日期",
      dataIndex: "检验日期",
      key: "检验日期",
    },
    {
      title: "开炉日期",
      dataIndex: "开炉日期",
      key: "开炉日期",
    },
    {
      title: "中心厚度",
      dataIndex: "中心厚度",
      key: "中心厚度",
      width: 120,
    },
    {
      title: "周次",
      dataIndex: "周次",
      key: "周次",
      width: 120,
    },
    {
      title: "多晶",
      dataIndex: "多晶",
      key: "多晶",
      width: 120,
    },
    {
      title: "开裂",
      dataIndex: "开裂",
      key: "开裂",
      width: 120,
    },
    {
      title: "微管孔洞",
      dataIndex: "微管孔洞",
      key: "微管孔洞",
    },
    {
      title: "晶体去向",
      dataIndex: "晶体去向",
      key: "晶体去向",
      width: 120,
    },
    {
      title: "晶体等级",
      dataIndex: "晶体等级",
      key: "晶体等级",
      width: 120,
    },
    {
      title: "晶体编码",
      dataIndex: "晶体编码",
      key: "晶体编码",
      width: 180,
    },
    {
      title: "最大直径",
      dataIndex: "最大直径",
      key: "最大直径",
      width: 120,
    },
    {
      title: "最小直径",
      dataIndex: "最小直径",
      key: "最小直径",
      width: 120,
    },
    {
      title: "有效厚度",
      dataIndex: "有效厚度",
      key: "有效厚度",
      width: 120,
    },
    {
      title: "烧蚀",
      dataIndex: "烧蚀",
      key: "烧蚀",
      width: 120,
    },
    {
      title: "相变",
      dataIndex: "相变",
      key: "相变",
      width: 120,
    },
    {
      title: "籽晶编号",
      dataIndex: "籽晶编号",
      key: "籽晶编号",
      width: 120,
    },
    {
      title: "结构缺陷描述",
      dataIndex: "结构缺陷描述",
      key: "结构缺陷描述",
    },
    {
      title: "表面缺陷描述",
      dataIndex: "表面缺陷描述",
      key: "表面缺陷描述",
    },
    {
      title: "边缘厚度",
      dataIndex: "边缘厚度",
      key: "边缘厚度",
      width: 120,
    },
    {
      title: "备注",
      dataIndex: "备注",
      key: "备注",
    },
    // {
    //   title: "操作",
    //   key: "opt",
    //   fixed: "right",
    //   width: 60,
    //   render: (_, record) => (
    //     <Space>
    //       <Button
    //         type="link"
    //         style={{ padding: 0 }}
    //         onClick={() => {
    //           showDetailModal(record);
    //         }}
    //       >
    //         详情
    //       </Button>
    //     </Space>
    //   ),
    // },
  ];
  const columns2 = [
    {
      title: "巡检工序",
      dataIndex: "巡检工序",
      key: "巡检工序",
      width: 120,
    },
    {
      title: "检验项目",
      dataIndex: "检验项目",
      key: "检验项目",
      width: 120,
    },
    {
      title: "检验方法",
      dataIndex: "检验方法",
      key: "检验方法",
      width: 120,
    },
    {
      title: "合格标准",
      dataIndex: "合格标准",
      key: "合格标准",
      width: 120,
    },
    {
      title: "检验数据",
      dataIndex: "检验数据",
      key: "检验数据",
      width: 120,
    },
    {
      title: "检验结果",
      dataIndex: "检验结果",
      key: "检验结果",
    },
    {
      title: "不合格类型",
      dataIndex: "不合格类型",
      key: "不合格类型",
      width: 120,
    },
    {
      title: "备注",
      dataIndex: "备注",
      key: "备注",
      width: 120,
    },
  ];
  const requestData = (page = 1, pageSize = 20) => {
    let val = form.getFieldsValue();
    setTbLoad(true);
    setCur(page);
    setPageSize(pageSize);
    finished_product_inspection(
      {
        limit: pageSize,
        page: page,
        time: val["时间"],
      },
      (res) => {
        setTbLoad(false);
        if (res.data.code == 0 && res.data.data) {
          setTbData(res.data.data);
          setTbTotal(res.data.length);
        } else {
          setTbData([]);
          setTbTotal(0);
        }
      },
      () => {
        setTbLoad(false);
        setTbData([]);
        setTbTotal(0);
      }
    );
  };

  useEffect(() => {
    initOpt();
  }, []);

  // 获取详情数据
  const getDetailData = (record) => {
    setDetailLoading(true);
    // 这里预留接口请求位置，根据实际接口调整
    // 示例：get_product_inspection_detail({ id: record.id }, (res) => {
    //   setDetailLoading(false);
    //   if (res.data.code === 0) {
    //     setDetailData(res.data.data);
    //   } else {
    //     message.error('获取详情失败');
    //   }
    // }, () => {
    //   setDetailLoading(false);
    //   message.error('获取详情失败');
    // });

    // 临时模拟数据，实际使用时替换为真实接口
    setTimeout(() => {
      setDetailLoading(false);
      setDetailData({
        检验日期: record.检验日期,
        晶体编码: record.晶体编码,
        周次: record.周次,
        开炉日期: record.开炉日期,
        最大直径: record.最大直径,
        最小直径: record.最小直径,
        巡检人: record.巡检人,
        检验结果: record.检验结果,
        创建时间: record.创建时间,
        创建人: record.创建人,
        备注: "这是详细的检验备注信息",
        检验标准: "GB/T 12345-2020",
        检验方法: "目视检验+测量",
        检验设备: "游标卡尺、显微镜",
        检验环境: "温度20±2℃，湿度45-65%",
        不合格项: "无",
        处理意见: "检验合格，可以放行",
      });
    }, 500);
  };

  // 打开详情弹框
  const showDetailModal = (record) => {
    setDetailModalVisible(true);
    getDetailData(record);
  };

  // 关闭详情弹框
  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setDetailData({});
  };

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "质量检验", "成品检验"]} />
      <div
        className="content_root"
        style={{
          display: "flex",
          rowGap: 20,
          flexDirection: "column",
        }}
      >
        <Form
          layout="inline"
          form={form}
          initialValues={{
            快捷检索: 1,
            时间: [
              dayjs().subtract(1, "month").format(dateFormat),
              dayjs().format(dateFormat),
            ],
          }}
        >
          <Form.Item label="快捷检索" name="快捷检索">
            <Select
              style={{ width: 100 }}
              options={[
                { label: "一月", value: 1 },
                { label: "三月", value: 3 },
                { label: "半年", value: 6 },
                { label: "一年", value: 12 },
              ]}
              onChange={(val) => {
                form.setFieldsValue({
                  时间: [
                    dayjs().subtract(val, "month").format(dateFormat),
                    dayjs().format(dateFormat),
                  ],
                });
              }}
            />
          </Form.Item>
          <Form.Item
            label="开炉时间"
            name="时间"
            getValueProps={(value) => {
              return {
                value: value && value.map((e) => dayjs(e)),
              };
            }}
            normalize={(value) =>
              value && value.map((e) => dayjs(e).format(dateFormat))
            }
          >
            <RangePicker style={{ width: 240 }} allowClear={false} />
          </Form.Item>

          <Space>
            <Button type="primary" onClick={() => requestData(1, 20)}>
              查询
            </Button>
          </Space>
          <Space>
            <Button
              type="primary"
              onClick={() => {
                const val = form.getFieldsValue();
                finished_product_inspection_export(
                  { time: val["时间"] },
                  ({ data }) => {
                    const blob = new Blob([data]);
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.style.display = "none";
                    link.href = url;
                    link.download = "成品检验.csv";
                    document.body.appendChild(link);
                    link.click();
                    URL.revokeObjectURL(url);
                    document.body.removeChild(link);
                  }
                );
              }}
              style={{ marginLeft: 10 }}
            >
              导出
            </Button>
          </Space>
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
          pagination={pagination()}
        />
      </div>

      <Modal
        title="详情"
        open={detailModalVisible}
        onCancel={closeDetailModal}
        footer={null}
        width={1000}
      >
        <Descriptions bordered loading={detailLoading}>
          <Descriptions.Item label="巡检任务">
            {detailData.巡检任务}
          </Descriptions.Item>
          <Descriptions.Item label="巡检设备">
            {detailData.巡检设备}
          </Descriptions.Item>
          <Descriptions.Item label="巡检规则名称">
            {detailData.巡检规则名称}
          </Descriptions.Item>
          <Descriptions.Item label="巡检方式">
            {detailData.巡检方式}
          </Descriptions.Item>
          <Descriptions.Item label="设备类型">
            {detailData.设备类型}
          </Descriptions.Item>
          <Descriptions.Item label="所属系列">
            {detailData.最小直径}
          </Descriptions.Item>
          <Descriptions.Item label="巡检人">
            {detailData.巡检人}
          </Descriptions.Item>
        </Descriptions>
        <Table
          loading={tb_load}
          size="small"
          columns={columns2}
          dataSource={tb_data}
          scroll={{
            y: 300,
          }}
          pagination={pagination()}
        />
      </Modal>
    </div>
  );
}

export default ProductInspection;
