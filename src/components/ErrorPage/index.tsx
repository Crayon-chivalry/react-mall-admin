import { Button } from "antd";
import { useNavigate } from "react-router-dom";

import styles from "./index.module.scss";

type ErrorPageProps = {
  code: string;
  title: string;
  desc: string;
  imageSrc?: string;
  imageAlt?: string;
  theme?: "danger" | "info";
  actionText?: string;
  actionPath?: string;
};

const ErrorPage = ({
  code,
  title,
  desc,
  imageSrc,
  imageAlt,
  theme = "info",
  actionText = "Back Home",
  actionPath = "/",
}: ErrorPageProps) => {
  const navigate = useNavigate();

  return (
    <div className={`${styles["page"]} ${styles[`page-${theme}`]}`}>
      <div className={`${styles["card"]} ${styles[`card-${theme}`]}`}>
        {imageSrc && (
          <img
            src={imageSrc}
            alt={imageAlt ?? code}
            className={styles["image"]}
          />
        )}
        <div className={`${styles["code"]} ${styles[`code-${theme}`]}`}>{code}</div>
        <div className={styles["title"]}>{title}</div>
        <div className={styles["desc"]}>{desc}</div>
        <Button type="primary" size="large" onClick={() => navigate(actionPath)}>
          {actionText}
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
