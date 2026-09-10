import { useEffect, useRef, useState } from "react";

import * as echarts from "echarts";
import cn from "classnames";

import styles from "../index.module.scss";
import { statsApi } from "@/api/statsApi";

// 销售日期范围
const tabs = [
  {
    name: "周",
    value: 7,
  },
  {
    name: "月",
    value: 30,
  },
];

const SalesCharts = () => {
  const [days, setDays] = useState(7);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // tabs 切换
  const tabsChange = (value: number) => {
    setDays(value);
    getSalesTrend(value)
  };

  // 创建 Echart
  const initChart = () => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.dispose();
      chartInstance.current = null;
    }

    chartInstance.current = echarts.init(chartRef.current);
    const option = {
      grid: {
        top: "15%",
        left: "0%",
        right: "0%",
        bottom: "0%",
      },
      xAxis: {
        type: "category",
        data: [],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [],
          type: "bar",
        },
      ],
    };
    chartInstance.current.setOption(option);
    window.requestAnimationFrame(() => {
      chartInstance.current?.resize();
    });
  };

  // 获取销售图表数据
  const getSalesTrend = async (value: number) => {
    const { data: res } = await statsApi.salesTrend(value);
    const list = res.data.list || [];
    const xAxisData = list.map((item: any) => item.date);
    const seriesData = list.map((item: any) => item.sales);
    chartInstance.current?.setOption({
      xAxis: { data: xAxisData },
      series: [{ data: seriesData, type: "bar" }],
    });
  };

  useEffect(() => {
    getSalesTrend(days);
    initChart();

    // Echart 响应式
    const handleResize = () => {
      if (chartInstance.current) chartInstance.current.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      // 卸载清理 Echart
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  return (
    <div className={styles["sales"]}>
      {/* 顶部 */}
      <div className={styles["sales-top"]}>
        <div>
          <div className={styles["card-title"]}>销售图表</div>
          <div className={styles["sales-label"]}>
            过去 {days} 天的每日销售额变动
          </div>
        </div>
        <div className={styles["tabs"]}>
          {tabs.map((item) => (
            <div
              className={cn(styles.tab, {
                [styles.active]: days === item.value,
              })}
              key={item.value}
              onClick={() => tabsChange(item.value)}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
      {/* Chart 图表 */}
      <div ref={chartRef} className={styles["chart"]}></div>
    </div>
  );
};

export default SalesCharts;
