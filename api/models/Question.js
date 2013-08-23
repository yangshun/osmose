/**
 * Question
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {
  	question_id: 'INT',
  	user_id: 'INT',
  	title: 'STRING',
  	content: 'TEXT',
  	course_id: 'INT',
  	deleted: 'BOOLEAN'
  }

};
