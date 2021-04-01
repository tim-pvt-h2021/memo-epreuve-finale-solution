// Étape F : implémentez le composant qui affiche la barre de profil d'utilisateur. Remarquez que le formatage de l'interface
// produite par ce composant est déjà produit dans le fichier .scss fourni, si vous voulez en profiter, le gabarit HTML 
// que ce composant retourne doit ressembler à ceci (les footer et span ne sont pas obligatoires, mais les noms des 
// classes le sont si vous voulez profiter de mon CSS) : 
/*
  <div className="Utilisateur">
    <span className="nom"></span>
    <Avatar className="avatar" />
    <Button>Déconnexion</Button>
  </div>
*/
// Remarquez aussi l'utilisation des composants Avatar et Button de Material-UI (faites comme vous voulez, vous n'êtes pas obligé 
// de les utiliser, mais alors il faudra compléter le CSS par vous même)

import './Controle.scss';

import { Avatar, Button } from '@material-ui/core';
import * as crudUtilisateurs from '../services/crud-utilisateurs';

import './Utilisateur.scss';

export default function Utilisateur({utilisateur}) {
  return (
    <div className="Utilisateur">
      <span className="nom">{utilisateur.displayName}</span>
      <Avatar className="avatar" alt={utilisateur.displayName} src={utilisateur.photoURL} />
      <Button 
        variant="outlined"
        size="small"
        className="btnDeconnexion"
        onClick={() => crudUtilisateurs.deconnexion()}
      >
        Déconnexion
      </Button>
    </div>
  );
}