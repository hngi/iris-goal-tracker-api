import userEndpoints from "./users/users.endpoint";
import goalEndpoints from "./goals/goals.endpoint";
import todoEndpoints from "./todos/todos.endpoint";


export default [
  ...userEndpoints,
  ...goalEndpoints,
  ...todoEndpoints
]