import { useEffect, useRef, useState } from "react";
import {
  Flex,
  Button,
  Popconfirm,
  Tag,
  App,
  type TableProps,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

import type { PromoItem, Pagination } from "@/api/types";
import { contentApi } from "@/api/contentApi";
import TableCard from "@/components/TableCard";
import useTablePagination from "@/components/TableCard/useTablePagination";
import useTableSelection from "@/components/TableCard/useTableSelection";
import PageHeader from "@/components/PageHeader";
import PromoForm, { type PromoFormRef } from "./components/PromoForm";

// 布局类型名称
const layoutTypeName = {
  single: "单图",
  double: "双图",
  triple: "三图",
};

const Promo = () => {
  const columns: TableProps<PromoItem>["columns"] = [
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "布局",
      dataIndex: "layoutType",
      key: "layoutType",
      render: (_, { layoutType }) => layoutTypeName[layoutType],
    },
    {
      title: "状态",
      dataIndex: "isEnabled",
      key: "isEnabled",
      render: (_, { isEnabled }) => (
        <Tag color={isEnabled ? "green" : "red"}>
          {isEnabled ? "启用" : "禁用"}
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
            onClick={() => handleShowForm(item)}
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

  const { message } = App.useApp();
  const formRef = useRef<PromoFormRef>(null);
  const [list, setList] = useState<PromoItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const { selectedRowKeys, rowSelection, clearSelectedRowKeys } =
    useTableSelection<PromoItem>();

  // 显示添加表单
  const handleShowForm = (item?: PromoItem) => {
    formRef.current?.showDrawer(item);
  };

  // 获取列表
  const getList = async (
    page = pagination.page,
    pageSize = pagination.pageSize,
  ) => {
    const { data: res } = await contentApi.promoList({
      page,
      pageSize,
    });
    setList(res.data.list);
    setPagination(res.data.pagination);
  };

  // 删除
  const handleDel = async (id?: number) => {
    const { data: res } = await contentApi.promoDelete(
      id ? [id] : selectedRowKeys.map((key) => Number(key)),
    );
    clearSelectedRowKeys();
    message.success(res.message);
    getList();
  };

  // 分页变化获取数据
  const { handleTableChange } = useTablePagination(getList);

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className="column-gap">
      <PageHeader title="广告列表" des="主要展示首页广告、促销位">
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => handleShowForm()}
        >
          新增
        </Button>
      </PageHeader>

      <TableCard<PromoItem>
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

      <PromoForm ref={formRef} onSuccess={() => getList} />
    </div>
  );
};

export default Promo;
