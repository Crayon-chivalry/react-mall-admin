import { useEffect, useRef, useState } from "react";
import {
  Button,
  Row,
  Col,
  Tabs,
  Divider,
  Flex,
  Popconfirm,
  Tag,
  App,
} from "antd";
import { formatLocalTime } from "@/utils/date";
import type { TabsProps } from "antd";
import {
  PlusOutlined,
  LinkOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from "@ant-design/icons";

import PageHeader from "@/components/PageHeader/index";
import SliderForm, { type SliderFormRef } from "./components/SliderForm";
import styles from "./index.module.scss";
import { sliderApi } from "@/api/sliderApi";
import type { SliderItem } from "@/api/types";

// 标签页
const items: TabsProps["items"] = [
  {
    key: "1",
    label: "全部列表",
  },
  {
    key: "2",
    label: "正在展示",
  },
  {
    key: "3",
    label: "已下架",
  },
];

const Slider = () => {
  const formRef = useRef<SliderFormRef>(null);
  const { message } = App.useApp();
  const [banners, setBanners] = useState<SliderItem[]>([]);

  // 显示表单抽屉
  const handleShowForm = (item?: SliderItem) => {
    formRef.current?.showDrawer(item);
  };

  // tabs 切换
  const onChange = (key: string) => {
    const isEnabled = key === "2" ? true : key === "3" ? false : undefined;
    getList(isEnabled);
  };

  // 获取轮播数据 （页面暂不进行分页处理）
  const getList = async (isEnabled?: boolean) => {
    const params = { page: 1, pageSize: 10, ...(isEnabled === undefined ? {} : { isEnabled }) };
    const { data: res } = await sliderApi.list(params);
    setBanners(res.list);
  };

  // 表单添加 / 修改成功回调
  const onSuccess = (item?: SliderItem) => {
    if (!item) return;
    setBanners((prev) => {
      const exists = prev.some((banner) => banner.id === item.id);
      if (exists) {
        return prev.map((banner) => (banner.id === item.id ? item : banner));
      }
      return [item, ...prev];
    });
  };

  // 删除
  const handleDelete = async (id: number) => {
    const { data: res } = await sliderApi.delete(id);
    message.success(res.message);
    setBanners((prev) => prev.filter((item) => item.id !== id));
    // getList();
  };

  // 修改状态
  const handleUpStatus = async (id: number, isEnabled: boolean) => {
    const { data: res } = await sliderApi.upStatus(id, !isEnabled);
    message.success(res.message);
    setBanners((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isEnabled: !item.isEnabled } : item,
      ),
    );
    // getList();
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div>
      <PageHeader title="轮播图管理">
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => handleShowForm()}
        >
          上传新轮播图
        </Button>
      </PageHeader>

      {/* 标签页 */}
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />

      {/* 列表 */}
      <div className={styles["banners"]}>
        {banners.map((item) => (
          <div className={styles["banner"]} key={item.id}>
            <div className={styles["banner-header"]}>
              <img
                src={item.imageUrl}
                alt="cover"
                className={styles["banner-cover"]}
              />
            </div>
            <div className={styles["banner-content"]}>
              <Flex gap="small" align="center">
                <Tag color={item.isEnabled ? "green" : "red"}>
                  {item.isEnabled ? "展示中" : "已下架"}
                </Tag>
                <div className={styles["banner-title"]}>{item.title}</div>
              </Flex>
              <Flex
                gap="small"
                align="center"
                className={styles["banner-link"]}
              >
                <LinkOutlined />
                <span>{item.linkUrl || "-"}</span>
              </Flex>
              <Row className={styles["banner-row"]}>
                <Col span={12} className={styles["banner-col"]}>
                  <div className={styles["banner-label"]}>排序权重</div>
                  <div>{item.sort}</div>
                </Col>
                <Col span={12} className={styles["banner-col"]}>
                  <div className={styles["banner-label"]}>创建时间</div>
                  <div>{formatLocalTime(item.createdAt)}</div>
                </Col>
              </Row>
              <Divider />
              <Flex justify="space-between">
                <Flex gap="middle" align="center">
                  <EditOutlined onClick={() => handleShowForm(item)} />
                  <Popconfirm
                    title="提示"
                    description={item.isEnabled ? "确定要下架吗?" : "确定要展示吗?"}
                    onConfirm={() => handleUpStatus(item.id ,item.isEnabled)}
                    okText="Yes"
                    cancelText="No"
                  >
                    { item.isEnabled ?  <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </Popconfirm>
                </Flex>
                <Popconfirm
                  title="提示"
                  description="确定要删除吗?"
                  onConfirm={() => handleDelete(item.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined />
                </Popconfirm>
              </Flex>
            </div>
          </div>
        ))}
      </div>

      {/* 添加 / 编辑 表单抽屉 */}
      <SliderForm ref={formRef} onSuccess={onSuccess} />
    </div>
  );
};

export default Slider;
