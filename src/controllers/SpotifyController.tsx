export default class SpotifyController {
    
    public query( query:string ) {      
        return fetch( `/query?q=${query}` )
            .then( ( response ) => response.json() )
            .then( ( response ) => {            
                let mappedData = this.MapData( response );           
                return mappedData;
            },
            (error) => {
                console.error( error );    
            }            
        )
    }


    MapData ( data: Array<any> ) {       
        return data;
    }

}