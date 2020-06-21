import express from 'express';
import FlickrClient from './FlickrClient';
import dotevnt, { config } from 'dotenv';

dotevnt.config(); // Still having problems with configuring the dotenv in FlickrClient

const app = express();

/**
 * @route       /api/photos
 * @params -
 * @description Get all gallery photos from flickr API
 * @returns     An array of photos
 */

app.get("/api/photos", async (req,res)=>{
    const clientData = await FlickrClient.getPhotos();
    if (clientData.error)
        res.status(401).send(clientData.message);
    else
        res.status(200).send(clientData.data);
});

/**
 * @route       /api/search/:searchText
 * @params -    searchText
 * @description Get all gallery photos from flickr API
 * @returns     An array of photos
 */

app.get("/api/search/:searchText", async (req,res)=>{
    const searchText = req.params.searchText;
    const clientData = await FlickrClient.searchPhotos(searchText);
    if (clientData.error)
        res.status(401).send(clientData.message);
    else
        res.status(200).send(clientData.data);
});


app.listen(5000,()=>{console.log('Server started at "http://localhost:5000"')});
