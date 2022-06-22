
import { useEffect, useState } from 'react';
import axios from 'axios';
import $ from 'jquery';
import { motion } from 'framer-motion';

export default function MarketPlace() {

    useEffect(() => {
        axios('/api/opensea/opensea').then((data) => {
            let topCollections = data['data'];

            topCollections['collections'].forEach((collection) => {
                let collectionToAppend = `<li> ${collection.name } </li>`;
                let collectionImageToAppend = `<img src=${collection.image_url} width=500 height=500 />`;
                $("#listCollection").append(collectionToAppend);
                $("#listCollection").append(collectionImageToAppend);
            })

        })
    })
   
    return (
        <ul id="listCollection">

        </ul>
    );
}
