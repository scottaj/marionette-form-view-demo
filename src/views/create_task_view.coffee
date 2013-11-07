require.define 'create_task_view': (exports, require, module) ->
  FormView = require 'form_view'
  TaskModel = require 'task_model'

  module.exports = class CreateTaskView extends FormView

    template: require 'templates/create_task_template'

    className: 'task-form'

    ui:
      name: '[name="name"]'
      priority: '[name="priority"]'
      activityIndicator: '.loading'

    createModel: -> new TaskModel

    updateModel: ->
      @model.set
        name: @ui.name.val()
        priority: parseInt @ui.priority.val()

      console.log @model

    onSuccess: (model) ->
      Backbone.trigger 'task:create', model