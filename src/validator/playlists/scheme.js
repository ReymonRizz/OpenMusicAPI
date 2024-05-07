const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
    name: Joi.string().max(50).required(),
});

const PlaylistSongPayloadSchema = Joi.object({
    songId: Joi.string().required(),
});

module.exports = {PlaylistPayloadSchema, PlaylistSongPayloadSchema};