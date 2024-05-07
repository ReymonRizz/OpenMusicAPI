exports.up = (pgm) => {
    pgm.createTable('users', {
        id: {
            type: 'varchar(30)',
            primaryKey: true,
        },
        username: {
            type: 'varchar(30)',
            notNull: true,
        },
        password: {
            type: 'text',
            notNull: true,
        },
        fullname: {
            type: 'varchar(50)',
            notNull: true,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('users');
};