import React from 'react';
import styles from './style/Title.module.less';

const Title = (props) => {
  const {
    title = "暂无数据",
    margin = `16 0 0 0`,
    children,
    className = "",
    right,
    border = true,
    style,
    titleStyle = {},
    contentStyle = {},
  } = props;
  return (
    <div
      className={`${className} ${styles['title_box']} ${border ? '' : styles[`title_box--no-border`]}`}
      style={{margin: margin, width: '100%', ...style}}
    >
      <div className={styles['title']} style={titleStyle}>
        <div className={styles['title_name']}>{title}</div>
        {right}
      </div>
      <div className={styles['content']} style={contentStyle}>
        {children}
      </div>
    </div>
  );
};
export default Title;
