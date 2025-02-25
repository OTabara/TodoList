import React, { useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { Check, Trash2 } from 'lucide-react';

export default function TodoList({ todos, toggleTodo, deleteTodo, updateTodo }) {
  // États pour la gestion de l'édition
  const [isEditing, setIsEditing] = useState(null); // ID de la tâche en cours d'édition
  const [currentEdit, setCurrentEdit] = useState(''); // Texte temporaire de la tâche modifiée

  // Fonction pour annuler l'édition et réinitialiser le texte
  const cancelEdit = () => {
    setIsEditing(null);  // Ferme le mode édition en réinitialisant l'ID
    setCurrentEdit('');  // Réinitialise le texte temporaire de la tâche
  };

  // Fonction pour valider l'édition (sauvegarder la modification)
  const saveEdit = (id) => {
    // Vérification que le texte n'est pas vide avant de sauvegarder
    if (currentEdit.trim() === '') { 
      alert("Le texte ne peut pas être vide !"); // Alerte si le texte est vide
      return; // Arrête la fonction si le texte est vide
    }
    
    // Mise à jour de la tâche avec le nouveau texte
    updateTodo(id, currentEdit);  
    setIsEditing(null);  // Ferme le mode édition
    setCurrentEdit('');  // Réinitialise le texte temporaire
  };

  return (
    <ul>
      {todos.map(todo => (
        <li 
          key={todo.id} // Clé unique pour chaque élément de la liste
          className="flex justify-between items-center text-gray-400 bg-gray-200 rounded-lg p-2 mb-2"
        >
          {/* Si la tâche est en cours de modification, afficher un champ de texte */}
          {isEditing === todo.id ? (
            <div className="flex items-center space-x-2 w-full">
              <input 
                type="text"
                value={currentEdit} // Valeur du champ de texte = texte actuel à modifier
                onChange={(e) => setCurrentEdit(e.target.value)} // Met à jour le texte à chaque modification
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { // Sauvegarder en appuyant sur "Enter"
                    saveEdit(todo.id);
                  }
                }}
                className="border rounded-lg p-1 w-full mr-2"
              />
              {/* Bouton de validation pour sauvegarder la modification */}
              <button 
                onClick={() => saveEdit(todo.id)} 
                className="text-green-500 hover:text-green-700 transition duration-300"
              >
                Valider
              </button>
              {/* Bouton d'annulation pour fermer le mode édition sans sauvegarder */}
              <button 
                onClick={cancelEdit} 
                className="text-red-500 hover:text-red-700 transition duration-300"
              >
                Annuler
              </button>
            </div>
          ) : (
            // Si la tâche n'est pas en édition, afficher son texte
            <span 
              onClick={() => toggleTodo(todo.id)} // Permet de marquer la tâche comme terminée
              className={`cursor-pointer ${todo.completed ? 'line-through text-gray-500' : ''}`}
            >
              {todo.text}
            </span>
          )}
          
          {/* Boutons d'actions */}
          <div className="flex items-center space-x-2">
            {/* Bouton pour marquer la tâche comme terminée */}
            <button 
              onClick={() => toggleTodo(todo.id)}
              className="text-green-500 hover:text-green-700 transition duration-300"
            >
              <Check />
            </button>
            {/* Bouton pour supprimer la tâche */}
            <button 
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700 transition duration-300"
            >
              <Trash2 />
            </button>
            {/* Bouton pour modifier la tâche (passer en mode édition) */}
            <button 
              onClick={() => {
                setIsEditing(todo.id); // Active le mode édition pour la tâche correspondante
                setCurrentEdit(todo.text); // Charge le texte actuel de la tâche dans le champ d'édition
              }}
            >
              <FaEdit />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
