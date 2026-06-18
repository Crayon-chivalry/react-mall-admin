import type { ReactNode } from 'react'
import styles from './index.module.scss'

type PageHeaderProps = {
  title: string
  des?: string
  children?: ReactNode
}

const PageHeader = ({ title, des, children }: PageHeaderProps) => {
  return (
    <div className={styles["page-header"]}>
      <div className={styles["header-info"]}>
        <h1 className={styles["title"]}>{title}</h1>
        <p className={styles["des"]}>{des}</p>
      </div>
      {children && <div className={styles["slot"]}>{children}</div>}
    </div>
  )
}

export default PageHeader