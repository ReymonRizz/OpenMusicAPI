const mapDBToModelAlbums = ({
    id,
    name,
    year,
    created_at,
    updated_at
}) => ({
    id,
    name,
    year,
    createdAt : created_at,
    updatedAt : updated_at,
});


const mapDBToModelSongs = ({
    id, 
    title, 
    year, 
    performer,
    genre,
    duration,
    album_id,
    created_at,
    updated_at,
}) => ({
    id, 
    title, 
    year,
    performer,
    genre, 
    duration,
    albumId : album_id,
    createdAt : created_at,
    updatedAt : updated_at
});

const mapDBToAlbumSongService = ({
    id, 
    name, 
    year, 
}, song) => ({
    id, 
    name,
    year, 
    songs: song,
});

const mapDBToPlaylistSong = (playlistData, songData) => ({
    playlist: {
        id: playlistData.id,
        name: playlistData.name,
        username: playlistData.username,
        songs: songData,
    },
});

const mapDBToPlaylistActivity = (playlistId, activities) => ({
    playlistId: playlistId,
    activities: activities,
});

const mapDBToAlbumLike = (count) => ({
    likes: parseInt(count),
});

module.exports = { mapDBToModelAlbums, mapDBToModelSongs, mapDBToAlbumSongService, mapDBToPlaylistSong, mapDBToPlaylistActivity, mapDBToAlbumLike }