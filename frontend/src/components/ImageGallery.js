import React, { useState } from 'react';
import usePhotoSearch from './usePhotoSearch';

import '../css/style.css';

function ImageGallery() {

  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  const searchHandler = (e) => {

    setQuery(e.target.value);
    setPageNumber(1);

  }
  const { loading, error, photos/*, requestMorePhotos*/ } = usePhotoSearch(query, pageNumber);
  return (<div className="imageGalleryContainer">
    <div className="header"><h1>Image Gallery</h1></div>
    <div className="searchField">
      <span className="question">What photos would you like to search today? </span>
      <br />
      <input type="text" value={query} onChange={searchHandler}></input>
    </div>
    <div>
      <ul className="photos">
        {photos.map((p, i) => {
          return <li key={i}><div className="photo"><img src={p} alt={i} /></div></li>;
        })}
      </ul>
    </div>
    <div className="loading">{loading && !error && 'Loading...'}</div>
    <div className="error">{error && query !== '' && 'Error'}</div>
  </div>)
}


export default ImageGallery;