import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  Drawer,
  Checkbox,
  App,
  Col,
  Row,
  Button,
  type CheckboxOptionType,
  type GetProp,
} from "antd";

import { rbacApi } from "@/api/rbacApi";
import type { RolesItem, UserItem } from "@/api/types";

export interface AssignRolesRef {
  showDrawer: (user: UserItem) => void;
}

type AssignRolesProps = {
  onSuccess?: () => void;
};

const AssignRoles = forwardRef<AssignRolesRef, AssignRolesProps>(
  (props, ref) => {
    const { message } = App.useApp();
    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState<string>("")
    const [rolesList, setRolesList] = useState<CheckboxOptionType[]>([]);
    const [roleIds, setRoleIds] = useState<number[]>([])
    const { onSuccess } = props;

    // 打开抽屉
    const showDrawer = (item: UserItem) => {
      setUserId(item.userId)
      setRoleIds(item.adminRoles.map(item => item.id))
      setOpen(true);
    };

    // 关闭抽屉
    const onClose = () => {
      setOpen(false);
    };

    // 单选框变化时
    const onChange: GetProp<typeof Checkbox.Group, "onChange"> = (
      checkedValues,
    ) => {
      setRoleIds(checkedValues as number[])
    };

    // 获取角色
    const getRoles = async () => {
      const { data: res } = await rbacApi.roles();
      const rolesData = res.data
        .filter((item: RolesItem) => item.isEnabled)
        .map((item: RolesItem) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      setRolesList(rolesData);
    };

    // 确认分配角色
    const confirmAssign = async () => {
      console.log(userId)
      const { data: res } = await rbacApi.assignRoles(userId, roleIds)
      message.success(res.message);
      onSuccess?.();
      onClose();
    }

    useEffect(() => {
      getRoles();
    }, []);

    useImperativeHandle(ref, () => ({
      showDrawer,
    }));

    return (
      <Drawer title="分配角色" onClose={onClose} open={open}>
        <Checkbox.Group defaultValue={roleIds} onChange={onChange}>
          <Row gutter={[0, 24]}>
            {rolesList.map((item) => (
              <Col span={24} key={item.value}>
                <Checkbox value={item.value}>{item.label}</Checkbox>
              </Col>
            ))}
            <Button type="primary" block size="large" onClick={confirmAssign}>
              确认
            </Button>
          </Row>
        </Checkbox.Group>
      </Drawer>
    );
  },
);

export default AssignRoles;
