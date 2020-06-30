
function Photo(options) {

    this.id = options.id;
    this.secret = options.secret;
    this.server = options.server;
    this.farm = options.farm;
    this.title = options.title;

    //Combine them all to get the src of the image
    //https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
    this.src = 'https://farm' + this.farm + '.staticflickr.com/' + this.server + '/' + this.id + '_' + this.secret + '.jpg';
}

export default Photo