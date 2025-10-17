import React from "react";
import PropTypes from "prop-types";
import { Breadcrumb, Divider } from "antd";
import "./cc.less";

// 公共头部组件
const CardHeader = ({ name }) => (
  <div className="header">
    <div className="title">
      <div className="mark" />
      <div className="label">{name}</div>
    </div>
  </div>
);

CardHeader.propTypes = {
  name: PropTypes.string
};

export const CommonCard = ({ name = "", children }) => (
  <div className="common_card_root">
    <CardHeader name={name} />
    <div className="body">{children}</div>
  </div>
);

CommonCard.propTypes = {
  name: PropTypes.string,
  children: PropTypes.node
};

export const GeneralCard = ({ name = "", children }) => (
  <div className="general_card_root">
    <CardHeader name={name} />
    <Divider style={{ marginTop: 0, marginBottom: 1 }} />
    <div className="body">{children}</div>
  </div>
);

GeneralCard.propTypes = {
  name: PropTypes.string,
  children: PropTypes.node
};

export const MyBreadcrumb = ({ items = [] }) => (
  <div className="my_breadcrumb">
    <Breadcrumb items={items.map((e) => ({ title: e }))} />
  </div>
);

MyBreadcrumb.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string)
};

// 公共描述组件基础
const BaseDescription = ({ label, value, className }) => (
  <div className={className}>
    <div className="label">{label}:</div>
    <div className="value">{value}</div>
  </div>
);

BaseDescription.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string
};

export const DescriptionText = (props) => (
  <BaseDescription {...props} className="my_des_text" />
);

export const DescriptionBox = (props) => (
  <BaseDescription {...props} className="my_des_box" />
);

DescriptionText.propTypes = DescriptionBox.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string
};
