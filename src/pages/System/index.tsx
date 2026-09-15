import { useEffect } from "react";
import { Col, Row, Input, Divider, Flex, Button, Tag, Switch, App } from "antd";
import { CopyOutlined, InsuranceOutlined } from "@ant-design/icons";

import styles from "./index.module.scss";
import { systemApi } from "@/api/systemApi";
import PageHeader from "@/components/PageHeader";
import UploadImages from "@/components/UploadImages";

const Setting = () => {
  const { message } = App.useApp();

  // 获取系统设置
  const getSettings = async () => {
    const { data: res } = await systemApi.settings();
    console.log(res.data.list);
  };

  // 设置默认头像
  const setDefaultAvatar = async (urls: string[]) => {
    const { data: res } = await systemApi.defaultAvatar(urls[0]);
    message.success(res.message);
  };

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <div className="column-gap">
      <PageHeader
        title="系统设置"
        des="管理全局站点参数、联系信息以及高级技术配置"
      />

      <Row gutter={24}>
        {/* Left */}
        <Col span={16}>
          <Flex vertical={true} gap="large">
            {/* 基本信息 */}
            <div className="app-card">
              <div className={styles["card-header"]}>
                <img
                  src="/src/assets/images/setting-info.png"
                  alt="setting-info"
                />
                <h2>基本信息</h2>
              </div>
              <Row gutter={24}>
                <Col span={12}>
                  <div className={styles["form-item"]}>
                    <h3>站点名称</h3>
                    <Input placeholder="输入站点名称" />
                    <p>用于浏览器标签页和主页显示的标题</p>
                  </div>
                </Col>
                <Col span={12}>
                  <div className={styles["form-item"]}>
                    <h3>站点描述</h3>
                    <Input placeholder="输入简短的站点描述..." />
                    <p>SEO优化的元描述（建议160字以内）</p>
                  </div>
                </Col>
              </Row>
              <Divider />
              <div className={styles["logo"]}>
                <UploadImages
                  initialUrls={[]}
                  onUploadSuccess={(urls) => setDefaultAvatar(urls)}
                />
                <div className={styles["logo-info"]}>
                  <h3>默认头像</h3>
                  <div>
                    <p>建议使用透明背景的 PNG 或 SVG 格式。</p>
                    <p>推荐尺寸 256x256px，最大文件 2MB。</p>
                  </div>
                </div>
              </div>
            </div>

            {/* API与开发者工具 */}
            <div className="app-card">
              <div className={styles["card-header"]}>
                <img
                  src="/src/assets/images/setting-api.png"
                  alt="setting-api"
                />
                <h2>API与开发者工具</h2>
              </div>
              <div className={styles["api"]}>
                <Flex gap="small" align="center">
                  <img
                    src="/src/assets/images/setting-code.png"
                    alt="setting-code"
                  />
                  <div>
                    <h3>API</h3>
                    <p>最后使用时间：2小时前</p>
                  </div>
                </Flex>
                <Flex gap="small" align="center">
                  <div className={styles["api-key"]}>
                    sk_live_••••••••••••4j9w
                  </div>
                  <CopyOutlined />
                </Flex>
              </div>
              <div className={styles["total"]}>
                <div className={styles["total-item"]}>
                  <div className={styles["total-label"]}>Webhook URL</div>
                  <div>https://api.ledgerpro.io/hook</div>
                </div>
                <div className={styles["total-item"]}>
                  <div className={styles["total-label"]}>重定向网关</div>
                  <div>gateway.ledgerpro.io</div>
                </div>
              </div>
            </div>
          </Flex>
        </Col>

        {/* Right */}
        <Col span={8}>
          <Flex vertical={true} gap="large">
            {/* 系统状态 */}
            <div className="app-card">
              <Flex vertical={true} gap="large">
                <Flex align="center" justify="space-between">
                  <h3>系统状态</h3>
                  <Tag color="green">运行中</Tag>
                </Flex>
                <Flex
                  vertical={true}
                  gap="middle"
                  className={styles["status-content"]}
                >
                  <Flex align="center" justify="space-between">
                    <div>维护模式</div>
                    <Switch />
                  </Flex>
                  <Flex align="center" justify="space-between">
                    <div>数据库版本</div>
                    <div>V8.4.2-stable</div>
                  </Flex>
                  <Flex align="center" justify="space-between">
                    <div>缓存占用</div>
                    <div>124.5 MB</div>
                  </Flex>
                  <Button>清除缓存</Button>
                </Flex>
              </Flex>
            </div>
            {/* 联系与支持 */}
            <div className="app-card">
              <Flex vertical={true} gap="large">
                <Flex align="center" gap="small">
                  <img
                    src="/src/assets/images/setting-contact.png"
                    alt="setting-contact"
                  />
                  <h3>联系与支持</h3>
                </Flex>
                <Flex vertical={true} gap="middle">
                  <div className={styles["contact-item"]}>
                    <div className={styles["contact-label"]}>技术支持邮箱</div>
                    <Input placeholder="Filled" variant="filled" />
                  </div>
                  <div className={styles["contact-item"]}>
                    <div className={styles["contact-label"]}>紧急联系电话</div>
                    <Input placeholder="Filled" variant="filled" />
                  </div>
                  <div className={styles["contact-item"]}>
                    <p>填写的联系方式将显示在页脚和"联系我们"页面中。</p>
                  </div>
                </Flex>
              </Flex>
            </div>
            <div className={styles.health}>
              <div>系统配置健康值</div>
              <div className={styles["health-value"]}>
                98<span>%</span>
              </div>
              <div className={styles["health-label"]}>
                <InsuranceOutlined />
                已根据最新安全标准优化
              </div>
            </div>
          </Flex>
        </Col>
      </Row>
    </div>
  );
};

export default Setting;
