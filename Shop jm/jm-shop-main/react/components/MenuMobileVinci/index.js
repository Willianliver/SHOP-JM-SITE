import React from 'react';
import { canUseDOM } from 'vtex.render-runtime';
// import { Spinner } from 'vtex.styleguide'
import { useState, useEffect } from "react";
import { Drawer, DrawerHeader, DrawerCloseButton } from 'vtex.store-drawer'
import axios from 'axios';
import styles from "./style.css";
// import categorias from '../Categorias';

export default function MenuMobileVinci() {
  const [categories, setCategories] = useState([]);


  useEffect(() => {
    axios.get('/api/catalog_system/pub/category/tree/4')
        .then(function (response) {
            // console.log("TESTE")
            // console.log(response)
            // console.log(response.data)
            const categories = response.data.find(item => item.name === "Shop JM")
            
            setCategories(categories.children);
        })
}, []);

  // useEffect(() => {
  //   fetch("/api/catalog_system/pub/category/tree/4")
  //     .then(response => response.json())
  //     .then(data => {
  //       // data.unshift({
  //       //   name: "Novidades",
  //       //   url: "/140?map=productClusterIds"
  //       // });
  //       setCategories(data)
  //     })
  // }, []);


  if (canUseDOM) {
    return <Drawer
      header={
        <DrawerHeader>
          <DrawerCloseButton />
        </DrawerHeader>
      }
    >
      <ul className={styles.ul}>
        {
          categories.map((category, index) => {
            return <li key={index}>
              <a href={category.url}>{category.name}</a>
            </li>
          })
        }
      </ul>
    </Drawer>
  } else {
    return <div></div>;
  }
}