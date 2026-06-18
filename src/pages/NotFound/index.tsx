import styles from './index.module.scss'

const NotFound = () => {
  return (
    <div className={styles['page']}>
      <img src='/src/assets/images/404.png' alt='404' className={styles['not-img']} />
    </div>
  )
}

export default NotFound