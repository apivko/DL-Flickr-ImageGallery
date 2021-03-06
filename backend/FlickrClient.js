import config from './config';
import fetch from 'node-fetch';

const api_key = config.FLICKR_API_KEY;
const flickrUrl = 'https://api.flickr.com/services/rest/';
const format = 'json';

/**
 * A singleton client to connect with Flickr
 */

class FlickrClient {
    constructor() {
        if (!FlickrClient.instance) {
            this.galleryId = '66911286-72157647277042064';
            this.cachedPhotos = {};
            FlickrClient.instance = this;
        }
        return FlickrClient.instance;
    }
    setGalleryId(galleryId) {
        this.galleryId = galleryId;
        this.cacheSize = 100;
        this.cachedPhotos = {}; //empty the already cached photos 
    }
    //Builds a flickr api url from a method and optional parameters 
    buildUrl (method, params){
        let url = flickrUrl + '?' + 'method=' + method  
                            + '&api_key=' + '0fc0d3e04c56d2dd7f799a2e97ec6c7d'
                            + '&gallery_id=' + this.galleryId
                            + '&format=' + format
                            + '&nojsoncallback=1';
        if (params) {
            Object.values(params).forEach((p) => {
                url += p;
            });
        }
        return url;
    }
    //Fetches data from flickr - async
    async getUrlData(url) {
        try {
            const data = await fetch(url);
            if (data.fail)
                throw data.message;
            const json = await data.json();
            return { data: json };
        } catch (error) {
            return { error: true, message: 'Error - Could not retrieve photos from server\n\\' + error }
        }
    }

    //gets all photos from in a gallery
    //https://api.flickr.com/services/rest?method=flickr.galleries.getPhotos&api_key=0fc0d3e04c56d2dd7f799a2e97ec6c7d&gallery_id=66911286-72157647277042064&format=json&nojsoncallback=1
    getPhotos() {
        const method = 'flickr.galleries.getPhotos';
        const url = this.buildUrl(method);
        return this.getUrlData(url);
    }

    //Retrieves a single photo info based on its id from flickr
    //https://api.flickr.com/services/rest?method=flickr.photos.getInfo&api_key=0fc0d3e04c56d2dd7f799a2e97ec6c7d&gallery_id=66911286-72157647277042064&photo_id=8432423659&format=json&nojsoncallback=1
    getPhotoInfo(photoId) {
        const method = 'flickr.photos.getInfo';
        const params = {
            photoId: '&photo_id=' + photoId
        }
        const url = this.buildUrl(method, params);

        return this.getUrlData(url);
    }


    //Search flickrs photos in gallery based on a specified text 
    //https://api.flickr.com/services/rest?method=flickr.photos.search&api_key=0fc0d3e04c56d2dd7f799a2e97ec6c7d&gallery_id=66911286-72157647277042064&text=dog&format=json&nojsoncallback=1
    searchPhotos(searchText,options) {
        const method = 'flickr.photos.search';
        const page = options.page;
        const perPage = options.perPage;

        const params = {
            text: '&text=' + searchText,
            page: '&page=' + page,
            perPage: '&per_page=' + perPage
        }
        const url = this.buildUrl(method,params);
        return this.getUrlData(url);
    }

    //Empty the already cached photos 
    clearCache() {
        this.cachedPhotos = {};
    }

    //Set new cache size
    setCachSize(newCacheSize) {
        this.cacheSize = isNaN(newCacheSize) || newCacheSize > 300 ? DEFAULT_CACHE_SIZE : newCacheSize;
    }
}

const singletonFlickClient = new FlickrClient();
Object.freeze(singletonFlickClient);

export default singletonFlickClient;