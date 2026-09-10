import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Popconfirm,
  Flex,
  App,
  Tag,
  Image,
  type TableProps,
} from "antd";
import { PlusOutlined, RiseOutlined, DeleteOutlined } from "@ant-design/icons";

import styles from "./index.module.scss";
import { goodsApi } from "@/api/goodsApi";
import { categoriesApi } from "@/api/categoriesApi";
import type {
  GoodsItem,
  Pagination,
  GoodsListParams,
  CategoriesItem,
} from "@/api/types";
import PageHeader from "@/components/PageHeader";
import {
  type FilterItem,
  type FormValues,
} from "@/components/TableFiltering/filterTypes";
import TableFiltering from "@/components/TableFiltering";
import TableCard from "@/components/TableCard";
import useTablePagination from "@/components/TableCard/useTablePagination";
import useTableSelection from "@/components/TableCard/useTableSelection";

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
  },
];

const Products = () => {
  // 配置项
  const columns: TableProps<GoodsItem>["columns"] = [
    {
      title: "封面图",
      dataIndex: "cover",
      key: "cover",
      render: (_, { cover }) => <Image src={cover} width={60} />,
    },
    {
      title: "商品名称",
      dataIndex: "name",
      key: "name",
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
      title: "分类",
      dataIndex: "category",
      key: "category",
      render: (_, { category }) => category.name,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (_, { isOnSale }) => (
        <Tag color={isOnSale ? "green" : "red"}>
          {isOnSale ? "在售" : "下架"}
        </Tag>
      ),
    },
    {
      title: "操作",
      dataIndex: "operate",
      key: "operate",
      render: (_, item) => (
        <Flex gap="small">
          <Button
            color="primary"
            variant="text"
            size="small"
            onClick={() => navigate(`/shop/products-form?id=${item.id}`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="提示"
            description="确定要删除吗?"
            onConfirm={() => handleDel(item.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button color="danger" variant="text" size="small">
              删除
            </Button>
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  const navigate = useNavigate();
  const { message } = App.useApp();
  const [list, setList] = useState<GoodsItem[]>([]);
  const [categoriesList, setCategoriesList] = useState<CategoriesItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const { selectedRowKeys, rowSelection, clearSelectedRowKeys } =
    useTableSelection<GoodsItem>();
  const [searchParams, setSearchParams] = useState<Partial<GoodsListParams>>(
    {},
  );

  // 筛选配置
  const filterList: FilterItem[] = [
    {
      label: "商品名称",
      name: "keyword",
      placeholder: "请输入商品名称",
      type: "input",
    },
    {
      label: "商品分类",
      name: "categoryId",
      placeholder: "请选择分类",
      type: "select",
      options: [
        { label: "全部分类", value: 99 },
        ...categoriesList.map((item) => ({
          label: item.name,
          value: item.id,
        })),
      ],
      defaultValue: 99,
    },
    {
      label: "状态",
      name: "isOnSale",
      placeholder: "请选择状态",
      type: "select",
      options: [
        { label: "全部状态", value: 99 },
        { label: "在售", value: true },
        { label: "下架", value: false },
      ],
      defaultValue: 99,
    },
  ];

  // 筛选
  const onSearch = (values: FormValues) => {
    const params: Partial<GoodsListParams> = {
      ...(values.keyword ? { keyword: String(values.keyword) } : {}),
      ...(values.categoryId !== undefined &&
      values.categoryId !== "" &&
      values.categoryId !== 99
        ? { categoryId: Number(values.categoryId) }
        : {}),
      ...(values.isOnSale !== undefined &&
      values.isOnSale !== "" &&
      values.isOnSale !== 99
        ? { isOnSale: Boolean(values.isOnSale) }
        : {}),
    };
    setSearchParams(params);
    getList(1, pagination.pageSize, params);
  };

  // 获取二级分类
  const getCategoriesList = async () => {
    const { data: res } = await categoriesApi.parentList(2);
    setCategoriesList(res.data);
  };

  // 获取商品列表
  const getList = async (
    page = pagination.page,
    pageSize = pagination.pageSize,
    params: Partial<GoodsListParams> = searchParams,
  ) => {
    const { data: res } = await goodsApi.list({
      page,
      pageSize,
      ...params,
    });
    setList(res.data.list);
    setPagination(res.data.pagination);
  };

  // 删除
  const handleDel = async (id?: number) => {
    const { data: res } = await goodsApi.deletes(
      id ? [Number(id)] : selectedRowKeys.map((key) => Number(key)),
    );
    clearSelectedRowKeys();
    message.success(res.message);
    getList();
  };

  // 分页变化获取数据
  const { handleTableChange } = useTablePagination(getList);

  useEffect(() => {
    getList();
    getCategoriesList();
  }, []);

  return (
    <div className="column-gap">
      {/* 顶部标题栏 */}
      <PageHeader title="商品管理" des="管理您的产品库存、定价及销售表现。">
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate("/shop/products-form")}
        >
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
              <img
                src={item.icon}
                alt={item.title}
                className={styles["item-icon"]}
              />
              <div className={styles["item-label"]}>{item.title}</div>
              <div className={styles["item-value"]}>
                {item.value}
                <span>{item.symbol}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 筛选 */}
      <TableFiltering filterList={filterList} onSubmit={onSearch} />

      {/* 表格 */}
      <TableCard<GoodsItem>
        toolbar={
          <Flex align="center" gap="middle">
            <Popconfirm
              title="提示"
              description="确定要删除吗?"
              onConfirm={() => handleDel()}
              okText="Yes"
              cancelText="No"
            >
              <Button color="danger" variant="solid" icon={<DeleteOutlined />}>
                批量删除
              </Button>
            </Popconfirm>
          </Flex>
        }
        rowSelection={rowSelection}
        columns={columns}
        dataSource={list}
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default Products;
