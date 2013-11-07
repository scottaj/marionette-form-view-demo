require.define 'tasks_collection': (exports, require, module) ->
  module.exports = class TasksCollection extends Backbone.Collection

    comparator: (model) ->
       - model.get 'priority'