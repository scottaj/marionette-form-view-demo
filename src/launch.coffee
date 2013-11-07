$ ->
  CreateTaskView = require 'create_task_view'
  TasksView = require 'tasks_view'
  TasksCollection = require 'tasks_collection'

  Application = new Backbone.Marionette.Application
  window.Application = Application

  Application.addRegions
    form: '#form'
    results: '#results'

  Application.addInitializer (options) ->
    Application.form.show new CreateTaskView
    Application.results.show new TasksView collection: new TasksCollection

  Application.addInitializer (options) ->
    server = sinon.fakeServer.create()
    server.autoRespond = true
    server.respondWith /.*/, [200, {'Content-Type': 'application/json'}, '{}']

  Application.on 'initialize:after', (options) ->
    console.log 'post-init'

  Application.start()