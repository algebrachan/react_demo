import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, Row, Col } from 'antd';

// 部门统计柱状图组件
const DepartmentChart = ({ data, title }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || !chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    
    const option = {
      title: {
        text: title,
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.xdata || [],
        axisLabel: {
          rotate: 45,
          interval: 0
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: '数量',
        type: 'bar',
        data: data.ydata || [],
        barWidth: 20,
        itemStyle: {
          color: '#5470c6'
        },
        label: {
          show: true,
          position: 'top'
        }
      }]
    };

    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [data, title]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

// 堆叠柱状图组件
const StackedBarChart = ({ data, title }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || !chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    
    // 处理堆叠数据
    const processStackedData = () => {
      const categories = data.xdata || [];
      const ydata = data.ydata || [];
      
      // 收集所有可能的系列名称
      const seriesNames = new Set();
      ydata.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(key => seriesNames.add(key));
        }
      });
      
      const seriesNamesArray = Array.from(seriesNames);
      
      // 构建系列数据
      const series = seriesNamesArray.map((seriesName, index) => ({
        name: seriesName,
        type: 'bar',
        stack: 'total', barWidth: 20,
        data: categories.map((category, categoryIndex) => {
          const categoryData = ydata[categoryIndex];
          return (categoryData && typeof categoryData === 'object') 
            ? (categoryData[seriesName] || 0) 
            : 0;
        }),
        itemStyle: {
          color: [
            '#5470c6', '#91cc75', '#fac858', '#ee6666', 
            '#73c0de', '#3ba272', '#fc8452', '#9a60b4'
          ][index % 8]
        }
      }));
      
      return { categories, series, seriesNames: seriesNamesArray };
    };

    const { categories, series, seriesNames } = processStackedData();

    const option = {
      title: {
        text: title,
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: seriesNames,
        top: '10%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: {
          rotate: 45,
          interval: 0
        }
      },
      yAxis: {
        type: 'value'
      },
      series: series
    };

    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [data, title]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

// 主图表容器组件
const StatisticalCharts = ({ chartData }) => {
  if (!chartData) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>暂无数据</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[24, 24]}>
        {/* 第一行：部门统计 */}
        <Col span={12}>
          <Card   
            style={{ 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px'
            }}
          >
            <DepartmentChart 
              data={chartData.department_count} 
              title="子部门与不符合项数量关系分布"
            />
          </Card>
        </Col>
        
        {/* 第二行：两个堆叠图 */}
        <Col span={12}>
          <Card 
           
            style={{ 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px'
            }}
          >
            <StackedBarChart 
              data={chartData.department_area_count} 
              title="子部门不符合项与审核区域/工序分布"
            />
          </Card>
        </Col>
        
        <Col span={12}>
          <Card 
            
            style={{ 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px'
            }}
          >
            <StackedBarChart 
              data={chartData.department_type_count} 
              title="子部门不符合项与类型分布"
            />
          </Card>
        </Col>
        
        {/* 第三行：区域类型统计 */}
        <Col span={12}>
          <Card 
          
            style={{ 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px'
            }}
          >
            <StackedBarChart 
              data={chartData.area_type_count} 
              title="审核区域/工序与不符合项类型分布"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticalCharts;