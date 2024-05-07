const {PlaylistPayloadSchema, PlaylistSongPayloadSchema} = require('./scheme');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistsValidator {
    validatePlaylistPayload = (payload) => {
        const validationResult = PlaylistPayloadSchema.validate(payload);

        if (validationResult.error){
            throw new InvariantError(validationResult.error.message);
        }

        return validationResult.value;
    };

    validatePlaylistSongPayload = (payload) => {
        const validationResult = PlaylistSongPayloadSchema.validate(payload);

        if (validationResult.error){
            throw new InvariantError(validationResult.error.message);
        }

        return validationResult.value;
    };
};

module.exports = {PlaylistsValidator};