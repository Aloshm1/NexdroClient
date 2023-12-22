import styles from '../styles/loader.module.css'

export default function Loader() {
    return (
        <>
<div className={styles.loading} style={{color: "green", display: "inline-block"}}> 
  <span></span>
  <span></span>
  <span></span> 
</div>
        </>
    )
}
