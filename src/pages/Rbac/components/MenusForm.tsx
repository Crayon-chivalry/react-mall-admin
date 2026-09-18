import { forwardRef, useImperativeHandle, useState } from "react";
import {
  Drawer,
  Form,
  Input,
  Button,
  Radio,
  InputNumber,
  TreeSelect,
  App,
} from "antd";

import type { MenuItem } from "@/api/types";
import { rbacApi } from "@/api/rbacApi";

export interface MenusFormRef {
  showDrawer: (item?: MenuItem, defaultValues?: Partial<MenuItem>) => void;
}

type MenusFormProps = {
  menusList?: MenuItem[];
  onSuccess?: (item?: MenuItem) => void;
};

type ParentOption = {
  title: string;
  value: number;
  disabled?: boolean;
  children?: ParentOption[];
};

/** 菜单类型：1 目录，2 菜单，3 操作项 */
const MENU_TYPE = {
  DIRECTORY: 1,
  MENU: 2,
  ACTION: 3,
} as const;

// 表单验证规则
const rules = {
  name: [{ required: true, message: "请输入菜单名称" }],
  code: [{ required: true, message: "请输入菜单编码" }],
  type: [{ required: true, message: "请选择类型" }],
  parentId: [{ required: true, message: "请选择所属菜单" }],
  permissionCode: [{ required: true, message: "请输入权限编码" }],
  path: [{ required: true, message: "请输入路由路径" }],
};

/**
 * 构建父级选项树（使用标准 title/value，避免 fieldNames 回显异常）
 * - mode "directory"：只列目录，供菜单选择父级
 * - mode "menu"：目录作为禁用分组节点保留层级，菜单可选（供操作项选择所属菜单）
 */
const buildParentOptions = (
  list: MenuItem[] = [],
  mode: "directory" | "menu",
): ParentOption[] => {
  if (mode === "directory") {
    return list
      .filter((item) => item.type === MENU_TYPE.DIRECTORY)
      .map((item) => ({ title: item.name, value: item.id }));
  }

  const nodes: ParentOption[] = [];
  for (const item of list) {
    if (item.type === MENU_TYPE.ACTION) {
      continue;
    }

    const children = item.children?.length
      ? buildParentOptions(item.children, mode)
      : undefined;

    nodes.push({
      title: item.name,
      value: item.id,
      disabled: item.type === MENU_TYPE.DIRECTORY,
      children,
    });
  }
  return nodes;
};

