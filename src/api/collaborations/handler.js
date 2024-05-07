class CollaborationsHandler {
    constructor(collaborationsService, playlistsService, validator) {
        this._collaborationsService = collaborationsService;
        this._playlistsService = playlistsService;
        this._validator = validator;

        this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
        this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
    }

    async postCollaborationHandler(request, h) {
        const collaborationValidated = this._validator.validateCollaborationPayload(request.payload);
            
        const {id: credentialId} = request.auth.credentials;

        await this._playlistsService.verifyPlaylistOwner(collaborationValidated.playlistId, credentialId);

        const collaborationId = await this._collaborationsService.addCollaboration(collaborationValidated);

        const response = h.response({
            status: 'success',
            message: 'Kolaborasi berhasil ditambahkan',
            data: {
                collaborationId,
            },
        });
        response.code(201);
        return response;
    }

    async deleteCollaborationHandler(request, h) {
        const collaborationValidated = this._validator.validateCollaborationPayload(request.payload);
        const {id: credentialId} = request.auth.credentials;

        await this._playlistsService.verifyPlaylistOwner(collaborationValidated.playlistId, credentialId);

        await this._collaborationsService.deleteCollaboration(collaborationValidated)

        const response = h.response({
            status: 'success',
            message: 'Kolaborasi berhasil dihapus',
        });
        response.code(200);
        return response;
    }
}

module.exports = CollaborationsHandler;