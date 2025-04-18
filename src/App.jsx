import { useState } from 'react'
import './App.css'

function App() {

  const handleClick = () => {
    document.documentElement.classList.toggle("dark")
  }

  return (
    <main>
      <h1>hello wold</h1>
      <button onClick={handleClick}>change theme</button>
    </main>
  )
}

export default App
