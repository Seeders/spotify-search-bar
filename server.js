/**
 * This is an example of a basic node.js script that performs
 * the Client Credentials oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
 */

 var request = require('request'); // "Request" library
 var express = require('express');
 
var { graphqlHTTP } = require('express-graphql');
const graphql = require('graphql')

 var client_id = ''; // Your client id
 var client_secret = ''; // Your secret
 
 var api_url = 'https://api.spotify.com/v1/';
 
 
 
 var app = express();
 
 var getEndpoint = function( path, query ) {
   return `${api_url}${path}?${query}`; 
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
 
 
 
 var doSearch = function( token, query ) {
 
   var options = {
     url: getEndpoint('search', `q=${query}&type=track,artist,album`),
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
 }
 
 
 
 app.use('/query', (req) => {
   getAccessToken.then( ( token ) => {    
     console.log( token );
     doSearch( token, 'Nirvana').then( ( body ) => {
       console.log( body );  
     });
 
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