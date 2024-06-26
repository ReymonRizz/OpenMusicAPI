require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

//ALBUMS
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');

//SONGS
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

//USERS
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// AUTHENTICATIONS
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// PLAYLISTS
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const {PlaylistsValidator} = require('./validator/playlists');

// COLLABORATIONS
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const {CollaborationsValidator} = require('./validator/collaborations');

// Activities
const ActivityService = require('./services/postgres/ActivitiesService');

// CACHE
const CacheService = require('./services/CacheService');



const ClientError = require('./exceptions/ClientError');
 
const init = async () => {
  const cacheService = new CacheService();
  const albumsService = new AlbumsService(cacheService);
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const activityService = new ActivityService();
  const collaborationsService = new CollaborationsService(usersService);
  const collaborationsValidator = new CollaborationsValidator();
  const playlistsService = new PlaylistsService(songsService, activityService, collaborationsService);
  const playlistsValidator = new PlaylistsValidator();
  
 
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

   // registrasi plugin eksternal
   await server.register([
    {
      plugin: Jwt,
    },
  ]);

   // mendefinisikan strategy autentikasi jwt
   server.auth.strategy('openmusicapi_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });
 
  await server.register([
  {
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumsValidator
    },
  },
  {
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator
    },
  },
  {
    plugin: users,
    options: {
      service: usersService,
      validator: UsersValidator,
    },
  },
  {
    plugin: authentications,
    options: {
      authenticationsService,
      usersService,
      tokenManager: TokenManager,
      validator: AuthenticationsValidator,
    },
  },
  {
    plugin: playlists,
    options: {
        service: playlistsService,
        validator: playlistsValidator,
    }, 
},
{
  plugin: collaborations,
  options: {
    collaborationsService,
    playlistsService,
    validator: collaborationsValidator,
  },
},
]);

server.ext('onPreResponse', (request, h) => {
  // mendapatkan konteks response dari request
  const { response } = request;


  if (response instanceof Error) {

    // penanganan client error secara internal.
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }


    // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
    if (!response.isServer) {
      return h.continue;
    }


    // penanganan server error sesuai kebutuhan
    console.log(response)
    const newResponse = h.response({
      status: 'error',
      message: 'terjadi kegagalan pada server kami',
    });
    newResponse.code(500);
    return newResponse;
  }


  // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
  return h.continue;
});
 
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};
 
init();