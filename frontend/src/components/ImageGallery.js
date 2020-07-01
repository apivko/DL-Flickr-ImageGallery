import React, { useState } from 'react';
import usePhotoSearch from './usePhotoSearch';

import '../css/style.css';

//Lightbox to traverse images in modal view
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; 

function ImageGallery() {
  //searchText 
  const [query, setQuery] = useState('');
  //pagination vars
  const [pageNumber, setPageNumber] = useState(1); 
  const [perPage, setPerPage] = useState(10);
  //modal vars
  const [modal, setModal] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const requestMorePhotosHandler = ()=> {

    setPageNumber(pageNumber+1);
    setPerPage(perPage);
  }

  //on image click
  const openModalHandler = (index)=>{
    
    setPhotoIndex(index);
    setModal(true);
  } 

  //on search typing
  const searchHandler = (e) => {

    setQuery(e.target.value);
    setPageNumber(1);
    // setPerPage(10);
  }

  const { loading, error, photos, requestMorePhotos} = usePhotoSearch(query, pageNumber, perPage);
  
  return (<div className="imageGalleryContainer">
    <div className="header"><h1>Image Gallery</h1></div>
    <div className="searchField">
      <span className="question">What photos would you like to search today?</span>
      <br />
      <input type="text" value={query} onChange={searchHandler}></input>
    </div>
    <div>
      <ul className="photos">
        {query !== '' && photos.map((p, i) => {
          return <li key={i}><div className="photo">
            <img onClick={()=>openModalHandler(i)} src={p} alt={i} />
          </div>
          </li>;
        })}
      </ul>
      {requestMorePhotos && <button type="button" onClick={requestMorePhotosHandler}>Load more...</button>}
    </div>
    <div className="loading">{loading && !error && 'Loading...'}</div>
    <div className="error">{error && query !== '' && 'Error'}</div>
    <div>
    {/**
     * Lightbox to traverse images in modal view
     * ----------------------------------------
     */
      modal && (
      <Lightbox
        mainSrc={photos[photoIndex]}
        nextSrc={photos[(photoIndex + 1) % photos.length]}
        prevSrc={photos[(photoIndex + photos.length - 1) % photos.length]}
        onCloseRequest={() => setModal(false)}
        onMovePrevRequest={() =>
          setPhotoIndex(photoIndex + photos.length - 1) % photos.length}
        onMoveNextRequest={() =>
          setPhotoIndex(photoIndex + 1) % photos.length}
      />
    )}
  </div>
  </div>
 
  )
}


export default ImageGallery;