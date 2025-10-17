import React, { useEffect, useState } from "react";
import { MyBreadcrumb } from "../../../../components/CommonCard";
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
  Flex,
  Card,
} from "antd";
import {
  dateFormat,
  selectList2Option,
} from "../../../../utils/string";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {
  read_lop,
  lop_options,
} from "../../../../apis/qms_router";
import StackedChart from "./StackedChart";
import BarChart from "./BarChart";
import BoxPlot from "./BoxPlot";
import LineChart from "./LineChart";

const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { Option } = Select;
function LOP() {
  const [form] = Form.useForm();
  const [singleFactorForm] = Form.useForm();
  const [cur, setCur] = useState(1);
  const [page_size, setPageSize] = useState(20);
  const [tb_total, setTbTotal] = useState(0);
  const [tb_data, setTbData] = useState( [
            {'晶体编码': 'P0113', '低压控温下限': '2210', '低压控温上限': '2240', '高压控温': '2195', '侧底比': '1.7-10', '装料工艺': 'HN-242', '顶保温方案': '6.6', '顶盖型号': 'S2-D5', '重量长速': '5.77', '晶体等级': '一等品'}, {'晶体编码': 'P0114', '低压控温下限': '2210', '低压控温上限': '2250', '高压控温': '2195', '侧底比': '2', '装料工艺': 'HN-62', '顶保温方案': '6.6', '顶盖型号': 'E2-FX002', '重量长速': '6.06', '晶体等级': '一等品'}, {'晶体编码': 'P0116', '低压控温下限': '2210', '低压控温上限': '2240', '高压控温': '2195', '侧底比': '2.3', '装料工艺': 'HN-242', '顶保温方案': '6.6', '顶盖型号': 'E2-FX002', '重量长速': '7.0', '晶体等级': '一等品'},   {'晶体编码': 'T7816', '低压控温下限': '2210', '低压控温上限': '2250', '高压控温': '2195', '侧底比': '2', '装料工艺': 'HN-24', '顶保温方案': '6.6', '顶盖型号': 'E2-FX002', '重量长速': '6.82', '晶体等级': '一等品'}, {'晶体编码': 'T7817', '低压控温下限': '2210', '低压控温上限': '2240', '高压控温': '2195', '侧底比': '2.3', '装料工艺': 'HN-242', '顶保温方案': '6.6', '顶盖型号': 'E2-FX002', '重量长速': '6.94', '晶体等级': '一等品'}]);
  const [tb_load, setTbLoad] = useState(false);
  const [opData, setOpData] = useState({});
  const [columns, setColumns] = useState([
                {'title': '晶体编码', 'dataIndex': '晶体编码', 'key': '晶体编码'},
                {'title': '低压控温下限', 'dataIndex': '低压控温下限', 'key': '低压控温下限'}, {'title': '低压控温上限', 'dataIndex': '低压控温上限', 'key': '低压控温上限'}, {'title': '高压控温', 'dataIndex': '高压控温', 'key': '高压控温'}, {'title': '侧底比', 'dataIndex': '侧底比', 'key': '侧底比'}, {'title': '装料工艺', 'dataIndex': '装料工艺', 'key': '装料工艺'}, {'title': '顶保温方案', 'dataIndex': '顶保温方案', 'key': '顶保温方案'}, {'title': '顶盖型号', 'dataIndex': '顶盖型号', 'key': '顶盖型号'}, {'title': '重量长速', 'dataIndex': '重量长速', 'key': '重量长速'}, {'title': '晶体等级', 'dataIndex': '晶体等级', 'key': '晶体等级'}],);
  const [analysisData, setAnalysisData] = useState({
    'ori_data': {
        'columns':
            [
                {'title': '晶体编码', 'dataIndex': '晶体编码', 'key': '晶体编码'},
                {'title': '低压控温下限', 'dataIndex': '低压控温下限', 'key': '低压控温下限'}, {'title': '低压控温上限', 'dataIndex': '低压控温上限', 'key': '低压控温上限'}, {'title': '高压控温', 'dataIndex': '高压控温', 'key': '高压控温'}, {'title': '侧底比', 'dataIndex': '侧底比', 'key': '侧底比'}, {'title': '装料工艺', 'dataIndex': '装料工艺', 'key': '装料工艺'}, {'title': '顶保温方案', 'dataIndex': '顶保温方案', 'key': '顶保温方案'}, {'title': '顶盖型号', 'dataIndex': '顶盖型号', 'key': '顶盖型号'}, {'title': '重量长速', 'dataIndex': '重量长速', 'key': '重量长速'}, {'title': '晶体等级', 'dataIndex': '晶体等级', 'key': '晶体等级'}],
        'datas': [
            {'晶体编码': 'P0113', '低压控温下限': '2210', '低压控温上限': '2240', '高压控温': '2195', '侧底比': '1.7-10', '装料工艺': 'HN-242', '顶保温方案': '6.6', '顶盖型号': 'S2-D5', '重量长速': '5.77', '晶体等级': '一等品'}, {'晶体编码': 'P0114', '低压控温下限': '2210', '低压控温上限': '2250', '高压控温': '2195', '侧底比': '2', '装料工艺': 'HN-62', '顶保温方案': '6.6', '顶盖型号': 'E2-FX002', '重量长速': '6.06', '晶体等级': '一等品'}, {'晶体编码': 'P0116', '低压控温下限': '2210', '低压控温上限': '2240', '高压控温': '2195', '侧底比': '2.3', '装料工艺': 'HN-242', '顶保温方案': '6.6', '顶盖型号': 'E2-FX002', '重量长速': '7.0', '晶体等级': '一等品'},   {'晶体编码': 'T7816', '低压控温下限': '2210', '低压控温上限': '2250', '高压控温': '2195', '侧底比': '2', '装料工艺': 'HN-24', '顶保温方案': '6.6', '顶盖型号': 'E2-FX002', '重量长速': '6.82', '晶体等级': '一等品'}, {'晶体编码': 'T7817', '低压控温下限': '2210', '低压控温上限': '2240', '高压控温': '2195', '侧底比': '2.3', '装料工艺': 'HN-242', '顶保温方案': '6.6', '顶盖型号': 'E2-FX002', '重量长速': '6.94', '晶体等级': '一等品'}]
          },
    'single_factor_analysis':
        {'is_numeric': true,
         'table': {
             'columns': [{'title': '工艺分组', 'dataIndex': '工艺分组', 'key': '工艺分组'}, {'title': '工艺组合', 'dataIndex': '工艺组合', 'key': '工艺组合'}, {'title': '样本数', 'dataIndex': '样本数', 'key': '样本数'}, {'title': '均值', 'dataIndex': '均值', 'key': '均值'}, {'title': '标准差', 'dataIndex': '标准差', 'key': '标准差'}, {'title': '方差', 'dataIndex': '方差', 'key': '方差'}, {'title': '最小值', 'dataIndex': '最小值', 'key': '最小值'}, {'title': '中位数', 'dataIndex': '中位数', 'key': '中位数'}, {'title': '最大值', 'dataIndex': '最大值', 'key': '最大值'}],
             'datas': [{'工艺分组': '46', '工艺组合': '低压=2210|低压=2240|高压=2195|侧底=1.7-10|装料=HN-242|顶保=6.6|顶盖=S2-D5', '样本数': '76', '均值': '5.817', '标准差': '0.267', '方差': '0.071', '最小值': '5.12', '中位数': '5.84', '最大值': '6.46'}, {'工艺分组': '53', '工艺组合': '低压=2210|低压=2240|高压=2195|侧底=1.7-10|装料=HS-21|顶保=6.6|顶盖=S2-D5', '样本数': '63', '均值': '6.204', '标准差': '0.282', '方差': '0.08', '最小值': '5.67', '中位数': '6.16', '最大值': '6.77'}, {'工艺分组': '61', '工艺组合': '低压=2210|低压=2240|高压=2195|侧底=2.3|装料=HN-242|顶保=6.6|顶盖=E2-FX002', '样本数': '140', '均值': '6.872', '标准差': '0.332', '方差': '0.11', '最小值': '5.98', '中位数': '6.83', '最大值': '7.85'}, {'工艺分组': '64', '工艺组合': '低压=2210|低压=2240|高压=2195|侧底=2.3|装料=HN-24|顶保=6.6|顶盖=E2-FX002', '样本数': '101', '均值': '6.738', '标准差': '0.385', '方差': '0.148', '最小值': '5.91', '中位数': '6.73', '最大值': '7.57'}, {'工艺分组': '87', '工艺组合': '低压=2210|低压=2250|高压=2195|侧底=2.3|装料=HN-24|顶保=6.6|顶盖=E2-FX002', '样本数': '205', '均值': '7.12', '标准差': '0.392', '方差': '0.153', '最小值': '6.29', '中位数': '7.1', '最大值': '8.17'}]
         },
         '箱线图':
             {'x_axis': {'values': [46, 53, 61, 64, 87]},
              'ydata': {'values': [[5.12, 5.637, 5.817, 6.002, 6.46], [5.67, 6.035, 6.204, 6.365, 6.77], [5.98, 6.62, 6.872, 7.12, 7.85], [5.91, 6.44, 6.738, 7.05, 7.57], [6.29, 6.84, 7.12, 7.4, 8.17]]}},
         '柱状图': {
             'x_axis': {'values': []},
             'ydata': {'values': []}},
         '堆叠图': {
             'x_axis': {'values': [46, 53, 61, 64, 87]},
            'legend': ['一等品', '二等品'],
            'ydata': {
                'values': [[80.769, 19.231], [71.429, 28.571], [82.979, 17.021], [92.079, 7.921], [93.689, 6.311]]
            }
         }
    },
    'importance_analysis': {
        'r2_score': 0.613,
        'feature_importance': {
            'x_axis': {'values': ['侧底比=1.7-10', '低压控温上限', '装料工艺=HS-21', '装料工艺=HN-242', '装料工艺=HN-24', '侧底比=2.3', '顶盖型号=E2-FX002', '顶盖型号=S2-D5']},
            'ydata': {'values': [0.464, 0.158, 0.144, 0.117, 0.117, 0.0, 0.0, 0.0]}
        }
    },
    'recommend_process': {
        'grade_distribution': {
            'x_axis': {'values': [46, 53, 61, 64, 87]},
            'legend': ['一等品', '二等品'],
            'ydata': {
                'values': [[80.769, 19.231], [71.429, 28.571], [82.979, 17.021], [92.079, 7.921], [93.689, 6.311]]
            }
        },
        'variance_analysis': {
            'x_axis': {'values': [46, 53, 61, 64, 87]},
            'ydata': {'values': [0.071, 0.08, 0.11, 0.148, 0.153]}
        }
    }
  });
  const [chartType, setChartType] = useState('箱线图');
  const navigate = useNavigate();
  const initOpt = () => {
    lop_options(
      {},
      (res) => {
        setOpData(res.data.data);
      },
      () => {
        console.log("请求失败");
      }
    );
  };
  const requestData = () => {
    const mainFormValues = form.getFieldsValue();
    const singleFactorValues = singleFactorForm.getFieldsValue();
    
    const params = {
      time_data: {
        start_Data: mainFormValues.时间?.[0] || "2025-08-25 00:00:00",
        end_Data: mainFormValues.时间?.[1] || "2025-09-09 24:00:00",
      },
      data_type: mainFormValues.晶体晶片 || '晶体',
      cut_position: mainFormValues.切割位置 || '',
      process_data: singleFactorValues.特征 || ['顶占比', '侧底比', '装料工艺', '顶盖型号'],
      feature_var: singleFactorValues.质量 || ['重量长速'],
      plt_type: singleFactorValues.图类型 || '箱线图'
    };

    setTbLoad(true);
    // read_lop(
    //   params,
    //   (res) => {
    //     setTbLoad(false);
    //     if (res.data && res.data.data) {
    //       setAnalysisData(res.data.data);
    //       // 设置基础统计表格
    //       if (res.data.data.ori_data) {
    //         setColumns(res.data.data.ori_data.columns || []);
    //         setTbData(res.data.data.ori_data.datas || []);
    //       }
    //     }
    //   },
    //   () => {
    //     setTbLoad(false);
    //     message.error('请求失败');
    //   }
    // );
  };
  // 渲染单因素分析图表
  const renderSingleFactorChart = () => {
    if (!analysisData.single_factor_analysis) return null;
    
    let chartData;
    let chartComponent;

    switch (chartType) {
      case '箱线图':
        chartData = analysisData.single_factor_analysis['箱线图'];
        chartComponent = <BoxPlot data={chartData} />;
        break;
      case '合格率图':
        chartData = analysisData.single_factor_analysis['柱状图'];
        chartComponent = <BarChart data={chartData} title="合格率图" />;
        break;
      case '类别占比图':
        chartData = analysisData.single_factor_analysis['堆叠图'];
        chartComponent = <StackedChart data={chartData} title="类别占比图" />;
        break;
      default:
        return null;
    }

    return chartData ? chartComponent : null;
  };

  useEffect(() => {
    initOpt();
  }, []);

  useEffect(() => {
    // 当图类型改变时，更新图表
    if (analysisData.single_factor_analysis) {
      // 触发重新渲染
    }
  }, [chartType]);

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, "相关性分析"]} />
      <div
        className="content_root"
        style={{
          display: "flex",
          rowGap: 20,
          flexDirection: "column",
        }}
      >
        {/* 主查询表单 */}
        <Form
          layout="inline"
          form={form}
          initialValues={{
            时间: [
              dayjs().subtract(1, "month").format(dateFormat),
              dayjs().format(dateFormat),
            ],
          }}
        >
          <Flex gap={16} wrap="wrap">
            <Form.Item
              label="起止日期时间"
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
            <Form.Item label="晶体/晶片" name="晶体晶片">
              <Select
                style={{ width: 120 }}
                placeholder="请选择"
                options={[
                  { label: "晶体", value: "晶体" },
                  { label: "晶片", value: "晶片" },
                ]}
              />
            </Form.Item>
            <Form.Item label="切割位置" name="切割位置">
              <Select
                style={{ width: 120 }}
                placeholder="请选择"
                options={selectList2Option(opData.切割位置 || [])}
              />
            </Form.Item>
            <Button type="primary" onClick={requestData}>
              查询
            </Button>
          </Flex>
        </Form>

        {/* 五个模块布局 */}
        <Row gutter={[16, 16]}>
          {/* 左侧两个模块 */}
          <Col span={12}>
            {/* 单因素分析模块 */}
            <Card 
              title="单因素分析" 
              size="small"
              style={{ marginBottom: 16, height: '500px' }}
            >
              <Form
                layout="inline"
                form={singleFactorForm}
                style={{ marginBottom: 16 }}
                initialValues={{
                  特征: ['顶占比', '侧底比', '装料工艺', '顶盖型号'],
                  质量: ['重量长速'],
                  图类型: '箱线图'
                }}
              >
                <Form.Item label="特征" name="特征">
                  <Select
                    mode="multiple"
                    style={{ width: 200 }}
                    maxTagCount={1}
                    placeholder="请选择特征"
                    options={[
                      { label: "顶占比", value: "顶占比" },
                      { label: "侧底比", value: "侧底比" },
                      { label: "装料工艺", value: "装料工艺" },
                      { label: "C原料工艺代码", value: "C原料工艺代码" },
                      { label: "埚位", value: "埚位" },
                      { label: "X原料型号", value: "X原料型号" },
                      { label: "限位环型号", value: "限位环型号" },
                      { label: "顶盖型号", value: "顶盖型号" },
                      { label: "N2流量始", value: "N2流量始" },
                      { label: "N2流量末", value: "N2流量末" },
                      { label: "顶保温方案", value: "顶保温方案" },
                      { label: "低压控温上限", value: "低压控温上限" },
                      { label: "低压控温下限", value: "低压控温下限" },
                      { label: "顶环型号", value: "顶环型号" },
                      { label: "高压控温", value: "高压控温" },
                      { label: "斜率", value: "斜率" },
                      { label: "目标温差", value: "目标温差" },
                      { label: "炉压", value: "炉压" },
                      { label: "降幅", value: "降幅" },
                      { label: "退火时长", value: "退火时长" },
                    ]}
                  />
                </Form.Item>
                <Form.Item label="结果" name="质量">
                  <Select
                    mode="multiple"
                    style={{ width: 200 }}
                    placeholder="请选择结果"
                     maxTagCount={1}
                    options={[
                      { label: "相变", value: "相变" },
                      { label: "多晶", value: "多晶" },
                      { label: "碳絮", value: "碳絮" },
                      { label: "重量长速", value: "重量长速" },
                      { label: "凸度", value: "凸度" },
                      { label: "高压2hAT", value: "高压2hAT" },
                      { label: "低压5hAT", value: "低压5hAT" },
                      { label: "边缘厚度", value: "边缘厚度" },
                      { label: "表面评级", value: "表面评级" },
                      { label: "TSD", value: "TSD" },
                      { label: "TED", value: "TED" },
                      { label: "BPD", value: "BPD" },
                      { label: "电阻率平均值", value: "电阻率平均值" },
                      { label: "电阻率均匀值", value: "电阻率均匀值" },
                      { label: "pl-sf数量", value: "pl-sf数量" },
                      { label: "pl-sf面积比", value: "pl-sf面积比" },
                      { label: "scn-sf数量", value: "scn-sf数量" },
                      { label: "包裹物数据量", value: "包裹物数据量" },
                      { label: "微管密度", value: "微管密度" },
                    ]}
                  />
                </Form.Item>
                <Form.Item label="图类型" name="图类型">
                  <Select
                    style={{ width: 120 }}
                    value={chartType}
                    onChange={setChartType}
                    options={[
                      { label: "箱线图", value: "箱线图" },
                      { label: "合格率图", value: "合格率图" },
                      { label: "类别占比图", value: "类别占比图" },
                    ]}
                  />
                </Form.Item>
              </Form>
              <div style={{ flex: 1 }}>
                {renderSingleFactorChart()}
              </div>
            </Card>

            {/* 基础统计模块 */}
            <Card 
              title="基础统计" 
              size="small"
              style={{ height: '600px' }}
            >
              <Table
                bordered
                size="small"
                columns={columns}
                dataSource={tb_data}
                pagination={false}
                scroll={{ x: 'max-content', y: 500 }}
              />
            </Card>
          </Col>

          {/* 右侧两个模块 */}
          <Col span={12}>
            {/* 重要性分析模块 */}
            <Card 
              title={`重要性分析${analysisData.importance_analysis?.r2_score ? `（R²= ${analysisData.importance_analysis.r2_score}）` : ''}`}
              size="small"
              style={{ marginBottom: 16, height: '500px' }}
             
            >
              {(() => {
               
                return analysisData.importance_analysis?.feature_importance ? (
                  <BarChart 
                    data={analysisData.importance_analysis.feature_importance} 
                    title=""
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    暂无数据
                  </div>
                );
              })()}
            </Card>

            {/* 合理工艺推荐模块 */}
            <Card 
              title="合理工艺推荐-晶体等级占比" 
              size="small"
              style={{ height: '600px' }}
            >
              <div style={{ height: '50%', marginBottom: 8 }}>
                {(() => {
               
                  return analysisData.recommend_process?.grade_distribution ? (
                    <StackedChart 
                    height={280}
                      data={analysisData.recommend_process.grade_distribution} 
                      title="工艺组合晶体等级占比"
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      暂无堆叠图数据
                    </div>
                  );
                })()}
              </div>
              <div style={{ height: '50%' }}>
                {(() => {
                  console.log('方差分析数据:', analysisData.recommend_process?.variance_analysis);
                  return analysisData.recommend_process?.variance_analysis ? (
                    <LineChart 
                      data={analysisData.recommend_process.variance_analysis} 
                      title="工艺组间方差趋势"
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      暂无折线图数据
                    </div>
                  );
                })()}
              </div>
            </Card>
          </Col>
        </Row>

        {/* 底部数据详情模块 */}
        <Card 
          title="数据详情" 
          size="small"
        >
          <Table
            bordered
            loading={tb_load}
            size="small"
            columns={analysisData.single_factor_analysis?.table?.columns || []}
            dataSource={analysisData.single_factor_analysis?.table?.datas || []}
            scroll={{ x: "max-content" }}
            pagination={{
              current: cur,
              pageSize: page_size,
              total: tb_total,
              showTotal: (total) => `共 ${total} 条`,
              showQuickJumper: true,
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                setCur(page);
                setPageSize(pageSize);
              },
            }}
          />
        </Card>
      </div>
    </div>
  );
}

export default LOP;
