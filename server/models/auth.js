const knex = require('../dbConnect');
const bcrypt = require('bcryptjs');

module.exports = {
    insertUser: (username, password, email) => {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);

        return knex('users')
            .insert({
                username,
                email,
                password: hash,
                role: 'user' // Default role set to 'user'
            })
            .returning('*');
    },
    
    // Update user role (for Stripe webhook)
    updateUserRole: (userId, newRole) => {
        return knex('users')
            .where({ id: userId })
            .update({ role: newRole })
            .returning('*');
    },
    
    // Find user by email (for Stripe webhook)
    findUserByEmail: (email) => {
        return knex('users')
            .where({ email })
            .first();
    },

    /**
     * @param username {string} - Facebook displayName
     * @param profileId {string} - Facebook profile ID
     * @param avatar {string} - Facebook profile picture
     */
    insertFbUser: (username, profileId, avatar) => (
        knex('users')
            .insert({
                username,
                profile_id: profileId,
                password: '',
                avatar,
                role: 'user' // Default role for social login as well
            })
            .returning('*')
    ),
    queryUsers: () => knex('users'),
    queryUser: username => knex('users').select('*').where({ username }).first(),
    queryFbUser: id => knex('users').where({ profile_id: id }).first(),
};
