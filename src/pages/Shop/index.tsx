import { Button, Table, type TableProps } from "antd";
import { PlusOutlined, RiseOutlined } from "@ant-design/icons";

import styles from "./index.module.scss";
import PageHeader from "@/components/PageHeader";
import { type FilterItem, type FormValues } from "@/components/TableFiltering/filterTypes";
import TableFiltering from '@/components/TableFiltering'

interface DataType {
  key: string;
  goodsName: string;
  className: string;
  price: number;
  stock: number;
  sales: number;
  status: 1 | 2;
}

// 表格项
const columns: TableProps<DataType>["columns"] = [
  {
    title: "商品信息",
    dataIndex: "goodsName",
    key: "goodsName",
  },
  {
    title: "分类",
    dataIndex: "className",
    key: "className",
  },
  {
    title: "价格",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "库存",
    dataIndex: "stock",
    key: "stock",
  },
  {
    title: "销量",
    dataIndex: "sales",
    key: "sales",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status"
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render: () => (
      <a>编辑</a>
    )
  }
];

// 数据
const data: DataType[] = [
  {
    key: '1',
    goodsName: 'xiaomi 17 pro max',
    className: '数码办公',
    price: 7999,
    stock: 100,
    sales: 50,
    status: 1
  }
]

// 筛选配置
const filterList: FilterItem[] = [
  {
    label: "商品名称",
    name: "goodsName",
    placeholder: "请输入商品名称",
    type: "input",
  },
  {
    label: "商品类别",
    name: "classId",
    placeholder: "请选择类别",
    type: "select",
    options: [
      { label: "全部类别", value: 99 },
      { label: "数码办公", value: 1 },
      { label: "服饰箱包", value: 2 },
    ],
    defaultValue: 99
  },
  {
    label: "状态",
    name: "status",
    placeholder: "请选择状态",
    type: "select",
    options: [
      { label: "全部状态", value: 99 },
      { label: "在售", value: 1 },
      { label: "下架", value: 2 },
    ],
    defaultValue: 99
  }
]

const dataList = [
  {
    icon: "/src/assets/images/shop-data1.png",
    title: "总商品",
    value: "2614",
    symbol: "件",
  },
  {
    icon: "/src/assets/images/shop-data1.png",
    title: "今日销量",
    value: "1482",
    symbol: "件",
  },
  {
    icon: "/src/assets/images/shop-data2.png",
    title: "缺货警报",
    value: "12",
    symbol: "款",
  }
];

const Shop = () => {
  const onSearch = (values: FormValues) => {
    console.log(values)
  }

  return (
    <div className={styles["column-gap"]}>
      {/* 顶部标题栏 */}
      <PageHeader title="商品管理" des="管理您的产品库存、定价及销售表现。">
        <Button type="primary" size="large" icon={<PlusOutlined />}>
          新增商品
        </Button>
      </PageHeader>

      {/* 数据汇总 */}
      <div className={styles["data"]}>
        <div className={styles["data-total"]}>
          <div>总销售额</div>
          <div className={styles["total-amount"]}>￥25,000</div>
          <div className={styles["total-change"]}>
            <RiseOutlined />
            12%
          </div>
        </div>
        <div className={styles["data-list"]}>
          {dataList.map((item, index) => (
            <div className={styles["data-item"]} key={index}>
              <img src={item.icon} alt={item.title} className={styles["item-icon"]} />
              <div className={styles["item-label"]}>{item.title}</div>
              <div className={styles["item-value"]}>
                {item.value}
                <span>{item.symbol}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TableFiltering filterList={filterList} onSubmit={onSearch} />

      <div className={styles["table-card"]}>
        <Table<DataType> columns={columns} dataSource={data} />
      </div>
    </div>
  );
};

export default Shop;
