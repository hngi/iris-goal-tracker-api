import userEndpoints from "./users/users.endpoint";
import goalEndpoints from "./goals/goals.endpoint";
import todoEndpoints from "./todos/todos.endpoint";
import feedbackEndpoints from "./feedbacks/feedbacks.endpoint";


export default [
  ...userEndpoints,
  ...goalEndpoints,
  ...todoEndpoints,
  ...feedbackEndpoints
]