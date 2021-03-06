'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    return queryInterface.bulkInsert('Messages', [
        {
            is_read: true,
            text: "hey James, what's up?",
            createdAt: new Date(),
            updatedAt: new Date(),
            recipientId: 2,
            authorId: 1,
            conversationId: 1
        },
        {
            is_read: false,
            text: "nothing much dude, do you want to talk about books?",
            createdAt: new Date(),
            updatedAt: new Date(),
            recipientId: 1,
            authorId: 2,
            conversationId: 1
        },
        {
            is_read: false,
            text: "Yeah man, I love books!",
            createdAt: new Date(),
            updatedAt: new Date(),
            recipientId: 2,
            authorId: 1,
            conversationId: 1
        },
    ])
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
