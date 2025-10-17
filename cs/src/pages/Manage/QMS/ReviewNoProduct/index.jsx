import React, { useEffect, useState } from "react";
import { MyBreadcrumb } from "@/components/CommonCard";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Table,
  Tabs,
  Popconfirm,
} from "antd";
import { selectList2Option, dateFormat } from "@/utils/string";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { qmsGetReviews, qmsReviews } from "@/apis/qms_router";
import { CreatNoP } from "./Modal";
import NoIsolation from "./NoIsolation";
import UnqualifiedReview from "./UnqualifiedReview";
import UnqualifiedDisposal from "./UnqualifiedDisposal";
import UnqualifiedTrace from "./UnqualifiedTrace";
const { RangePicker } = DatePicker;
const default_query_form = {
  起止时间: [
    dayjs().subtract(1, "month").format(dateFormat),
    dayjs().format(dateFormat),
  ],
  产品名称: "",
  快捷检索: 1,
  规格: "",
  批次号: "",
  状态: "全部",
};
// 不合格品评审
function ReviewNoProduct() {
  const [form] = Form.useForm();
  const [modal_create, setModalCreate] = useState(false);
  const [order_record, setOrderRecord] = useState({});
  const [review_data, setReviewData] = useState({});
  const [cur, setCur] = useState(1);
  const [page_size, setPageSize] = useState(20);
  const [tb_total, setTbTotal] = useState(0);
  const [tb_data, setTbData] = useState([]);
  const [tb_load, setTbLoad] = useState(false);
  const navigate = useNavigate();
  const [option_obj, setOptionObj] = useState({
    状态: ["全部", "进行中", "已完成", "关闭"],
  });
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
  const requestReview = (review_id) => {
    qmsGetReviews(
      { review_id },
      (res) => {
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          setReviewData(data);
        } else {
          setReviewData({});
        }
      },
      () => {
        setReviewData({});
      }
    );
  };
  const initOpt = () => {};
  const columns = [
    {
      title: "单号",
      dataIndex: "单号",
      key: "单号",
      width: 120,
    },
    {
      title: "主题",
      dataIndex: "主题",
      key: "主题",
      width: 100,
    },
    {
      title: "产品名称",
      dataIndex: "产品名称",
      key: "产品名称",
      width: 100,
    },
    {
      title: "规格",
      dataIndex: "规格",
      key: "规格",
      width: 100,
    },
    {
      title: "批次号",
      dataIndex: "批次号",
      key: "批次号",
      width: 100,
    },
    {
      title: "批次总数量",
      dataIndex: "批次总数量",
      key: "批次总数量",
      width: 100,
    },
    {
      title: "不合格数量",
      dataIndex: "不合格数量",
      key: "不合格数量",
      width: 100,
    },
    {
      title: "不合格占比",
      dataIndex: "不合格占比",
      key: "不合格占比",
      width: 100,
    },
    {
      title: "检验员",
      dataIndex: "检验员",
      key: "检验员",
      width: 80,
    },
    {
      title: "检验日期",
      dataIndex: "检验日期",
      key: "检验日期",
      width: 120,
    },
    {
      title: "进度",
      dataIndex: "进度",
      key: "进度",
      width: 120,
    },
    {
      title: "已评审",
      dataIndex: "已评审",
      key: "已评审",
      width: 120,
      render: (x) => x && x.join(","),
    },
    {
      title: "未评审",
      dataIndex: "未评审",
      key: "未评审",
      width: 120,
      render: (x) => x && x.join(","),
    },
    {
      title: "状态",
      dataIndex: "状态",
      key: "状态",
      width: 100,
    },
    {
      title: "操作",
      key: "opt",
      fixed: "right",
      width: 60,
      render: (record) => (
        <Space>
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() =>
              navigate("/mng/qms_reviewnoproduct/bpm", {
                state: { 编号: record["编号"] },
              })
            }
          >
            审批
          </Button>
        </Space>
      ),
    },
  ];
  const requestData = (page, pageSize) => {
    let val = form.getFieldsValue();
    val["limit"] = pageSize;
    val["skip"] = page - 1;
    setTbLoad(true);
    qmsReviews(
      val,
      (res) => {
        setTbLoad(false);
        const { code, msg, data } = res.data;
        if (code === 0 && data) {
          const { reviews, total_count } = data;
          setTbData(reviews);
          setTbTotal(total_count);
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
    requestData(cur, page_size);
    initOpt();
  }, []);

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "不合格处置"]} />
      <div
        className="content_root"
        style={{
          display: "flex",
          rowGap: 20,
          flexDirection: "column",
        }}
      >
        <Form layout="inline" form={form} initialValues={default_query_form}>
          <Space>
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
                    起止时间: [
                      dayjs().subtract(val, "month").format(dateFormat),
                      dayjs().format(dateFormat),
                    ],
                  });
                }}
              />
            </Form.Item>
            <Form.Item
              label="起止时间"
              name="起止时间"
              getValueProps={(value) => {
                return {
                  value: value && value.map((e) => dayjs(e)),
                };
              }}
              normalize={(value) =>
                value && value.map((e) => dayjs(e).format(dateFormat))
              }
            >
              <RangePicker allowClear={false} />
            </Form.Item>
            <Form.Item label="产品名称" name="产品名称">
              <Input placeholder="请输入" />
            </Form.Item>
            {/* <Form.Item label="物料编号" name="物料编号">
              <Input placeholder="请输入" />
            </Form.Item> */}
            <Form.Item label="规格" name="规格">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="批次号" name="批次号">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="状态" name="状态">
              <Select
                options={selectList2Option(option_obj["状态"])}
                style={{ width: 160 }}
              />
            </Form.Item>
            <Button type="primary" onClick={() => requestData(cur, page_size)}>
              查询
            </Button>
            <Button onClick={() => setModalCreate(true)}>发起不合格</Button>
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
        {/* <Tabs defaultActiveKey="1" items={items} /> */}
      </div>
      <CreatNoP
        open={modal_create}
        onCancel={() => setModalCreate(false)}
        requestData={() => requestData(cur, page_size)}
      />
    </div>
  );
}

export default ReviewNoProduct;
