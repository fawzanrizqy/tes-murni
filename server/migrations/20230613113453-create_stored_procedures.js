'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const createAverageQuery = `
      CREATE PROCEDURE calculate_average_score()
      BEGIN
        SELECT AVG(score) AS average_score
        FROM Data;
      END;
    `;
    await queryInterface.sequelize.query(createAverageQuery);

    const createModusQuery = `
      CREATE PROCEDURE calculate_modus_emotion()
      BEGIN
        SELECT name, emotion, COUNT(emotion) AS count
        FROM Data
        GROUP BY name, emotion
        HAVING COUNT(emotion) >= ALL (
          SELECT COUNT(emotion)
          FROM Data
          GROUP BY name, emotion
        );
      END;
    `;
    await queryInterface.sequelize.query(createModusQuery);

    const createCombineQuery = `
      CREATE PROCEDURE calculate_average_score_and_mode_emotion()
      BEGIN
        SELECT name, emotion, AVG(score) AS average_score
        FROM Data
        GROUP BY name, emotion
        HAVING (name, DATE('createdAt')) IN (
          SELECT name, DATE('createdAt')
          FROM Data
          GROUP BY name, DATE('createdAt')
          HAVING COUNT(*) > 1
        );
      END;
    `;
    await queryInterface.sequelize.query(createCombineQuery);
  },

  async down(queryInterface, Sequelize) {
    const dropAverageQuery = `
      DROP PROCEDURE IF EXISTS calculate_average_score;
    `;
    await queryInterface.sequelize.query(dropAverageQuery);

    const dropModusQuery = `
      DROP PROCEDURE IF EXISTS calculate_modus_emotion;
    `;
    await queryInterface.sequelize.query(dropModusQuery);

    const dropCombineQuery = `
      DROP PROCEDURE IF EXISTS calculate_average_score_and_mode_emotion;
    `;
    await queryInterface.sequelize.query(dropCombineQuery);
  }
};
