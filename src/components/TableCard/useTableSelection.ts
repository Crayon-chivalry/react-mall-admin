import { useState } from "react";
import type { Key } from "react";
import type { TableProps } from "antd";

type TableRowSelection<T extends object> = TableProps<T>["rowSelection"];

// Unified row-selection state for list pages using Ant Design Table.
const useTableSelection = <T extends object>() => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const rowSelection: TableRowSelection<T> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const clearSelectedRowKeys = () => {
    setSelectedRowKeys([]);
  };

  return {
    selectedRowKeys,
    setSelectedRowKeys,
    rowSelection,
    clearSelectedRowKeys,
  };
};

export default useTableSelection;
