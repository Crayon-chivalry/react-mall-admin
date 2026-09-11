import { useEffect, useState } from "react";
import {
  Avatar,
  Flex,
  Button,
  Popconfirm,
  Tag,
  App,
  type TableProps,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import { shopApi } from "@/api/shopApi";
import { formatLocalTime } from "@/utils/date";
import type { Pagination, OrderItem } from "@/api/types";
import {
  type FilterItem,
  type FormValues,
} from "@/components/TableFiltering/filterTypes";
import useTablePagination from "@/components/TableCard/useTablePagination";
import useTableSelection from "@/components/TableCard/useTableSelection";
import PageHeader from "@/components/PageHeader";
import TableFiltering from "@/components/TableFiltering";
import TableCard from "@/components/TableCard";
import OrderProductsExpand from "@/pages/Shop/components/OrderProductsExpand";

const filterList: FilterItem[] = [
  {
    label: "手机号",
    name: "phone",
    placeholder: "请输入手机号",
    type: "input",
  },
  {
    label: "昵称",
    name: "nickname",
    placeholder: "请输入昵称",
    type: "input",
  },
  {
    label: "状态",
    name: "status",
    placeholder: "请选择状态",
    type: "select",
    options: [
      { label: "全部", value: 99 },
      { label: "正常", value: 1 },
      { label: "冻结", value: 2 },
    ],
    defaultValue: 99,
  },
];

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
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <Tag color={status ? "green" : "red"}>{status ? "正常" : "冻结"}</Tag>
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
            // onClick={() => handleShowForm(item)}
          >
            详情
          </Button>
          <Button
            color="primary"
            variant="text"
            size="small"
            // onClick={() => handleShowForm(item)}
          >
            发货
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
  const [list, setList] = useState<OrderItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const { selectedRowKeys, rowSelection, clearSelectedRowKeys } =
    useTableSelection<OrderItem>();

  // 搜索
  const onSearch = (values: FormValues) => {};

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
  ) => {
    const { data: res } = await shopApi.orders({ page, pageSize });
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
        pagination={pagination}
        onChange={handleTableChange}
        expandable={{
          expandedRowRender: (record) => (
            <OrderProductsExpand items={record.items} />
          ),
        }}
      />
    </div>
  );
};

export default Orders;
