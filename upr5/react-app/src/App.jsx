import Header from './Header'
import Tasks from './Tasks'
import './App.css'

function App() {
  const todoTasks = [
    { id: 1, description: 'Да науча основите на React', completed: false },
    { id: 2, description: 'Да създам компонент Tasks', completed: false },
    { id: 3, description: 'Да упражня подаването на props', completed: false },
  ]

  const completedTasks = [
    { id: 4, description: 'Инсталиране на Vite и React', completed: true },
    { id: 5, description: 'Създаване на компонент Header', completed: true },
  ]

  return (
    <div>
      <Header />
      <main className="app-content">
        <Tasks tasks={todoTasks} title="Задачи за изпълнение" />
        <Tasks tasks={completedTasks} title="Изпълнени задачи" />
      </main>
    </div>
  )
}

export default App
