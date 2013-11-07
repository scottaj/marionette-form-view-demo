require.define 'task_model': (exports, require, module) ->
  module.exports = class TaskModel extends Backbone.Model

    urlRoot: '/tasks'

    validation:
      name:
        required: true
      priority:
        required: true
        oneOf: [1, 2, 3]