import './Accueil.scss';
import * as crudUtilisateurs from '../services/crud-utilisateurs';
import { useEffect } from 'react';

export default function Accueil() {
  useEffect(() => crudUtilisateurs.initUI("#firebaseui-widget"), []);

  return (
    <div className="Accueil">
      <h3 className="logo">Memo</h3>
      <div id="firebaseui-widget"></div>
    </div>
  )
}