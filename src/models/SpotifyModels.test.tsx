import { mapArtist, mapAlbum, mapTrack, SpotifyArtist, SpotifyAlbum, SpotifyTrack } from "./SpotifyModels";

let spotifyArtist: SpotifyArtist = {
  id: 'test-artist-id',
  type: 'test-artist-type',
  name: 'test-artist-name',
  href: 'test-artist-href',
  uri: 'test-artist-uri',
  followers: {
      total: 100
  },
  images: [
    {
      width: 100,
      height: 100,
      url: 'test-artist-image-url'
    }
  ],
  genres: ['test-artist-genre'],
  popularity: 100   
};

let spotifyAlbum: SpotifyAlbum = {
  id: 'test-album-id',
  type: 'test-album-type',
  name: 'test-album-name',
  href: 'test-album-href',
  uri: 'test-album-uri',
  artists: [spotifyArtist],
  release_date: '2020-01-01',
  total_tracks: 100,
  images: [  {
    width: 100,
    height: 100,
    url: 'test-album-image-url'
  }],
  album_type: 'test-album-type' 
};

let spotifyTrack: SpotifyTrack = {
  id: 'test-track-id',
  type: 'test-track-type',
  name: 'test-track-name',
  href: 'test-track-href',
  uri: 'test-track-uri',
  album: spotifyAlbum,
  artists: [spotifyArtist],
  available_markets: [ 'test-track-market' ],
  disc_number: 1,
  duration_ms: 60000,
  explicit: true,
  is_local: false,
  popularity: 100,
  track_number: 1,
  preview_url: 'test-track-preview-url',
  external_ids: {
      isrc: 'test-track-external-id'
  } 
};


test('maps data from SpotifyArtist', () => {

  let mappedArtist = mapArtist( spotifyArtist );

  expect( mappedArtist.id ).toBe( 'test-artist-id' );
  expect( mappedArtist.image ).toBe( 'test-artist-image-url' );
  expect( mappedArtist.name ).toBe( 'test-artist-name' );
  expect( mappedArtist.parent_id ).toBe( '' );
  expect( mappedArtist.type ).toBe( 'artist' );
  expect( mappedArtist.meta ).toBe( spotifyArtist );

});

test('maps data from SpotifyAlbum', () => {

  let mappedAlbum = mapAlbum( spotifyAlbum );

  expect( mappedAlbum.id ).toBe( 'test-album-id' );
  expect( mappedAlbum.image ).toBe( 'test-album-image-url' );
  expect( mappedAlbum.name ).toBe( '(2020) - test-album-name' );
  expect( mappedAlbum.parent_id ).toBe( 'test-artist-id' );
  expect( mappedAlbum.type ).toBe( 'album' );
  expect( mappedAlbum.meta ).toBe( spotifyAlbum );

});

test('maps data from SpotifyTrack', () => {

  let mappedTrack = mapTrack( spotifyTrack );

  expect( mappedTrack.id ).toBe( 'test-track-id' );
  expect( mappedTrack.image ).toBe( 'test-album-image-url' );
  expect( mappedTrack.name ).toBe( 'test-track-name' );
  expect( mappedTrack.parent_id ).toBe( 'test-album-id' );
  expect( mappedTrack.type ).toBe( 'track' );
  expect( mappedTrack.meta ).toBe( spotifyTrack );

});