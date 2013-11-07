require.define 'templates/tasks_template': (exports, require, module) ->

  template = """
  <h2>Current Tasks:</h2>
  <ul class="task-list"></ul>
  """

  module.exports = _.template template