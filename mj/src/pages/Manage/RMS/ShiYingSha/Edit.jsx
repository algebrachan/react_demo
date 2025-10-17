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
  Space,
  Spin
} from 'antd';
import { SaveOutlined, ArrowLeftOutlined, CalculatorOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { GeneralCard, MyBreadcrumb } from '../../../../components/CommonCard';
import {
  rms_options,
  read_all_recipes,
  update_quartz_sand_recipe,
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

function normalizeParamsToLayerObj(paramsArr = []) {
  const obj = {};
  (paramsArr || []).forEach(({ ParamName, ParamValue }) => {
    const found = layerParamDefs.find((d) => d.label === ParamName);
    if (found) obj[found.key] = ParamValue;
  });
  return obj;
}

const QuartzSandFormulaEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [formBottom] = Form.useForm();

  const [options, setOptions] = useState({
    figureCodeOption: [],
    materialFormulaOptions: [],
    transparentSandOptions: []
  });
  const [filteredInchOptions, setFilteredInchOptions] = useState([]);
  const [filteredLineOptions, setFilteredLineOptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);

  const [record, setRecord] = useState(null);
  const [matrix, setMatrix] = useState(buildEmptyMatrix());
  const [layerParams, setLayerParams] = useState({});

  // 初始化：下拉 + 详情
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const [optRes, listRes] = await Promise.all([
          rms_options(),
          read_all_recipes({
            RecipeCategory: '石英砂配方',
            CreaUser: '',
            CreateTime: [],
            FigureCode: '',
            Line: '',
            RecipeName: '',
            UpdateTime: [],
            UpdateUser: '',
            page: 1,
            limit: 1000
          })
        ]);

        const opt = optRes?.data || optRes || {};
        setOptions({
          figureCodeOption: opt.figureCodeOption || [],
          materialFormulaOptions: opt.materialFormulaOptions || [],
          transparentSandOptions: opt.transparentSandOptions || opt.sandOptions || []
        });

        const list = listRes?.data || listRes || [];
        const one = (list || []).find((it) => String(it.RecipeId ?? it.id) === String(id));
        if (!one) {
          message.error('未找到对应配方');
          navigate('/mng/rms/crucible/quartz_sand_recipe_management');
          return;
        }

        const rec = {
          ...one,
          RecipeId: one.RecipeId ?? one.id,
          recipeNumber: one.RecipeName ?? '',
          FigureCode: one.FigureCode ?? '',
          Version: one.Version ?? '',
          Inch: one.Inch ?? '',
          Line: one.Line ?? '',
          sandLayerCode: one.sandLayerCode ?? '',
          Status: (one.Status === 0 || one.status === 0) ? '启用' : '停用'
        };
        setRecord(rec);

        // 联动选项
        const fig = (opt.figureCodeOption || []).find(i => i.value === rec.FigureCode);
        const inch = fig?.inch;
        const lineValue = fig?.line_value;
        const lineLabel = fig?.line_label;
        setFilteredInchOptions(inch ? [{ value: inch, label: inch }] : []);
        setFilteredLineOptions(lineValue && lineLabel ? [{ value: lineValue, label: lineLabel }] : []);

        // 表单初值
        form.setFieldsValue({
          RecipeName: rec.recipeNumber,
          FigureCode: rec.FigureCode,
          Version: rec.Version,
          sandLayerCode:rec.sandLayerCode,
          Inch: inch ?? rec.Inch,
          Line: lineValue ?? rec.Line,
          Status: rec.Status
        });

        // matrix
        setMatrix(one.matrix || buildEmptyMatrix());

        // params -> layerParams
        setLayerParams(normalizeParamsToLayerObj(one.params || []));
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, navigate, form]);

  const onFigureChange = (val) => {
    const item = (options.figureCodeOption || []).find((i) => i.value === val);
    const inch = item?.inch;
    const lineValue = item?.line_value;
    const lineLabel = item?.line_label;
    setFilteredInchOptions(inch ? [{ value: inch, label: inch }] : []);
    setFilteredLineOptions(lineValue && lineLabel ? [{ value: lineValue, label: lineLabel }] : []);
    form.setFieldsValue({ Inch: inch, Line: lineValue });
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
            placeholder="点击“计算参数”后自动填充"
            size="small"
          />
        )
      }
    ];
    const data = layerParamDefs.map((d) => ({ ...d, value: layerParams[d.key] || '' }));
    return (
      <Table columns={columns} dataSource={data} pagination={false} size="small" bordered />
    );
  };

  const handleBack = () => {
    navigate('/mng/rms/crucible/quartz_sand_recipe_management');
  };

  const handleCalculate = async () => {
    try {
      const materialFormula = formBottom.getFieldValue('material_formula');
      if (!materialFormula) {
        message.warning('请先选择用料配方');
        return;
      }
      setCalcLoading(true);
      const payload = { material_formula: materialFormula, matrix };
      const res = await calculate_quartz_sand_params(payload);
      const ret = res?.data || res || {};
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
        RecipeId: (record && (record.RecipeId || record.id)) || '',
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
        Status: values.Status === '启用' ? 0 : 1,
        Inch: values.Inch,
        Line: values.Line,
        sandLayerCode:values.sandLayerCode,
        params: toParamsArrayFromLayer(layerParams),
        matrix
      };
      setSaving(true);
      await update_quartz_sand_recipe(payload);
      message.success('更新成功');
      handleBack();
    } catch (e) {
      // 全局拦截已提示
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <MyBreadcrumb items={[window.sys_name, 'RMS', '石英砂配方管理', '编辑配方']} />
      <div style={{ marginTop: 16 }}>
        <GeneralCard name="编辑石英砂配方">
          <div style={{ padding: 16 }}>
            <Space style={{ marginBottom: 16 }}>
              <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>返回</Button>
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving}>保存</Button>
            </Space>

            <Form form={form} layout="vertical">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Form.Item name="RecipeName" label="石英砂配方编号" >
                    <Input disabled placeholder="编号" />
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
                  <Form.Item name="Status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
                    <Select>
                      <Option value="启用">启用</Option>
                      <Option value="停用">停用</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    name="sandLayerCode"
                    label="透明层砂Code"
                    rules={[{ required: true, message: "请选择透明层砂Code" }]}
                  >
                    <Select
                      placeholder="请选择透明层砂Code"
                      options={(options.transparentSandOptions || []).map(
                        (o) => ({
                          value: o.value ?? o,
                          label: o.label ?? String(o),
                        })
                      )}
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

export default QuartzSandFormulaEdit;