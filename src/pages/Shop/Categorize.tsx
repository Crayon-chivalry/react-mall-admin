import { useEffect, useRef, useState } from 'react';
import { Button, Tag, Image, Table, Flex, type TableProps, type TablePaginationConfig } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import PageHeader from '@/components/PageHeader'
import CategorizeForm, { type CategorizeRef } from './components/CategorizeForm'
import type { CategoriesItem, Pagination, CategoriesListParams } from '@/api/types'
import { categoriesApi } from '@/api/categoriesApi'
import styles from './index.module.scss'

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
      render: (_, { icon }) => <Image src={icon} width={40} />,
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
          {item.parentId === 0 && <PlusOutlined onClick={() => handleShowForm()} />}
          <EditOutlined onClick={() => handleShowForm(item)} />
          <DeleteOutlined style={{color: "#BA1A1A"}} onClick={() => handleDel(item.id)} />
        </Flex>
      ),
    },
  ];

  const formRef = useRef<CategorizeRef>(null);
  const [list, setList] = useState<CategoriesItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState<Partial<CategoriesListParams>>({});

  // 显示表单抽屉
  const handleShowForm = (item?: CategoriesItem) => {
    formRef.current?.showDrawer(item);
  }

  // 分页变化时触发
  const handleTableChange = (tablePagination: TablePaginationConfig) => {
    const nextPage = tablePagination.current ?? 1;
    const nextPageSize = tablePagination.pageSize ?? 10;
    getList(nextPage, nextPageSize);
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
  const handleDel = (id: number) => {
    console.log(id)
  }

  // 添加成功 / 编辑成功
  const onSuccess = () => {
    getList()
  }

  useEffect(() => {
    getList()
  }, [])

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
  )
}

export default Categorize