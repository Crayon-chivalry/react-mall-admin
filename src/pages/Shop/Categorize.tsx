import { useEffect, useRef, useState } from "react";
import {
  Button,
  Tag,
  Image,
  Table,
  Flex,
  App,
  type TableProps,
  Popconfirm,
  type TablePaginationConfig,
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
import type {
  CategoriesItem,
  Pagination,
  CategoriesListParams,
} from "@/api/types";
import { categoriesApi } from "@/api/categoriesApi";
import styles from "./index.module.scss";

// 筛选配置
const filterList: FilterItem[] = [
  {
    label: "分类名称",
    name: "keyword",
    placeholder: "请输入关键词",
    type: "input",
  }
];

// 状态列表
const statusList = [
  { label: "已启用", value: true, color: "processing" },
  { label: "已禁用", value: false, color: "warning" },
];

// 渲染状态标签
function renderStatusTag(status: CategoriesItem["isVisible"]) {
  const item = statusList.find((i) => i.value === status);
  const color = item?.color ?? "default";
  const label = item?.label ?? "未知";
  return <Tag color={color}>{label}</Tag>;
}

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
      render: (_, { isVisible }) => renderStatusTag(isVisible),
    },
    {
      title: "操作",
      dataIndex: "operate",
      key: "operate",
      render: (_, item) => (
        <Flex gap="large" className={styles["table-operate"]}>
          {item.parentId === 0 && (
            <PlusOutlined onClick={() => handleShowForm(undefined, item.id)} />
          )}
          <EditOutlined onClick={() => handleShowForm(item)} />
          <Popconfirm
            title="提示"
            description="确定要删除吗?"
            onConfirm={() => handleDelete(item.id)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined style={{ color: "#BA1A1A" }} />
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

  // 分页变化时触发
  const handleTableChange = (tablePagination: TablePaginationConfig) => {
    const nextPage = tablePagination.current ?? 1;
    const nextPageSize = tablePagination.pageSize ?? 10;
    getList(nextPage, nextPageSize);
  };

  // 筛选
  const onSearch = (values: FormValues) => {
    const params: Partial<CategoriesListParams> = {
      ...(values.keyword ? { keyword: String(values.keyword) } : {})
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

  // 添加成功 / 编辑成功
  const onSuccess = () => {
    getList();
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className={styles["column-gap"]}>
      <PageHeader title="分类管理" des="构建多级分类体系，精准导引用户购物路径">
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => handleShowForm()}
        >
          添加分类
        </Button>
      </PageHeader>

      <TableFiltering filterList={filterList} onSubmit={onSearch} />

      <div className={styles["table-card"]}>
        <Table<CategoriesItem>
          columns={columns}
          dataSource={list}
          rowKey="id"
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.total,
          }}
          onChange={handleTableChange}
        />
      </div>

      {/* 分类表单 */}
      <CategorizeForm ref={formRef} onSuccess={onSuccess} />
    </div>
  );
};

export default Categorize;
