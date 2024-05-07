exports.up = (pgm) => {
    pgm.dropColumn('albums', 'cover');
};

exports.down = (pgm) => {
    pgm.addColumn('albums', {
        cover: {
            type: 'text',
            notNull: false,
        },
    });
};