const MenusForm = forwardRef<MenusFormRef, MenusFormProps>((props, ref) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<MenuItem>();
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const { onSuccess } = props;
  const currentType = Form.useWatch("type", form);

  // 打开抽屉
  const showDrawer = async (
    item?: MenuItem,
    defaultValues?: Partial<MenuItem>,
  ) => {
    setEditingItem(defaultValues ? null : (item ?? null));
    if (item && !defaultValues) {
      const { children: _, ...editable } = item;
      form.resetFields();
      form.setFieldsValue(editable);
    } else {
      form.resetFields();
      form.setFieldsValue({
        type: MENU_TYPE.DIRECTORY,
        sort: 1,
        ...defaultValues,
      });
    }
    setOpen(true);
  };

  // 关闭抽屉
  const onClose = () => {
    setOpen(false);
  };

  // 切换类型后原父级不再适用（目录无父级、菜单挂目录、操作项挂菜单），一律清空避免残留显示数字 id
  const onTypeChange = () => {
    form.setFieldValue("parentId", undefined);
  };

  // 提交
  const onFinish = async (values: MenuItem) => {
    const { children: _, ...payload } = values;

    if (payload.type === MENU_TYPE.DIRECTORY) {
      // 目录必须为顶级
      payload.parentId = null;
    }
    if (payload.type === MENU_TYPE.ACTION) {
      // 操作项无需路由路径
      delete payload.path;
    }

    const { data: res } = editingItem
      ? await rbacApi.updateMenus(editingItem.id, payload as MenuItem)
      : await rbacApi.addMenus(payload as MenuItem);
    message.success(res.message);
    onSuccess?.(res.data);
    onClose();
  };

  useImperativeHandle(ref, () => ({
    showDrawer,
  }));

  // 父级选项：菜单挂目录下（可清空 = 顶级菜单），操作项挂菜单下（目录为禁用分组）
  const parentOptions = buildParentOptions(
    props.menusList,
    currentType === MENU_TYPE.ACTION ? "menu" : "directory",
  );

  return (
    <Drawer
      title={editingItem ? "编辑菜单" : "添加菜单"}
      onClose={onClose}
      open={open}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item<MenuItem> label="菜单类型" name="type" rules={rules.type}>
          <Radio.Group
            options={[
              { value: MENU_TYPE.DIRECTORY, label: "目录" },
              { value: MENU_TYPE.MENU, label: "菜单" },
              { value: MENU_TYPE.ACTION, label: "操作项" },
            ]}
            onChange={() => onTypeChange()}
          />
        </Form.Item>
        <Form.Item<MenuItem> label="菜单名称" name="name" rules={rules.name}>
          <Input size="large" placeholder="请输入菜单名称" />
        </Form.Item>
        <Form.Item<MenuItem> label="菜单编码" name="code" rules={rules.code}>
          <Input size="large" placeholder="请输入菜单编码，如 system_user" />
        </Form.Item>
        {/* 目录和菜单可设置图标（顶级菜单也会在侧边栏显示图标） */}
        {currentType !== MENU_TYPE.ACTION && (
          <Form.Item<MenuItem>
            label="图标"
            name="icon"
            tooltip="Element Plus 图标名称，如 UserFilled"
          >
            <Input size="large" placeholder="请输入图标名称，可不填" />
          </Form.Item>
        )}
        {/* 菜单可选择父级目录（不选即顶级菜单，如首页）；操作项必须选择所属菜单 */}
        {currentType === MENU_TYPE.MENU && (
          <Form.Item<MenuItem>
            label="父级目录"
            name="parentId"
            tooltip="不选择父级则为顶级菜单，如首页"
          >
            <TreeSelect
              placeholder="不选择则为顶级菜单"
              allowClear
              treeDefaultExpandAll
              treeData={parentOptions}
            />
          </Form.Item>
        )}
        {currentType === MENU_TYPE.ACTION && (
          <Form.Item<MenuItem> label="所属菜单" name="parentId" rules={rules.parentId}>
            <TreeSelect
              placeholder="请选择所属菜单"
              treeDefaultExpandAll
              treeData={parentOptions}
            />
          </Form.Item>
        )}
        {/* 目录和菜单需要路由路径 */}
        {currentType !== MENU_TYPE.ACTION && (
          <Form.Item<MenuItem>
            label="路由路径"
            name="path"
            rules={rules.path}
            tooltip={
              currentType === MENU_TYPE.DIRECTORY
                ? "以 / 开头，如 /system"
                : "目录下子路径或以 / 开头的顶级路径，如 user 或 /"
            }
          >
            <Input size="large" placeholder="请输入路由路径" />
          </Form.Item>
        )}
        {/* 操作项必须设置权限编码；菜单可选填用于关联权限 */}
        {currentType === MENU_TYPE.ACTION ? (
          <Form.Item<MenuItem>
            label="权限编码"
            name="permissionCode"
            rules={rules.permissionCode}
          >
            <Input size="large" placeholder="请输入权限编码，如 user.create" />
          </Form.Item>
        ) : (
          currentType === MENU_TYPE.MENU && (
            <Form.Item<MenuItem>
              label="权限编码"
              name="permissionCode"
              tooltip="选填，关联查看权限后可用于接口鉴权"
            >
              <Input size="large" placeholder="选填，如 user.view" />
            </Form.Item>
          )
        )}
        <Form.Item<MenuItem> label="排序权重" name="sort">
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" block size="large" htmlType="submit">
            确认
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
});

export default MenusForm;
