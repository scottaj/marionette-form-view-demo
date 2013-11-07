require.define 'templates/create_task_template': (exports, require, module) ->

  template = """
  <h2>Create A Task:</h2>
  <label for="name">Task Name: </label>
  <input type="text" name="name" data-validation="name"/>
  <br/>
  <label for="priority">Priority: </label>
  <select name="priority" data-validation="priority">
    <option value="1">Low</option>
    <option value="2"selected="true">Normal</option>
    <option value="3">High</option>
  </select>
  <br/>
  <input type="submit" value="New Task">
  <p class="loading">Saving to server...</p>
  """

  module.exports = _.template template