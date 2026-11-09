import imgTodo from './assets/todo.svg'
import imgCompleted from './assets/completed.svg'
import './Tasks.css'

function Tasks(props) {
  return (
    <section className="tasks-section">
      <h2>{props.title}</h2>
      <ul className="tasks-list">
        {props.tasks.map((task) => (
          <li
            className={task.completed ? 'task task-completed' : 'task'}
            key={task.id}
          >
            <img
              src={task.completed ? imgCompleted : imgTodo}
              width="28"
              height="28"
              alt={task.completed ? 'Изпълнена задача' : 'Неизпълнена задача'}
            />
            <span>{task.description}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Tasks
