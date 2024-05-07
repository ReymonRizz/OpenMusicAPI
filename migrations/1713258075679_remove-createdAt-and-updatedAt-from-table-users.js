exports.up = (pgm) => {
    pgm.dropColumn('users', 'created_at');
};

exports.down = (pgm) => {
    pgm.addColumn('users', {
        created_at: {
            type: 'text',
            notNull: true,
        },
    });
};
