// Importation des dépendances React et des composants
import React, { useState, useEffect } from 'react';
import TodoForm from './components/todoForm.js';
import TodoList from './components/todoList.js';

export default function Home() {
  // Création de l'état pour stocker les tâches
  const [todos, setTodos] = useState([]);

  // Charger les tâches depuis le Local Storage à l'initialisation
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos')); // Récupération des tâches
    if (storedTodos) setTodos(storedTodos); // Mise à jour de l'état si des tâches existent
  }, []);

  // Sauvegarder les tâches dans le Local Storage à chaque modification de l'état "todos"
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos)); // Enregistrement en format JSON
  }, [todos]);

  // Fonction pour ajouter une nouvelle tâche
  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(), // Utilisation de l'heure actuelle comme identifiant unique
      text,
      completed: false // La tâche est non terminée par défaut
    };
    setTodos([...todos, newTodo]); // Ajout de la nouvelle tâche à la liste existante
  };

  // Fonction pour basculer l'état "terminé" d'une tâche
  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Fonction pour supprimer une tâche par son identifiant
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id)); // Filtrer la liste pour exclure la tâche à supprimer
  };

  // Fonction pour modifier une tâche par son identifiant
  const  updateTodo =(id, newText) => {
    setTodos(
      todos.map(todo =>
        todo.id===id ? {...todo, text:newText} :todo
      )
    );

  }

  // Structure de l'interface utilisateur principale
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-gray-400 text-2xl font-bold mb-4 text-center">To-Do List</h1>
        {/* Composant pour ajouter une nouvelle tâche */}
        <TodoForm addTodo={addTodo} />
        {/* Composant pour afficher la liste des tâches */}
        <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} updateTodo={updateTodo} />
      </div>
    </div>
  );
}
