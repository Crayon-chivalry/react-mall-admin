import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { Drawer, App, Tree } from "antd";

import type { RolesItem, MenusItem } from "@/api/types";
import { rbacApi } from "@/api/rbacApi";

export interface PermissionsFromRef {
  showDrawer: () => void;
}

type PermissionsFormProps = {
  onSuccess?: () => void;
};

const PermissionsForm = forwardRef<PermissionsFromRef, PermissionsFormProps>(
  (props, ref) => {
    const { message } = App.useApp();
    const [open, setOpen] = useState(false);
    const [menusList, setMenusList] = useState<MenusItem[]>([]);

    // 打开抽屉
    const showDrawer = async () => {
      setOpen(true);
    };

    // 关闭抽屉
    const onClose = () => {
      setOpen(false);
    };

    // 获取菜单树
    const getMenus = async () => {
      const { data: res } = await rbacApi.menus();
      setMenusList(res.data);
      console.log(res.data);
    };

    // 提交
    const onFinish = async (values: [number]) => {};

    useEffect(() => {
      getMenus();
    }, []);

    useImperativeHandle(ref, () => ({
      showDrawer,
    }));

    return (
      <Drawer title="分配权限" onClose={onClose} open={open}>
        <Tree
          checkable
          defaultExpandAll
          fieldNames={{ title: "name", key: "id" }}
          treeData={menusList}
        />
      </Drawer>
    );
  },
);

export default PermissionsForm;
