import { useEffect, useRef, useState } from "react";
import {
  Button,
  Image,
  Flex,
  Tag,
  App,
  type TableProps,
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

import PageHeader from "@/components/PageHeader";
import TableFiltering from "@/components/TableFiltering";
import {
  type FilterItem,
  type FormValues,
} from "@/components/TableFiltering/filterTypes";
import CategorizeForm, {
  type CategorizeRef,
} from "./components/CategorizeForm";
import TableCard from "@/components/TableCard";
import useTablePagination from "@/components/TableCard/useTablePagination";
import type {
  CategoriesItem,
  Pagination,
  CategoriesListParams,
} from "@/api/types";
import { categoriesApi } from "@/api/categoriesApi";

// 筛选配置
const filterList: FilterItem[] = [
  {
    label: "分类名称",
    name: "keyword",
    placeholder: "请输入关键词",
    type: "input",
  },
];

const Categorize = () => {
  // 表单项
  const columns: TableProps<CategoriesItem>["columns"] = [
    {},
    {
      title: "图标",
      dataIndex: "avatar",
      key: "avatar",
      render: (_, { parentId, icon }) => (
        <Image src={icon} width={parentId === 0 ? 40 : 30} />
      ),
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (_, { isVisible }) => (
        <Tag color={isVisible ? "green" : "red"}>
          {isVisible ? "启用" : "禁用"}
        </Tag>
      ),
    },
    {
      title: "排序",
      dataIndex: "sort",
      key: "sort",
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
            onClick={() => handleShowForm(undefined, item.id)}
          >
            新增
          </Button>
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
            onConfirm={() => handleDelete(item.id)}
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
  const formRef = useRef<CategorizeRef>(null);
  const [list, setList] = useState<CategoriesItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState<
    Partial<CategoriesListParams>
  >({});

  // 显示表单抽屉
  const handleShowForm = (item?: CategoriesItem, parentId?: number) => {
    formRef.current?.showDrawer(item, parentId);
  };

  // 筛选
  const onSearch = (values: FormValues) => {
    const params: Partial<CategoriesListParams> = {
      ...(values.keyword ? { keyword: String(values.keyword) } : {}),
    };
    setSearchParams(params);
    getList(1, pagination.pageSize, params);
  };

  // 获取列表
  const getList = async (
    page = pagination.page,
    pageSize = pagination.pageSize,
    params: Partial<CategoriesListParams> = searchParams,
  ) => {
    const { data: res } = await categoriesApi.list({
      page,
      pageSize,
      ...params,
    });
    const listData = res.data.list.map((item: CategoriesItem) => ({
      ...item,
      parentId: item.parentId ?? 0,
    }));
    setList(listData);
    setPagination(res.data.pagination);
  };

  // 删除分类
  const handleDelete = async (id: number) => {
    const { data: res } = await categoriesApi.delete(id);
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
      <PageHeader title="分类管理" des="构建多级分类体系，精准导引用户购物路径">
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => handleShowForm()}
        >
          新增分类
        </Button>
      </PageHeader>

      <TableFiltering filterList={filterList} onSubmit={onSearch} />

      <TableCard<CategoriesItem>
        columns={columns}
        dataSource={list}
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
      />

      {/* 分类表单 */}
      <CategorizeForm ref={formRef} onSuccess={() => getList()} />
    </div>
  );
};

export default Categorize;
