import React, {useImperativeHandle, forwardRef} from 'react';
import {Form, Row, Col} from 'antd';
import styles from './style/CustomForm.module.less';

const CustomForm = forwardRef((props, ref) => {
  const {
    formItems,
    initialValues = {},
    className = '',
    onValuesChange,
    form,
    ...restProps
  } = props;
  const [insideFormInstance] = Form.useForm();
  const realFormInstance = form || insideFormInstance;
  // 暴露表单实例方法给父组件
  useImperativeHandle(ref, () => ({
    validateFields: (...args) => realFormInstance.validateFields(...args),
    getFieldsValue: (...args) => realFormInstance.getFieldsValue(...args),
    setFieldsValue: (...args) => realFormInstance.setFieldsValue(...args),
    resetFields: (...args) => realFormInstance.resetFields(...args),
  }));
  // 处理表单值变化
  const handleValuesChange = (changedValues, allValues) => {
    onValuesChange && onValuesChange(changedValues, allValues);
  };
  // 渲染表单项
  const renderFormItems = () => {
    let myFormItems;
    if (typeof formItems === 'function') myFormItems = formItems();
    else myFormItems = formItems;
    return myFormItems.map((row, rowIndex) => {
      let colTotal = 0
      const rowItem = row && (
        <Row key={`row-${rowIndex}`} gutter={0}>
          {row.map((item, colIndex) => {
            const {
              label,
              prop,
              span = 6,
              formItem,
              required = false,
              rules = [],
              ...itemProps
            } = item;
            colTotal += span
            // 如果有required属性但没有设置rules，则添加必填规则
            const fieldRules = [...rules];
            if (required && !rules.some(rule => rule.required)) {
              fieldRules.push({
                required: true,
                message: `请输入${label}`,
              });
            }
            return (
              <Col span={span} key={`col-${rowIndex}-${colIndex}`} className={colTotal === 24 ? `ant-col--last` : null}>
                <Form.Item
                  label={label}
                  name={prop}
                  rules={fieldRules}
                  {...itemProps}
                >
                  {formItem}
                </Form.Item>
              </Col>
            );
          })}
        </Row>
      )
      return rowItem
    });
  };
  return (
    <Form
      layout="inline"
      form={realFormInstance}
      className={`${styles['custom-form']} ${className}`}
      initialValues={initialValues}
      onValuesChange={handleValuesChange}
      {...restProps}
    >
      {renderFormItems()}
    </Form>
  );
});
export default CustomForm;
