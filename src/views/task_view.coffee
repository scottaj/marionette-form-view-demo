require.define 'task_view': (exports, require, module) ->
  module.exports = class TasksView extends Backbone.Marionette.ItemView

    template: require 'templates/task_template'

    tagName: 'li'

    className: ->
      "task #{@_priorityClass()}"

    events: ->
      'click .delete': @deleteTask

    deleteTask: (e) ->
      @model.destroy()

    _priorityClass: ->
      switch @model.get 'priority'
        when 1 then 'low-priority'
        when 2 then 'normal-priority'
        when 3 then 'high-priority'
        else ''