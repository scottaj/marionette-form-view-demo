require.define 'templates/task_template': (exports, require, module) ->

  template = """
    <button class="delete">✓</button>
    <span><%= name %></span>
  """

  module.exports = _.template template