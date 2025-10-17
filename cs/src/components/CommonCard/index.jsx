import React from "react";
import { Breadcrumb, Divider } from "antd";
import "./cc.less";

export const CommonCard = ({ name = "", children }) => {
  return (
    <div className="common_card_root">
      <div className="header">
        <div className="title">
          <div className="mark"></div>
          <div className="label">{name}</div>
        </div>
      </div>
      {/* <Divider style={{ marginTop: 0, marginBottom: 1 }} /> */}
      <div className="body">{children}</div>
    </div>
  );
};

export const GeneralCard = ({ name = "", children }) => {
  return (
    <div className="general_card_root">
      <div className="header">
        <div className="title">
          <div className="mark"></div>
          <div className="label">{name}</div>
        </div>
      </div>
      <Divider style={{ marginTop: 0, marginBottom: 1 }} />
      <div className="body">{children}</div>
    </div>
  );
};

export const MyBreadcrumb = ({ items = [] }) => {
  return (
    <div className="my_breadcrumb">
      <Breadcrumb items={items.map((e) => ({ title: e }))} />
    </div>
  );
};

export const DescriptionText = ({ label = "", value = "" }) => {
  return (
    <div className="my_des_text">
      <div className="label">{label}:</div>
      <div className="value">{value}</div>
    </div>
  );
};
export const DescriptionBox = ({ label = "", value = "" }) => {
  return (
    <div className="my_des_box">
      <div className="label">{label}:</div>
      <div className="value">{value}</div>
    </div>
  );
};
