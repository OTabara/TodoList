// Importation de React et du Hook useState pour gérer l'état du formulaire
import React, { useState } from 'react';

export default function TodoForm({ addTodo }){
  // État pour stocker le texte de la nouvelle tâche
  const [input, setInput] = useState('');

  // Fonction exécutée lors de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    if (input.trim()) { // Vérifie que le champ n'est pas vide
      addTodo(input); // Appelle la fonction addTodo pour ajouter la tâche
      setInput(''); // Réinitialise le champ de texte
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      {/* Champ de texte pour saisir la nouvelle tâche */}
      <input 
        type="text"
        placeholder="Ajouter une tâche..."
        value={input}
        onChange={(e) => setInput(e.target.value)} // Met à jour l'état à chaque frappe
        className="text-gray-400 border p-2 rounded w-full"
      />
      {/* Bouton de soumission du formulaire */}
      <button 
        type="submit"
        className="bg-blue-400 text-white px-4 py-2 rounded mt-2 w-full hover:bg-blue-600 transition duration-300"
      >
        Ajouter
      </button>
    </form>
  );
};
