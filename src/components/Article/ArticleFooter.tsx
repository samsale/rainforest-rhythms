import React from "react";
import styles from "./ArticleFooter.module.css";
import UP from "./up.png";

function ArticleFooter() {
  return (
    <footer className={styles.ArticleFooter}>
      <span>
        <a href="https://github.com/aaronSig/rainforest-rhythms">This website is open source</a>
      </span>
      <a href="https://weareup.co">
        <img alt="UP Logo" src={UP} />
      </a>
    </footer>
  );
}

export default ArticleFooter;
