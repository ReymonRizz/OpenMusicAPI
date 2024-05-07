
const {mapDBToAlbumSongService} = require('../../utils');

class AlbumsHandler {
    constructor(service, validator) {
      this._service = service;
      this._validator = validator;
    
      this.postAlbumHandler = this.postAlbumHandler.bind(this);
      this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
      this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
      this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);

      this.postAlbumLikeHandler = this.postAlbumLikeHandler.bind(this);
      this.deleteAlbumLikeHandler = this.deleteAlbumLikeHandler.bind(this);
      this.getAlbumLikeHandler = this.getAlbumLikeHandler.bind(this);
    }
    
    async postAlbumHandler(request, h) {
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
    
      const albumId = await this._service.addAlbum({ name, year });
    
      const response = h.response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
          albumId,
        },
      });
      response.code(201);
      return response;
    }
    
    async getAlbumByIdHandler(request, h) {
      const { id } = request.params;
      const album = await this._service.getAlbumById(id);

      const resultMappingAlbum = mapDBToAlbumSongService(album.album, album.songs);
      
      const response = h.response({
        status: 'success',
        data: {
            album: resultMappingAlbum,
          },
      });
      return response;
    }
    
    async putAlbumByIdHandler(request, h) {
      this._validator.validateAlbumPayload(request.payload);
      const { id } = request.params;
    
      await this._service.editAlbumById(id, request.payload);
    
      return {
        status: 'success',
        message: 'Album berhasil diperbarui',
      };
    }
    
    async deleteAlbumByIdHandler(request, h) {
      const { id } = request.params;
      await this._service.deleteAlbumById(id);
    
      return {
        status: 'success',
        message: 'Album berhasil dihapus',
      };
    }

    async postAlbumLikeHandler(request, h) {
      const {id: credentialId} = request.auth.credentials;
      const {id} = request.params;

      await this._service.getAlbumById(id);

      await this._service.verifyExistUser(id, credentialId);
      
      await this._service.addAlbumLike(id, credentialId);

      const response = h.response({
          status: 'success',
          message: 'berhasil menyukai album',
      });
      response.code(201);
      return response;
  }

  async deleteAlbumLikeHandler(request, h) {
      const {id: credentialId} = request.auth.credentials;
      const {id} = request.params;
      
      await this._service.deleteAlbumLike(id, credentialId);

      const response = h.response({
          status: 'success',
          message: 'berhasil menyukai album',
      });
      response.code(200);
      return response;
  }

  async getAlbumLikeHandler(request, h) {
      const {id} = request.params;

      const result = await this._service.getAlbumLike(id);

      if (result.isCache == true) {
          const response = h.response({
              status: 'success',
              data: result.result,
          });
          response.header('X-Data-Source', 'cache');
          return response;
      }

      const response = h.response({
          status: 'success',
          data: result.result,
      });
      return response;
  }
} 

module.exports = AlbumsHandler;