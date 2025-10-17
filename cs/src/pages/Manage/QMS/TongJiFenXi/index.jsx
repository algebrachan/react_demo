import React, { useState, useEffect } from 'react';
import { MyBreadcrumb } from "../../../../components/CommonCard";
import { Button, DatePicker, Form, Select, Space, message } from "antd";
import { dateFormat } from "../../../../utils/string";
import dayjs from "dayjs";
import StatisticalCharts from "./Charts";
import {
  statistical_analysis
} from "../../../../apis/qms_router";

const { RangePicker } = DatePicker;

export default function Index() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);

  // 等级选项数据
  const levelOptions = [
    { label: '一级审核', value: 1 },
    { label: '二级审核', value: 2 },
    { label: '三级审核', value: 3 }
  ];

  // 初始化表单
  useEffect(() => {
    form.setFieldsValue({
      等级: 1,
      时间: [
        dayjs().subtract(1, 'month').format(dateFormat),
        dayjs().format(dateFormat)
      ]
    });
    handleQuery()
  }, []);

  // 查询数据
  const handleQuery = () => {
    const values = form.getFieldsValue();
    
    if (!values.等级) {
      message.warning('请选择等级');
      return;
    }
    
    if (!values.时间 || values.时间.length !== 2) {
      message.warning('请选择时间范围');
      return;
    }

    setLoading(true);
    
    const params = {
      level: values.等级,
      start_date: values.时间[0],
      end_date: values.时间[1]
    };

    statistical_analysis(
      params,
      (res) => {
        setLoading(false);
        if (res.data.code === 200) {
          setChartData(res.data.data || null);
        } else {
          message.error(res.data.msg || '查询失败');
          setChartData(null);
        }
      },
      (error) => {
        setLoading(false);
        message.error('网络异常，请稍后重试');
        setChartData(null);
      }
    );
  };


  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "统计分析"]} />
      <div
        className="content_root"
        style={{
          display: "flex",
          rowGap: 20,
          flexDirection: "column",
        }}
      >
        <Form layout="inline" form={form}>
          <Form.Item 
            label="等级" 
            name="等级"
            rules={[{ required: true, message: '请选择等级' }]}
          >
            <Select
              options={levelOptions}
              placeholder="请选择等级"
              style={{ width: 120 }}
            />
          </Form.Item>
          
          <Form.Item
            label="时间"
            name="时间"
            rules={[{ required: true, message: '请选择时间范围' }]}
            getValueProps={(value) => {
              return {
                value: value && value.length === 2 && value.every(v => v)
                  ? [dayjs(value[0]), dayjs(value[1])]
                  : undefined,
              };
            }}
            normalize={(value) => {
              return value && value.length === 2
                ? [value[0].format(dateFormat), value[1].format(dateFormat)]
                : ['', ''];
            }}
          >
            <RangePicker
              style={{ width: 240 }}
              allowClear={true}
              placeholder={['开始日期', '结束日期']}
              format={dateFormat}
            />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleQuery} loading={loading}>
                查询
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <StatisticalCharts chartData={chartData} />
      </div>
    </div>
  );
}
