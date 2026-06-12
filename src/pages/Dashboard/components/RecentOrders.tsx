import { Table } from 'antd';
import type { TableProps } from "antd"

import styles from "../index.module.scss"

interface DataType {
  key: string,
  number: string,
  goodsName: string,
  date: string,
  price: number,
  status: number
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: "订单编号",
    dataIndex: "number",
    key: "number"
  },
  {
    title: "商品名称",
    dataIndex: "goodsName",
    key: "goodsName"
  },
  {
    title: "订单日期",
    dataIndex: "date",
    key: "date"
  },
  {
    title: "价格",
    dataIndex: "price",
    key: "price"
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status"
  }
]

const data: DataType[] = [
  {
    key: "1",
    number: "#0RD-89231",
    goodsName: "华为手机pro",
    date: "2026-05-06",
    price: 5800,
    status: 1
  },
  {
    key: "2",
    number: "#0RD-89231",
    goodsName: "华为手机p90",
    date: "2026-05-06",
    price: 4900,
    status: 0
  }
]

const RecentOrders = () => {
  return (
    <div className={styles["order"]}>
      <div className={styles["card-title"]}>最近订单</div>
      <Table<DataType> columns={columns} dataSource={data} className={styles["table"]} />
    </div>
  )
}

export default RecentOrders