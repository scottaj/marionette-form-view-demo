(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  require.define({
    'tasks_collection': function(exports, require, module) {
      var TasksCollection, _ref;
      return module.exports = TasksCollection = (function(_super) {
        __extends(TasksCollection, _super);

        function TasksCollection() {
          _ref = TasksCollection.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        TasksCollection.prototype.comparator = function(model) {
          return -model.get('priority');
        };

        return TasksCollection;

      })(Backbone.Collection);
    }
  });

  $(function() {
    var Application, CreateTaskView, TasksCollection, TasksView;
    CreateTaskView = require('create_task_view');
    TasksView = require('tasks_view');
    TasksCollection = require('tasks_collection');
    Application = new Backbone.Marionette.Application;
    window.Application = Application;
    Application.addRegions({
      form: '#form',
      results: '#results'
    });
    Application.addInitializer(function(options) {
      Application.form.show(new CreateTaskView);
      return Application.results.show(new TasksView({
        collection: new TasksCollection
      }));
    });
    Application.addInitializer(function(options) {
      var server;
      server = sinon.fakeServer.create();
      server.autoRespond = true;
      server.autoRespondAfter = 350;
      return server.respondWith(/.*/, [
        200, {
          'Content-Type': 'application/json'
        }, '{}'
      ]);
    });
    Application.on('initialize:after', function(options) {
      return console.log('post-init');
    });
    return Application.start();
  });

  require.define({
    'form_view': function(exports, require, module) {
      var FormView;
      return module.exports = FormView = (function(_super) {
        __extends(FormView, _super);

        function FormView() {
          this.invalid = __bind(this.invalid, this);
          this.valid = __bind(this.valid, this);
          FormView.__super__.constructor.apply(this, arguments);
          this.listenTo(this, 'render', this.hideActivityIndicator);
          this.listenTo(this, 'render', this.prepareModel);
          this.listenTo(this, 'save:form:success', this.success);
          this.listenTo(this, 'save:form:failure', this.failure);
        }

        FormView.prototype.delegateEvents = function(events) {
          this.ui = _.extend(this._baseUI(), _.result(this, 'ui'));
          this.events = _.extend(this._baseEvents(), _.result(this, 'events'));
          return FormView.__super__.delegateEvents.call(this, events);
        };

        FormView.prototype.tagName = 'form';

        FormView.prototype._baseUI = function() {
          return {
            submit: 'input[type="submit"]',
            activityIndicator: '.spinner'
          };
        };

        FormView.prototype._baseEvents = function() {
          var eventHash;
          eventHash = {
            'change [data-validation]': this.validateField,
            'blur [data-validation]': this.validateField,
            'keyup [data-validation]': this.validateField
          };
          eventHash["click " + this.ui.submit] = this.processForm;
          return eventHash;
        };

        FormView.prototype.createModel = function() {
          throw new Error('implement #createModel in your FormView subclass to return a Backbone model');
        };

        FormView.prototype.prepareModel = function() {
          this.model = this.createModel();
          return this.setupValidation();
        };

        FormView.prototype.validateField = function(e) {
          var validation, value;
          validation = $(e.target).attr('data-validation');
          value = $(e.target).val();
          if (this.model.preValidate(validation, value)) {
            return this.invalid(this, validation);
          } else {
            return this.valid(this, validation);
          }
        };

        FormView.prototype.processForm = function(e) {
          e.preventDefault();
          this.showActivityIndicator();
          this.updateModel();
          return this.saveModel();
        };

        FormView.prototype.updateModel = function() {
          throw new Error('implement #updateModel in your FormView subclass to update the attributes of @model');
        };

        FormView.prototype.saveModel = function() {
          var callbacks,
            _this = this;
          callbacks = {
            success: function() {
              return _this.trigger('save:form:success', _this.model);
            },
            error: function() {
              return _this.trigger('save:form:failure', _this.model);
            }
          };
          return this.model.save({}, callbacks);
        };

        FormView.prototype.success = function(model) {
          this.render();
          return this.onSuccess(model);
        };

        FormView.prototype.onSuccess = function(model) {
          return null;
        };

        FormView.prototype.failure = function(model) {
          this.hideActivityIndicator();
          return this.onFailure(model);
        };

        FormView.prototype.onFailure = function(model) {
          return null;
        };

        FormView.prototype.showActivityIndicator = function() {
          this.ui.activityIndicator.show();
          return this.ui.submit.hide();
        };

        FormView.prototype.hideActivityIndicator = function() {
          this.ui.activityIndicator.hide();
          return this.ui.submit.show();
        };

        FormView.prototype.setupValidation = function() {
          Backbone.Validation.unbind(this);
          return Backbone.Validation.bind(this, {
            valid: this.valid,
            invalid: this.invalid
          });
        };

        FormView.prototype.valid = function(view, attr, selector) {
          return this.$("[data-validation=" + attr + "]").removeClass('invalid').addClass('valid');
        };

        FormView.prototype.invalid = function(view, attr, error, selector) {
          this.failure(this.model);
          return this.$("[data-validation=" + attr + "]").removeClass('valid').addClass('invalid');
        };

        return FormView;

      })(Backbone.Marionette.ItemView);
    }
  });

  require.define({
    'task_model': function(exports, require, module) {
      var TaskModel, _ref;
      return module.exports = TaskModel = (function(_super) {
        __extends(TaskModel, _super);

        function TaskModel() {
          _ref = TaskModel.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        TaskModel.prototype.urlRoot = '/tasks';

        TaskModel.prototype.validation = {
          name: {
            required: true
          },
          priority: {
            required: true,
            oneOf: [1, 2, 3, '1', '2', '3']
          }
        };

        return TaskModel;

      })(Backbone.Model);
    }
  });

  require.define({
    'templates/create_task_template': function(exports, require, module) {
      var template;
      template = "<h2>Create A Task:</h2>\n<label for=\"name\">Task Name: </label>\n<input type=\"text\" name=\"name\" data-validation=\"name\"/>\n<br/>\n<label for=\"priority\">Priority: </label>\n<select name=\"priority\" data-validation=\"priority\">\n  <option value=\"1\">Low</option>\n  <option value=\"2\"selected=\"true\">Normal</option>\n  <option value=\"3\">High</option>\n</select>\n<br/>\n<input type=\"submit\" value=\"New Task\">\n<p class=\"loading\">Saving to server...</p>";
      return module.exports = _.template(template);
    }
  });

  require.define({
    'templates/task_template': function(exports, require, module) {
      var template;
      template = "<button class=\"delete\">✓</button>\n<span><%= name %></span>";
      return module.exports = _.template(template);
    }
  });

  require.define({
    'templates/tasks_template': function(exports, require, module) {
      var template;
      template = "<h2>Current Tasks:</h2>\n<ul class=\"task-list\"></ul>";
      return module.exports = _.template(template);
    }
  });

  require.define({
    'create_task_view': function(exports, require, module) {
      var CreateTaskView, FormView, TaskModel, _ref;
      FormView = require('form_view');
      TaskModel = require('task_model');
      return module.exports = CreateTaskView = (function(_super) {
        __extends(CreateTaskView, _super);

        function CreateTaskView() {
          _ref = CreateTaskView.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        CreateTaskView.prototype.template = require('templates/create_task_template');

        CreateTaskView.prototype.className = 'task-form';

        CreateTaskView.prototype.ui = {
          name: '[name="name"]',
          priority: '[name="priority"]',
          activityIndicator: '.loading'
        };

        CreateTaskView.prototype.createModel = function() {
          return new TaskModel;
        };

        CreateTaskView.prototype.updateModel = function() {
          this.model.set({
            name: this.ui.name.val(),
            priority: parseInt(this.ui.priority.val())
          });
          return console.log(this.model);
        };

        CreateTaskView.prototype.onSuccess = function(model) {
          return Backbone.trigger('task:create', model);
        };

        return CreateTaskView;

      })(FormView);
    }
  });

  require.define({
    'task_view': function(exports, require, module) {
      var TasksView, _ref;
      return module.exports = TasksView = (function(_super) {
        __extends(TasksView, _super);

        function TasksView() {
          _ref = TasksView.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        TasksView.prototype.template = require('templates/task_template');

        TasksView.prototype.tagName = 'li';

        TasksView.prototype.className = function() {
          return "task " + (this._priorityClass());
        };

        TasksView.prototype.events = function() {
          return {
            'click .delete': this.deleteTask
          };
        };

        TasksView.prototype.deleteTask = function(e) {
          return this.model.destroy();
        };

        TasksView.prototype._priorityClass = function() {
          switch (this.model.get('priority')) {
            case 1:
              return 'low-priority';
            case 2:
              return 'normal-priority';
            case 3:
              return 'high-priority';
            default:
              return '';
          }
        };

        return TasksView;

      })(Backbone.Marionette.ItemView);
    }
  });

  require.define({
    'tasks_view': function(exports, require, module) {
      var TaskView, TasksView, _ref;
      TaskView = require('task_view');
      return module.exports = TasksView = (function(_super) {
        __extends(TasksView, _super);

        function TasksView() {
          _ref = TasksView.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        TasksView.prototype.template = require('templates/tasks_template');

        TasksView.prototype.className = 'task-list-wrapper';

        TasksView.prototype.itemViewContainer = 'ul';

        TasksView.prototype.itemView = TaskView;

        TasksView.prototype.initialize = function() {
          return this.listenTo(Backbone, 'task:create', function(model) {
            this.collection.add(model);
            return this.collection.trigger('reset');
          });
        };

        return TasksView;

      })(Backbone.Marionette.CompositeView);
    }
  });

}).call(this);
