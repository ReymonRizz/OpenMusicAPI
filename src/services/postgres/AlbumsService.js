const { Pool } = require('pg');
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModelAlbums } = require('../../utils');
const { mapDBToAlbumLike } = require('../../utils');


class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbumLike(albumId, userId) {
    const id = 'albumLike-' + nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
        text: 'INSERT INTO user_album_likes VALUES($1, $2, $3, $4, $5) RETURNING id',
        values: [id, userId, albumId, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id){
        throw new InvariantError('data album like tidak dapat ditambahkan');
    }
    
    await this._cacheService.delete(`album:${albumId}`);
}

  async getAlbumLike(albumId) {
    try {
      const result = await this._cacheService.get(`album:${albumId}`);
      return {result: JSON.parse(result), isCache: true};

    } catch (error) {
        const query = {
            text: 'SELECT COUNT(album_id) FROM user_album_likes WHERE album_id = $1',
            values: [albumId],
        };

        const result = await this._pool.query(query);

        const resultMapped = mapDBToAlbumLike(result.rows[0].count);

        await this._cacheService.set(`album:${albumId}`, JSON.stringify(resultMapped));

        return {result: resultMapped};
    }
  }

  async deleteAlbumLike(albumId, userId) {
    const query = {
        text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
        values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length){
        throw new NotFoundError('Like gagal dihapus. Id tidak ditemukan');
    }

    await this._cacheService.delete(`album:${albumId}`);
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums (id, name, year, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const queryAlbum = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const resultAlbum = await this._pool.query(queryAlbum);

    if (!resultAlbum.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const querySong = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM albums JOIN songs ON albums.id = songs.album_id WHERE albums.id = $1',
      values: [id],
    };

    const resultSong = await this._pool.query(querySong);

    return { album : resultAlbum.rows.map(mapDBToModelAlbums)[0], songs: resultSong.rows} ;
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui Album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyExistUser(albumId, userId) {
    const query = {
        text: 'SELECT * FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
        values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length) {
        throw new InvariantError('Album Sudah disukai');
    }
  }
}

module.exports = AlbumsService;