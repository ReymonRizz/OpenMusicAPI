class SongsHandler {
    constructor(service, validator) {
      this._service = service;
      this._validator = validator;
    
      this.postSongHandler = this.postSongHandler.bind(this);
      this.getSongsHandler = this.getSongsHandler.bind(this);
      this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
      this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
      this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }
    
    async postSongHandler(request, h) {
      this._validator.validateSongPayload(request.payload);
      const { title, year, genre, performer, duration, albumId } = request.payload;
    
      const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId });
    
      const response = h.response({
        status: 'success',
        message: 'Musik berhasil ditambahkan',
        data: {
          songId,
        },
      });
      response.code(201);
      return response;
    }
    
    async getSongsHandler(request, h) {
      const queryParams = request.query;

      const songs = await this._service.getSongs(queryParams);

      const response = h.response({
          status: 'success',
          data: {
              songs: songs,
          },
      });
      return response;
  }
    
    async getSongByIdHandler(request, h) {
      const { id } = request.params;
      const song = await this._service.getSongById(id);
      return {
        status: 'success',
        data: {
          song,
        },
      };
    }
    
    async putSongByIdHandler(request, h) {
      this._validator.validateSongPayload(request.payload);
      const { id } = request.params;
    
      await this._service.editSongById(id, request.payload);
    
      return {
        status: 'success',
        message: 'Musik berhasil diperbarui',
      };
    }
    
    async deleteSongByIdHandler(request, h) {
      const { id } = request.params;
      await this._service.deleteSongById(id);
    
      return {
        status: 'success',
        message: 'Musik berhasil dihapus',
      };
    }
   }
    
   module.exports = SongsHandler;