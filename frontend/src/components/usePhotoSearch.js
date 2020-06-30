
import { useEffect, useState } from 'react';
import axios from 'axios';

function usePhotoSearch(query, pageNumber, perPage) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [photos, setPhotos] = useState([]);
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
            setPhotos((prevPhotos) => {
                return [...new Set([...prevPhotos, ...result.data.photos.photo.map((p) => {
                    return 'https://farm' + p.farm + '.staticflickr.com/' + p.server + '/' + p.id + '_' + p.secret + '.jpg';
                })])]
            });
            setRequestMorePhotos(result.data.photos.photo.length > 0);
            setLoading(false);

        }).catch((err) => {
            if (axios.isCancel(err)) return;
            else if (query === '') return;

            setError(true);
        });

        return () => cancel;
    }, [query, pageNumber])



    return { loading, error, photos, requestMorePhotos };
}


export default usePhotoSearch;