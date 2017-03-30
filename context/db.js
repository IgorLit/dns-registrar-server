'use strict';
module.exports = (Sequelize, config) => {
    const options = {
        host: config.prod.host,
        dialect: config.prod.dialect,
        logging: false,
        define: {
            timestamps: true,
            paranoid: true,
            defaultScope: {
                where: {
                    deletedAt: {$eq: null}
                }
            }
        }
    };

    const sequelize = new Sequelize(config.prod.name, config.prod.user, config.prod.password, options);
    const User = require('../models/user')(Sequelize, sequelize);
    const Domain = require('../models/domain')(Sequelize, sequelize);

    Domain.belongsTo(User);
    User.hasMany(Domain);

    return {
        user: User,
        domain: Domain,
        sequelize: sequelize
    };
};