import React from "react";
import styles from "@/styles/FooterStyles.module.css";

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div>
        <h2 className={styles.copyright}>
          &copy; 2021-2023; all rights reserved
        </h2>
        <h3 className={styles.copyright_name}>Missing Link</h3>
      </div>
      <ul className={styles.footer_list}>
        <li className={styles.footer_link}>
          <a href="https://opendata.metlink.org.nz/apis">MetLink API</a>
        </li>
        <li className={styles.footer_link}>
          <a href="https://github.com/allister-grange/missinglink">
            Code for this site
          </a>
        </li>
      </ul>
    </footer>
  );
};
