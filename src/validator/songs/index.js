const InvariantError = require('../../exceptions/InvariantError');
const { SongPayloadSchema } = require("./scheme");

const SongsValidator = {
    validateSongPayload: (payload) => {
        const validationResult = SongPayloadSchema.validate(payload);
        if(validationResult.error){
            throw new InvariantError(validationResult.error.message)
        }
    }
}

module.exports = SongsValidator;