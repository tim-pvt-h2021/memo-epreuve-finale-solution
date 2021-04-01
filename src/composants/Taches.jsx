import { useEffect } from 'react';
import Tache from './Tache';
import './Taches.scss';
import * as crudTaches from '../services/crud-taches';
import CloudDoneIcon from '@material-ui/icons/CloudDone';

export default function Taches({etatFiltre, etatTaches, utilisateur}) {
  const uid = utilisateur.uid;
  const [taches, setTaches] = etatTaches;
  const [filtre] = etatFiltre;

  /**
   * On cherche les tâches une seule fois après l'affichage du composant
   */
  useEffect(() => 
    crudTaches.lireTout(uid, 'toutes').then(
      taches => setTaches(taches)
    )
  , [setTaches, uid]);

  /**
   * Gérer le formulaire d'ajout de nouvelle tâche en appelant la méthode 
   * d'intégration Firestore appropriée, puis actualiser les tâches en faisant 
   * une mutation de l'état 'taches' avec un tableau augmenté de la tâche 
   * ajoutée et trié avec la fonction de tri local.
   * @param {string} uid Identifiant Firebase Auth de l'utilisateur connecté
   * @param {Event} e Objet Event JS qui a déclenché l'appel
   */
  function gererAjoutTache(uid, e) {
    e.preventDefault();
    const texte = e.target.texteTache.value;
    if(texte.trim() !== '') {
      e.target.reset();
      crudTaches.creer(uid, {texte: texte, completee: false}).then(
        nouvelleTache => setTaches(((filtre!==true)?[...taches, nouvelleTache]:[...taches]).sort(trierTaches))
      );
    }
  }

  /**
   * Fonction peu efficace, puisqu'elle requiert une requête Firestore
   * pour obtenir les tâches triées après avoir modifié uniquement la tâche pour
   * laquelle on veut changer le statut (voir le code dans 'crud-taches.js').
   * Utiliser plutôt la deuxième version de cette fonction (ci-dessous).
   * 
   * Gérer le clic sur le bouton qui bascule le statut d'une tâche en faisant 
   * appel à la méthode d'intégration Firestore pour modifier le statut
   * de la tâche ; puis actualiser les tâches (en faisant une mutation de l'état 
   * 'taches') en passant une nouvelle valeur du tableau des tâches obtenue de
   * Firestore.
   * @param {string} uid Identifiant Firebase Auth de l'utilisateur connecté
   * @param {string} tid Identifiant de la tâche à faire basculer
   * @param {boolean} completee Valeur actuelle du statut de la tâche
   */
  function gererBasculerStatut(uid, tid, completee) {
    // On appelle la fonction qui modifie le statut sur Firestore en passant
    // aussi la valeur du filtre des tâches actuel pour que Firestore nous
    // retourne un nouevau tableau des tâches.
    crudTaches.basculerStatut(uid, tid, completee, filtre).then(
      taches => setTaches(taches)
    );
  }

  /**
   * EXTRA : Fonction bien plus efficace, puisqu'elle ne requiert pas une 
   * requête Firestore pour obtenir les tâches triées. La tâche modifiée sur 
   * Firestore est ensuite modifiée localement puis triée avec la fonction de 
   * tri local.
   * 
   * Gérer le clic sur le bouton qui bascule le statut d'une tâche en faisant 
   * appel à la méthode d'intégration Firestore pour modifier le statut
   * de la tâche ; puis actualiser les tâches (en faisant une mutation de l'état 
   * 'taches') en remplaçant adéquatement le tableau des tâches existant.
   * @param {string} uid Identifiant Firebase Auth de l'utilisateur connecté
   * @param {string} tid Identifiant de la tâche à faire basculer
   * @param {boolean} completee Valeur actuelle du statut de la tâche
   */
  function gererBasculerStatut_2(uid, tid, completee) {
    // On appelle la fonction qui modifie le statut sur Firestore sans demander
    // un nouveau tableau des tâches
    crudTaches.basculerStatut_2(uid, tid, completee).then(
      () => {
        // Modifier les tâches localement
        // a) Copier le tableau
        const copieTaches = [...taches];
        // b) Trouver la tâche dont le statut a été basculé sur Firestore
        const positionTacheAModifier = copieTaches
                                          .findIndex(tache => tache.id === tid);
        // c) Basculer le statut localement
        copieTaches[positionTacheAModifier].completee = !completee;
        // d) Si ce n'est pas toutes les tâches qui sont affichées, il faut
        // enlever cette tâche de l'affichage puisqu'on vient de basculer son
        // statut
        if(filtre !== 'toutes') {
          copieTaches.splice(positionTacheAModifier, 1);
        }
        // Puis on fais la mutation de l'état 'taches' en passant un nouveau 
        // tableau trié localement
        setTaches(copieTaches.sort(trierTaches));
      }
    );
  }

  /**
   * Gérer le clic sur le bouton supprimer d'une tâche en faisant appel à la 
   * fonction d'intégration Firestore appropriée, puis modifie l'état taches
   * en passant une copie filtrée du tableau existant.
   * @param {string} uid Identifiant de l'utilisateur Firebase Auth connecté
   * @param {string} tid Identifiant de la tâche à supprimer
   */
  function gererSupprimerTache(uid, tid) {
    crudTaches.supprimer(uid, tid).then(
      () => setTaches(taches.filter(tache => tache.id !== tid))
    );
  }

  return (
    <section className="Taches">
      <form onSubmit={e => gererAjoutTache(uid, e)}>
        <input 
          type="text"   
          placeholder="Ajoutez une tâche ..." 
          name="texteTache"
          autoComplete="off" 
          autoFocus={true} 
        />
      </form>
      <div className="listeTaches">
        {
          taches.length > 0 ?
            taches.map(tache => <Tache 
                                  key={tache.id} 
                                  {... tache} 
                                  // On peut utiliser ici une de deux fonctions
                                  // (voir le détail ci-dessus).
                                  gererBasculerStatut={gererBasculerStatut_2} 
                                  gererSupprimerTache={gererSupprimerTache} 
                                  utilisateur={utilisateur} 
                                />
                      )
          :
            <CloudDoneIcon fontSize="large"/>
        }
      </div>
    </section>
  );
}

/**
 * EXTRA : Pas demandé dans l'évaluation (cette fonction permet de 
 * trier le tableau des tâches sans avoir besoin de recourir à une requête
 * Firestore additionnelle).
 * 
 * Trier le tableau des taches en premier selon l'état 'complétée' (la tache
 * non-complétée vient en premier), puis par date d'ajout (la tache la plus 
 * récente vient en premier)
 * @param {Object} tacheA Premier objet 'tâche' du tableau à trier
 * @param {Object} tacheB Deuxième objet 'tâche' du tableau à trier
 * @returns {int}
 */
function trierTaches(tacheA, tacheB) {
  return (
          ((tacheA.completee ? 1 : 0) - (tacheB.completee ? 1 : 0)) 
          || 
          (tacheB.date.seconds - tacheA.date.seconds)
        );
}