require.define 'tasks_view': (exports, require, module) ->

  TaskView = require 'task_view'

  module.exports = class TasksView extends Backbone.Marionette.CompositeView

    template: require 'templates/tasks_template'

    className: 'task-list-wrapper'

    itemViewContainer: 'ul'

    itemView: TaskView

    initialize: ->
      @listenTo Backbone, 'task:create', (model) ->
         @collection.add(model)
         @collection.trigger 'reset' # To sort