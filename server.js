/**
 * This is an example of a basic node.js script that performs
 * the Client Credentials oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
 */
 require('dotenv').config();

 var request = require('request'); // "Request" library
 var express = require('express');
 
var { graphqlHTTP } = require('express-graphql');
const graphql = require('graphql')

 var client_id = 'c125d728642049e6ac238098f7560681'; // Your client id
 var client_secret = process.env.CLIENT_SECRET; // Your secret
 
 var api_url = 'https://api.spotify.com/v1/';
 
 
 
 var app = express();
 
 var getEndpoint = function( path, query ) {
   return query ? `${api_url}${path}?${query}` : `${api_url}${path}`; 
 }
 
 var getAccessToken = new Promise( ( resolve, reject ) => {
   // your application requests authorization
   var authOptions = {
     url: 'https://accounts.spotify.com/api/token',
     headers: {
       'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
     },
     form: {
       grant_type: 'client_credentials'
     },
     json: true
   };
 
   request.post(authOptions, function(error, response, body) {
     if (!error && response.statusCode === 200) {
       // use the access token to access the Spotify Web API
       resolve(body.access_token);      
     } else {
       reject();
     }
   });
 } );
 
  var doSearch = function( token, query, type, limit, offset ) {    
    return doRequest( token, getEndpoint('search', `q=${query}&type=${type}&limit=${limit}&offset=${offset}`) );
  };

  var getArtist = function( token, id ) {    
    return doRequest( token, getEndpoint(`artists/${id}`) );
  };  
  
  var getAlbums = function( token, artist_id, limit ) {    
    return doRequest( token, getEndpoint(`artists/${artist_id}/albums`, `limit=${limit}`) );
  };
  
  var getAlbum = function( token, album_id ) {    
    return doRequest( token, getEndpoint(`albums/${album_id}`) );
  };
  
  var getTracks = function( token, album_id, limit ) {    
    return doRequest( token, getEndpoint(`albums/${album_id}/tracks`, `limit=${limit}`) );
  };
  
  var getTrack = function( token, track_id ) {    
    return doRequest( token, getEndpoint(`tracks/${track_id}`) );
  };

  var doRequest = function (token, url) {
    var options = {
      url: url,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };

    return new Promise( ( resolve, reject ) => {
        request.get(options,  (error, response, body) => {
        if( !error ) {
          resolve( body );
        } else {
          reject();
        }      
      });
    } );
  };
 
 
 
 app.use('/query', (req, res) => {
   getAccessToken.then( ( token ) => {    
     doSearch( token, req.query.q, req.query.type, req.query.limit, req.query.offset).then( ( body ) => {  
       res.send( body );
     }); 
   });
 });
 
 app.use('/artists', (req, res) => {
  getAccessToken.then( ( token ) => {    
    getArtist( token, req.query.artist_id).then( ( body ) => {  
      res.send( body );
    }); 
  });
});

app.use('/albums', (req, res) => {
  getAccessToken.then( ( token ) => {    
    if( req.query.artist_id ) {
      getAlbums( token, req.query.artist_id, req.query.limit ).then( ( body ) => {  
        res.send( body );
      }); 
    } else if( req.query.album_id ) {
      getAlbum( token, req.query.album_id ).then( ( body ) => {  
        res.send( body );
      }); 
    } else {
      res.errored();
    }
  });
});

app.use('/tracks', (req, res) => {
  getAccessToken.then( ( token ) => {    
    if( req.query.album_id ) {
      getTracks( token, req.query.album_id, req.query.limit ).then( ( body ) => {  
        res.send( body );
      }); 
    } else if( req.query.track_id ) {
      getTrack( token, req.query.track_id ).then( ( body ) => {  
        res.send( body );
      }); 
    } else {
      res.errored();
    }
  });
});


const Artist = new graphql.GraphQLObjectType({
  name: 'Artist',
  fields: () => ({
    id: { type: graphql.GraphQLString },   
  })
});
const Album = new graphql.GraphQLObjectType({
  name: 'Album',
  fields: () => ({
    id: { type: graphql.GraphQLString },   
  })
});

function mapItem( item ) {
  return {
    id: item.id
  }
}


const QueryRoot = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    artist: {
      args: {
        id: {
          type: graphql.GraphQLInt
        }
      },
      type: Artist,
      resolve: (parent, args, context, resolveInfo) => {
        return;
      }
    } ,
    album: {
      args: {
        id: {
          type: graphql.GraphQLInt
        }
      },
      type: Album,
      resolve: (parent, args, context, resolveInfo) => {
        return;
      }
    }    
  })
});
    
const schema = new graphql.GraphQLSchema({ query: QueryRoot });

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

app.use(express.static('public'));

app.listen(4000, () => console.log('Now browse to localhost:4000/query'));