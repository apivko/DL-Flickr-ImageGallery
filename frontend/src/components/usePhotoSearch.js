
import { useEffect, useState } from 'react';
import axios from 'axios';

function usePhotoSearch(query, pageNumber, perPage) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [scrolling, setScrolling] = useState(false);
    const [requestMorePhotos, setRequestMorePhotos] = useState(false);

    useEffect(() => {
        setPhotos([]);
    }, [query])

    useEffect(() => {
        let cancel;

        if (query === '')
            return
        
        setLoading(true);
        setError(false);

        axios({
            method: 'GET',
            url: 'http://localhost:2134/api/search/' + query + '/' + pageNumber +'/'+ perPage,
            params: {
                cancelToken: new axios.CancelToken(c => cancel = c)
            }
        }).then((result) => {
            if (!result.data.photos)
                throw 'Photos Not Found'; 
            setPhotos((prevPhotos) => {
                let regex = new RegExp(query,'gi'); // in order to filter only images that contain the searchText in their title
                return [...new Set([...prevPhotos, ...result.data.photos.photo.filter(p=>p.title.match(regex)!==null).map((p) => {
                    return 'https://farm' + p.farm + '.staticflickr.com/' + p.server + '/' + p.id + '_' + p.secret + '.jpg';
                })])]
            });
            setRequestMorePhotos(result.data.photos.photo.length > 0);
            setLoading(false);
            setScrolling(false);

        }).catch((err) => {
            if (axios.isCancel(err)) return;
            else if (query === '') return;

            setError(true);
        });

        return () => cancel;
    }, [query, pageNumber])

    return { loading, error, photos, requestMorePhotos, scrolling };
}


export default usePhotoSearch;