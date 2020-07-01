import express from 'express';
import FlickrClient from './FlickrClient';
import Photo from './models/Photo';
import cors from 'cors';
import dotevnt, { config } from 'dotenv';
import cache from 'memory-cache'; 

dotevnt.config(); // Still having problems with configuring the dotenv in FlickrClient

const app = express();
const cachingDuration = 30; //will save keys in memory for 30'

app.use(cors());

// configure cache middleware
let memCache = new cache.Cache();
let cacheMiddleware = (duration) => {
    return (req, res, next) => {
        let key =  '__express__' + req.originalUrl || req.url
        let cacheContent = memCache.get(key);
        if(cacheContent){
            res.send( cacheContent );
            return
        }else{
            res.sendResponse = res.send
            res.send = (body) => {
                memCache.put(key,body,duration*1000);
                res.sendResponse(body)
            }
            next()
        }
    }
}

/**
 * @route       /api/photos
 * @params -
 * @description Get all gallery photos from flickr API
 * @returns     An array of photos
 */

app.get("/api/photos", cacheMiddleware(cachingDuration) ,async (req, res) => {
    const clientData = await FlickrClient.getPhotos();
    if (clientData.error)
        res.status(401).send(clientData.message);
    else
        res.status(200).send(clientData.data);
});

/**
 * @route       /api/photos/:photoId
 * @params -    photoId (string)- the id of the single photo
 * @description Retrieves a single photo info based on its id from flickr
 * @returns     The specified photo information including its farm-id, secret, serve-id etc..
 */
app.get("/api/photos/:id", cacheMiddleware(cachingDuration),async (req, res) => {
    const id = req.params.id;
    const clientData = await FlickrClient.getPhotoInfo(id);

    if (clientData.error)
        res.status(401).send(clientData.message);
    else{
        //Getting only what is needed by instantiaing a destinated object Photo
        const aPhoto = new Photo(clientData.data.photo); 
        res.status(200).send(JSON.stringify(aPhoto));
    }
});


/**
 * @route       /api/search/:searchText
 * @params -    searchText (string), options ({page int, perPage int })
 * @description Get gallery photos from flickr API based on a search text
 * @returns     An array of photos
 */

app.get("/api/search/:searchText/:page?/:per_page?", cacheMiddleware(cachingDuration), async (req, res) => {
    
    const searchText = req.params.searchText;
    const page = req.params.page || 1;
    const per_page = req.params.per_page || 10;

    const clientData = await FlickrClient.searchPhotos(searchText, {page: page, perPage: per_page});
    if (clientData.error)
        res.status(401).send(clientData.message);
    else{
        res.status(200).send(clientData.data);
    }
});

app.listen(2134, () => { console.log('Server started at "http://localhost:2134"') });
