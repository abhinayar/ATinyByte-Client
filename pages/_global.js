import React from "react";
import Head from 'next/head';
import styles from "../global.scss";

export default props => (
  <div>
    <Head>
      <link href="https://fonts.googleapis.com/css?family=Poppins:400,700,900" rel="stylesheet"/>
      <link href="https://fonts.googleapis.com/css?family=Karla:400,700" rel="stylesheet"/>
    </Head>
    {props.children}
    <style jsx global>{styles}</style>
  </div>
);
