import { Divider, Table, type TableProps } from "antd";
import type { ReactNode } from "react";

type TableCardProps<T extends object> = {
  toolbar?: ReactNode;
} & TableProps<T>;

const TableCard = <T extends object>({
  toolbar,
  ...tableProps
}: TableCardProps<T>) => {
  return (
    <div className="table-card">
      {toolbar ? (
        <>
          {toolbar}
          <Divider />
        </>
      ) : null}
      <Table<T> {...tableProps} />
    </div>
  );
};

export default TableCard;
