'use strict';

const querystring = require('querystring');

// defines the allowed dimensions, default dimensions and how much variance from allowed
// dimension is allowed.
const variables = {
  allowedDimension : [
      {w:48,h:48}, {w:80,h:80}, {w:160,h:160}, {w:200,h:200},
      {w:592,h:296}, {w:680,h:382}, {w:1420,h:824}, {w:1200, h:630}, {w:800, h:2160}
    ],
  defaultDimension : {w:592,h:296},
  variance: 20,
  webpExtension: 'webp'
};

exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request;
  const headers = request.headers;

  // parse the querystrings key-value pairs. In our case it would be d=100x100
  const params = querystring.parse(request.querystring);

  // fetch the uri of original image
  let fwdUri = request.uri;

  // if there is no dimension attribute, just pass the request
  const pattern = /^[0-9]{2,4}x[0-9]{2,4}$/;
  if(!params.d || !pattern.test(params.d)) {
    callback(null, request);
    return;
  }

  // read the dimension parameter value = width x height and split it by 'x'
  const dimensionMatch = params.d.split("x");

  // set the width and height parameters
  let width = parseInt(dimensionMatch[0], 10);
  let height = parseInt(dimensionMatch[1], 10);

  // parse the prefix, image name and extension from the uri.
  // In our case /images/image.jpg
  const match = fwdUri.match(/(.*)\/(.*)\.(.*)/);

  let prefix = match[1];
  let imageName = match[2];
  let extension = match[3];

  // define variable to be set to true if requested dimension is allowed.
  let matchFound = false;

  // validate dimension
  for (let dimension of variables.allowedDimension) {
    if(width === dimension.w && height === dimension.h){
      matchFound = true;
      break;
    }
  }
  // if no match is found from allowed dimension with variance then set to default
  //dimensions.
  if(!matchFound){
    width = variables.defaultDimension.w;
    height = variables.defaultDimension.h;
  }

  // read the accept header to determine if webP is supported.
  let accept = headers['accept'] ? headers['accept'][0].value : "";

  let url = [];
  // build the new uri to be forwarded upstream
  url.push(prefix);
  url.push(width+"x"+height);

  // check support for webp
  if (accept.includes(variables.webpExtension)) {
    url.push(variables.webpExtension);
  }
  else{
    // png ファイルの場合、容量が増加するパターンがあったため、webp 未対応の場合は圧縮処理対象外とする
    if(extension === 'png' && width===800 && height===2160) {
      callback(null, request);
    }
    url.push(extension);
  }
  url.push(imageName+"."+extension);

  fwdUri = url.join("/");

  // final modified url is of format /images/200x200/webp/image.jpg
  request.uri = fwdUri;
  callback(null, request);
};
