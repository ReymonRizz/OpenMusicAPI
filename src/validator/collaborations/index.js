const InvariantError = require('../../exceptions/InvariantError');
const {CollaborationPayloadSchema} = require('./scheme');

class CollaborationsValidator {
    validateCollaborationPayload = (payload) => {
        const validationResult = CollaborationPayloadSchema.validate(payload); 

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }

        return validationResult.value;
    };
};

module.exports = {CollaborationsValidator};