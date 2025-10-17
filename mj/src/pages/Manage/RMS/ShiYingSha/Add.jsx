import React, { useEffect, useMemo, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Divider,
  message,
  Table,
  Space
} from 'antd';
import { SaveOutlined, ArrowLeftOutlined, CalculatorOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { GeneralCard, MyBreadcrumb } from '../../../../components/CommonCard';
import {
  rms_options,
  create_quartz_sand_recipe,
  calculate_quartz_sand_params
} from '../../../../apis/mjRms.js';

const { Option } = Select;

const sandTypes = [
  'ZS砂',
  '外层',
  '中外层',
  '中内层',
  '内层粗粉',
  '内层细粉(W成型机)',
  '内层细粉(B扬砂)',
  '半自动砂'
];

// 成型机参数字段-中文名（保存时用这些中文做 ParamName）
const layerParamDefs = [
  { key: 'layer1_straight', label: '第1层直臂' },
  { key: 'layer2_straight', label: '第2层直臂' },
  { key: 'layer2_r_section', label: '第2层R角段' },
  { key: 'layer3_straight', label: '第3层直臂' },
  { key: 'layer3_r_section', label: '第3层R角段' },
  { key: 'layer4_straight', label: '第4层直臂' },
  { key: 'layer4_r_section', label: '第4层R角段' },
  { key: 'layer5_straight', label: '第5层直臂' },
  { key: 'layer5_r_section', label: '第5层R角段' },
  { key: 'layer6_straight', label: '第6层直臂' },
  { key: 'layer6_r_section', label: '第6层R角段' },
  { key: 'layer7_straight', label: '第7层直臂' },
  { key: 'layer7_r_section', label: '第7层R角段' },
  { key: 'final_supplement', label: '最终补料' }
];

function buildEmptyMatrix() {
  const obj = {};
  sandTypes.forEach((s) => {
    obj[s] = {
      '位置': '',
      '料仓': '',
      '物料编码': '',
      '图号': '',
      '物料名称': '',
      '耗用量': '',
      '单位': 'kg'
    };
  });
  return obj;
}

function toParamsArrayFromLayer(layerObj = {}) {
  return layerParamDefs.map((d) => ({
    ParamName: d.label,
    ParamValue: layerObj[d.key] ?? ''
  }));
}

const QuartzSandFormulaAdd = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formBottom] = Form.useForm();
  const [options, setOptions] = useState({
    figureCodeOption: [],
    materialFormulaOptions: [],
    transparentSandOptions: []
  });
  const [filteredInchOptions, setFilteredInchOptions] = useState([]);
  const [filteredLineOptions, setFilteredLineOptions] = useState([]);

  const [matrix, setMatrix] = useState(buildEmptyMatrix());
  const [layerParams, setLayerParams] = useState({});
  const [saving, setSaving] = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);

  // 初始化下拉
  useEffect(() => {
    const init = async () => {
      try {
        const res = await rms_options();
        const data = res?.data || res || {};
        setOptions({
          figureCodeOption: data.figureCodeOption || [],
          materialFormulaOptions: data.materialFormulaOptions || [],
          transparentSandOptions: data.transparentSandOptions || data.sandOptions || []
        });
      } catch (e) {
        // 全局拦截提示
      }
    };
    init();
  }, []);

  // 图号联动：设定 inches / line
  const onFigureChange = (val) => {
    const item = (options.figureCodeOption || []).find((i) => i.value === val);
    const inch = item?.inch;
    const lineValue = item?.line_value;
    const lineLabel = item?.line_label;
    setFilteredInchOptions(inch ? [{ value: inch, label: inch }] : []);
    setFilteredLineOptions(lineValue && lineLabel ? [{ value: lineValue, label: lineLabel }] : []);
    form.setFieldsValue({
      Inch: inch,
      Line: lineValue
    });
  };

  const parameterColumns = useMemo(
    () => [
      { title: '砂类型', dataIndex: 'type', key: 'type', width: 160, fixed: 'left' },
      {
        title: '位置',
        dataIndex: '位置',
        key: '位置',
        width: 100,
        render: (text, record) => (
          <Input
            value={matrix[record.type]['位置']}
            onChange={(e) => setMatrix((prev) => ({ ...prev, [record.type]: { ...prev[record.type], '位置': e.target.value } }))}
            size="small"
            placeholder="位置"
          />
        )
      },
      {
        title: '料仓',
        dataIndex: '料仓',
        key: '料仓',
        width: 100,
        render: (text, record) => (
          <Input
            value={matrix[record.type]['料仓']}
            onChange={(e) => setMatrix((prev) => ({ ...prev, [record.type]: { ...prev[record.type], '料仓': e.target.value } }))}
            size="small"
            placeholder="料仓"
          />
        )
      },
      {
        title: '物料编码',
        dataIndex: '物料编码',
        key: '物料编码',
        width: 140,
        render: (text, record) => (
          <Input
            value={matrix[record.type]['物料编码']}
            onChange={(e) => setMatrix((prev) => ({ ...prev, [record.type]: { ...prev[record.type], '物料编码': e.target.value } }))}
            size="small"
            placeholder="物料编码"
          />
        )
      },
      {
        title: '图号',
        dataIndex: '图号',
        key: '图号',
        width: 120,
        render: (text, record) => (
          <Input
            value={matrix[record.type]['图号']}
            onChange={(e) => setMatrix((prev) => ({ ...prev, [record.type]: { ...prev[record.type], '图号': e.target.value } }))}
            size="small"
            placeholder="图号"
          />
        )
      },
      {
        title: '物料名称',
        dataIndex: '物料名称',
        key: '物料名称',
        width: 160,
        render: (text, record) => (
          <Input
            value={matrix[record.type]['物料名称']}
            onChange={(e) => setMatrix((prev) => ({ ...prev, [record.type]: { ...prev[record.type], '物料名称': e.target.value } }))}
            size="small"
            placeholder="物料名称"
          />
        )
      },
      {
        title: '耗用量',
        dataIndex: '耗用量',
        key: '耗用量',
        width: 100,
        render: (text, record) => (
          <Input
            type="number"
            value={matrix[record.type]['耗用量']}
            onChange={(e) => setMatrix((prev) => ({ ...prev, [record.type]: { ...prev[record.type], '耗用量': e.target.value } }))}
            size="small"
            placeholder="耗用量"
            min={0}
          />
        )
      },
      {
        title: '单位',
        dataIndex: '单位',
        key: '单位',
        width: 100,
        render: (text, record) => (
          <Select
            value={matrix[record.type]['单位']}
            onChange={(v) => setMatrix((prev) => ({ ...prev, [record.type]: { ...prev[record.type], '单位': v } }))}
            size="small"
            style={{ width: '100%' }}
          >
            <Option value="kg">kg</Option>
            <Option value="g">g</Option>
            <Option value="t">t</Option>
          </Select>
        )
      }
    ],
    [matrix]
  );

  const renderParameterTable = () => {
    const data = sandTypes.map((t) => ({ key: t, type: t, ...matrix[t] }));
    return (
      <Table
        columns={parameterColumns}
        dataSource={data}
        pagination={false}
        size="small"
        scroll={{ x: 1000 }}
        bordered
      />
    );
  };

  const renderLayerTable = () => {
    const columns = [
      { title: '参数名称', dataIndex: 'label', key: 'label', width: 180 },
      {
        title: '参数值',
        dataIndex: 'value',
        key: 'value',
        render: (text, record) => (
          <Input
            value={layerParams[record.key] || ''}
            disabled
            placeholder={`点击“计算参数”后自动填充`}
            size="small"
          />
        )
      }
    ];
    const data = layerParamDefs.map((d) => ({ ...d, value: layerParams[d.key] || '' }));
    return (
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
        bordered
      />
    );
  };

  const handleBack = () => {
    navigate('/mng/rms/crucible/quartz_sand_recipe_management');
  };

  const handleCalculate = async () => {
    try {
      const materialFormula = formBottom.getFieldValue('material_formula');
     
      setCalcLoading(true);
      const payload = {
        material_formula: materialFormula,
        matrix
      };
      const res = await calculate_quartz_sand_params(payload);
      const ret = res?.data || res || {};
      // 兼容两种返回：数组 [{ParamName, ParamValue}] 或 对象 { key: value }
      let next = {};
      if (Array.isArray(ret)) {
        ret.forEach(({ ParamName, ParamValue }) => {
          const found = layerParamDefs.find((d) => d.label === ParamName);
          if (found) next[found.key] = ParamValue;
        });
      } else if (Array.isArray(ret.params)) {
        ret.params.forEach(({ ParamName, ParamValue }) => {
          const found = layerParamDefs.find((d) => d.label === ParamName);
          if (found) next[found.key] = ParamValue;
        });
      } else {
        // 对象：尝试按中文名或同 key
        layerParamDefs.forEach((d) => {
          next[d.key] = ret[d.label] ?? ret[d.key] ?? '';
        });
      }
      setLayerParams(next);
      message.success('计算完成');
    } catch (e) {
      // 全局拦截已提示
    } finally {
      setCalcLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        RecipeName: values.RecipeName,
        RecipeGroupId: values.RecipeGroupId || 'test',
        TemplateId: values.TemplateId ?? 1,
        CreaUser: values.CreaUser || 'test',
        UpdateUser: values.UpdateUser || 'test',
        IsEnable: values.IsEnable ?? true,
        Description: values.Description || 'test',
        Remark: values.Remark || 'test',
        Commnet: values.Commnet || 'test',
        FigureCode: values.FigureCode,
        Version: values.Version,
        RecipeCategory: '石英砂配方',
        Status: values.Status === '启用' ? 0 : 0, // 新增默认启用，可按需调整
        Inch: values.Inch,
        Line: values.Line,
        sandLayerCode:values.sandLayerCode,
        params: toParamsArrayFromLayer(layerParams),
        matrix
      };
      setSaving(true);
      await create_quartz_sand_recipe(payload);
      message.success('新增成功');
      handleBack();
    } catch (e) {
      // 全局拦截已提示
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, 'RMS', '石英砂配方管理', '新增配方']} />
      <div style={{ marginTop: 16 }}>
        <GeneralCard name="新增石英砂配方">
          <div style={{ padding: 16 }}>
            <Space style={{ marginBottom: 16 }}>
              <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>返回</Button>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving}>保存</Button>
            </Space>

            <Form form={form} layout="vertical">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Form.Item name="RecipeName" label="石英砂配方编号" >
                    <Input placeholder="自动生成/或后端生成" disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="FigureCode" label="图号" rules={[{ required: true, message: '请选择图号' }]}>
                    <Select
                      placeholder="请选择图号"
                      showSearch
                      optionFilterProp="label"
                      onChange={onFigureChange}
                      options={(options.figureCodeOption || []).map(i => ({ value: i.value, label: i.label }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="Version" label="版本" >
                    <Input placeholder="请输入版本" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item name="Inch" label="英寸" rules={[{ required: true, message: '请选择英寸' }]}>
                    <Select placeholder="自动填充" options={filteredInchOptions} disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="Line" label="线体" rules={[{ required: true, message: '请选择线体' }]}>
                    <Select placeholder="自动填充" options={filteredLineOptions} disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="Status" label="状态" initialValue="启用" rules={[{ required: true, message: '请选择状态' }]}>
                    <Select>
                      <Option value="启用">启用</Option>
                      <Option value="停用">停用</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item name="sandLayerCode" label="透明层砂Code" rules={[{ required: true, message: '请选择透明层砂Code' }]}>
                    <Select placeholder="请选择透明层砂Code"
                      options={(options.transparentSandOptions || []).map(o => ({ value: o.value ?? o, label: o.label ?? String(o) }))}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <Divider>石英砂参数配置（matrix）</Divider>
            {renderParameterTable()}

            <Divider>成型机参数配置（点击计算自动生成）</Divider>
            <Form form={formBottom} layout="inline" style={{ marginBottom: 12 }}>
              <Form.Item label="用料配方" name="material_formula" rules={[{ required: true, message: '请选择用料配方' }]}>
                <Select
                  placeholder="请选择用料配方"
                  style={{ width: 320 }}
                  options={(options.materialFormulaOptions || []).map(o => ({ value: o.value ?? o, label: o.label ?? String(o) }))}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" icon={<CalculatorOutlined />} onClick={handleCalculate} loading={calcLoading}>
                  计算参数
                </Button>
              </Form.Item>
            </Form>
            {renderLayerTable()}
          </div>
        </GeneralCard>
      </div>
    </div>
  );
};

export default QuartzSandFormulaAdd;