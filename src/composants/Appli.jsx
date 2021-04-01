import { useEffect, useState } from 'react';
import logo from '../images/memo-logo.png';
import './Appli.scss';
import Controle from './Controle';
import Taches from './Taches';
import * as crudUtilisateurs from '../services/crud-utilisateurs';
import Accueil from './Accueil';
import Utilisateur from './Utilisateur';

export default function Appli() {
  // État de l'utilisateur
  const [utilisateur, setUtilisateur] = useState(null);

  // Observer le changement d'état de la connexion utilisateur
  useEffect(() => crudUtilisateurs.observerConnexion(setUtilisateur), []);

  // État des tâches
  const etatTaches = useState([]);

  // État du filtre des tâches
  const etatFiltre = useState('toutes');

  return (
    utilisateur ?
      <div className="Appli">
        <header className="appliEntete">
          <img src={logo} className="appliLogo" alt="Memo" />
          {/* Étape F : Complétez le composant 'Utilisateur.jsx' avant de l'inclure ici (n'oubliez pas de l'importer aussi !) */}
          <Utilisateur utilisateur={utilisateur} />
        </header>
        <Taches etatFiltre={etatFiltre} etatTaches={etatTaches} utilisateur={utilisateur} />
        <Controle etatFiltre={etatFiltre} etatTaches={etatTaches} utilisateur={utilisateur} />
      </div>
    :
      <Accueil />
  );
}
