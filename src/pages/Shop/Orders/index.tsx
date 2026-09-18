import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Button, Popconfirm, App, type TableProps } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import { shopApi } from "@/api/shopApi";
import { formatLocalTime } from "@/utils/date";
import type { Pagination, OrderItem, OrderListParams, OrderStatus } from "@/api/types";
import { createStatusTagRenderer, defineStatusOptions } from "@/utils/status";
import {
  type FilterItem,
  type FormValues,
} from "@/components/TableFiltering/filterTypes";
import useTablePagination from "@/components/TableCard/useTablePagination";
import useTableSelection from "@/components/TableCard/useTableSelection";
import PageHeader from "@/components/PageHeader";
import TableFiltering from "@/components/TableFiltering";
import TableCard from "@/components/TableCard";
import OrderProductsExpand from "../components/OrderProductsExpand";
import OrderShipModal from "../components/OrderShipModal";

// 筛选配置
const filterList: FilterItem[] = [
  {
    label: "订单号",
    name: "orderNo",
    placeholder: "请输入订单号",
    type: "input",
  },
  {
    label: "状态",
    name: "status",
    placeholder: "请选择状态",
    type: "select",
    options: [
      { label: "全部", value: 99 },
      { label: "待付款", value: "pending" },
      { label: "待发货", value: "paid" },
      { label: "已发货", value: "shipped" },
      { label: "已完成", value: "completed" },
    ],
    defaultValue: 99,
  },
];

// 类型列表配置
const statusList = defineStatusOptions<OrderItem["status"]>([
  { label: "待付款", value: "pending", color: "red" },
  { label: "待发货", value: "paid", color: "green" },
  { label: "已发货", value: "shipped", color: "warning" },
  { label: "已完成", value: "completed" },
  { label: "已取消", value: "cancelled", color: "red" },
]);
const renderStatusTag = createStatusTagRenderer(statusList);

// 付款类型
const paymentMethods: Record<string, string> = {
  alipay: "支付宝",
  wechat: "微信支付",
};

const Orders = () => {
  // 配置项
  const columns: TableProps<OrderItem>["columns"] = [
    {
      title: "订单号",
      dataIndex: "orderNo",
      key: "orderNo",
    },
    {
      title: "下单时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, { createdAt }) => formatLocalTime(createdAt, "datetime"),
    },
    {
      title: "金额",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (_, { totalAmount }) => `￥${totalAmount}`,
    },
    {
      title: "付款方式",
      dataIndex: "paymentType",
      key: "paymentType",
      render: (_, { paymentType }) => paymentMethods[paymentType] || "-",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => renderStatusTag(status),
    },
    {
      title: "操作",
      dataIndex: "operate",
      key: "operate",
      render: (_, item) => (
        <Flex gap="small">
          {item.status === "paid" && (
            <Button
              color="primary"
              variant="text"
              size="small"
              onClick={() => openShipModal(item)}
            >
              发货
            </Button>
          )}
          <Button
            color="primary"
            variant="text"
            size="small"
            onClick={() => navigate("/shop/order-details?id=" + item.id)}
          >
            详情
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

  const { message } = App.useApp();
  const navigate = useNavigate()
  const [list, setList] = useState<OrderItem[]>([]);
  const [isShipModal, setIsShipModal] = useState<boolean>(false);
  const [activeOrder, setActiveOrder] = useState<OrderItem | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState<Partial<OrderListParams>>({});
  const { selectedRowKeys, rowSelection, clearSelectedRowKeys } =
    useTableSelection<OrderItem>();

  // 显示发货对话框
  const openShipModal = (item: OrderItem) => {
    setActiveOrder(item);
    setIsShipModal(true);
  };

  // 搜索
  const onSearch = (values: FormValues) => {
    const params: Partial<OrderListParams> = {
      ...(values.orderNo ? { orderNo: values.orderNo as string } : {}),
      ...(values.status !== undefined &&
      values.status !== "" &&
      values.status !== 99
        ? { status: values.status as OrderStatus }
        : {}),
    };
    setSearchParams(params);
    getOrders(1, pagination.pageSize, params);
  };

  // 删除
  const handleDel = async (id?: number) => {
    const { data: res } = await shopApi.deletesOrder(
      id ? [id] : selectedRowKeys.map((key) => Number(key)),
    );
    clearSelectedRowKeys();
    message.success(res.message);
    getOrders();
  };

  // 获取订单列表
  const getOrders = async (
    page = pagination.page,
    pageSize = pagination.pageSize,
    params: Partial<OrderListParams> = searchParams,
  ) => {
    const { data: res } = await shopApi.orders({ page, pageSize, ...params });
    console.log(res.data.list);
    setList(res.data.list);
    setPagination(res.data.pagination);
  };

  // 分页变化获取数据
  const { handleTableChange } = useTablePagination(getOrders);

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="column-gap">
      <PageHeader title="订单列表" des="订单列表，管理商城订单"></PageHeader>

      <TableFiltering filterList={filterList} onSubmit={onSearch} />

      <TableCard<OrderItem>
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
        scroll={{ x: true }}
        pagination={pagination}
        onChange={handleTableChange}
        expandable={{
          expandedRowRender: (record) => (
            <OrderProductsExpand items={record.items} />
          ),
        }}
      />

      {/* 发货对话框 */}
      <OrderShipModal
        open={isShipModal}
        id={activeOrder?.id}
        onCancel={() => setIsShipModal(false)}
        onSuccess={() => getOrders()}
      />
    </div>
  );
};

export default Orders;
