'use strict';
module.exports = (Sequelize, sequelize) => {
    return sequelize.define('domainUsers', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    });
};