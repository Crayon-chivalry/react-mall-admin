import type { TablePaginationConfig } from "antd";

type TableListGetter = (page?: number, pageSize?: number) => void | Promise<void>;

// Reuse the default Ant Design pagination-change handling across list pages.
const useTablePagination = (getList: TableListGetter) => {
  const handleTableChange = (tablePagination: TablePaginationConfig) => {
    const nextPage = tablePagination.current ?? 1;
    const nextPageSize = tablePagination.pageSize ?? 10;
    getList(nextPage, nextPageSize);
  };

  return {
    handleTableChange,
  };
};

export default useTablePagination;
