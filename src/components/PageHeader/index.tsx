import type { ReactNode } from 'react'
import { LeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

import styles from './index.module.scss'

type PageHeaderProps = {
  title: string
  des?: string
  children?: ReactNode
  showBack?: boolean
}

const PageHeader = ({ title, des, children, showBack = false }: PageHeaderProps) => {
  const navigate = useNavigate()

  return (
    <div className={styles["page-header"]}>
      <div className={styles["header-left"]}>
        {showBack && (
          <button
            type="button"
            className={styles["back-button"]}
            onClick={() => navigate(-1)}
            aria-label="返回上一页"
          >
            <LeftOutlined />
          </button>
        )}
        <div className={styles["header-info"]}>
          <h1 className={styles["title"]}>{title}</h1>
          <p className={styles["des"]}>{des}</p>
        </div>
      </div>
      {children && <div className={styles["slot"]}>{children}</div>}
    </div>
  )
}

export default PageHeader