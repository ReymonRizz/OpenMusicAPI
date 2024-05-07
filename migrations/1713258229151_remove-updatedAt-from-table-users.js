exports.up = (pgm) => {
    pgm.dropColumn('users', 'updated_at');
};

exports.down = (pgm) => {
    pgm.addColumn('users', {
        updated_at: {
            type: 'text',
            notNull: true,
        },
    });
};
