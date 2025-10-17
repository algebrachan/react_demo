import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const LineChart = ({ data, title = '折线图' }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    console.log('LineChart接收到的数据:', data);
    if (!data || !data.x_axis || !data.ydata) {
      console.log('LineChart数据验证失败:', { data, x_axis: data?.x_axis, ydata: data?.ydata });
      return;
    }

    // 初始化图表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const option = {
      title: {
        text: title,
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.x_axis.values || [],
        axisLabel: {
          formatter: '工艺组{value}'
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        type: 'line',
        data: data.ydata.values || [],
        smooth: true,
        itemStyle: {
          color: '#1890ff'
        },
        lineStyle: {
          color: '#1890ff'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(24, 144, 255, 0.3)'
            },
            {
              offset: 1,
              color: 'rgba(24, 144, 255, 0.1)'
            }
          ])
        }
      }]
    };

    chartInstance.current.setOption(option);

    // 监听窗口大小变化
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, title]);

  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '250px' }} />;
};

export default LineChart;