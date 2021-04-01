import firebase from 'firebase/app';
import { firestore } from './firebase';
import { collUtil, collTaches } from './config';

/**
 * Créer une nouvelle tâche pour l'utilisateur connecté
 * @param {string} uid identifiant d'utilisateur Firebase 
 * @param {Object} tache document à ajouter aux tâches de l'utilisateur
 * @returns {Promise<{}>} Promesse avec un objet représentant la tâche ajoutée
 */
export async function creer(uid, tache) {
  tache.date = firebase.firestore.FieldValue.serverTimestamp();
  return firestore.collection(collUtil).doc(uid).collection(collTaches)
            .add(tache).then(
              docRef => docRef.get().then(
                doc => ({id: doc.id, ...doc.data()})
              )
            );
}

/**
 * Obtenir toutes les tâches d'un utilisateur par statut de tâche
 * @param {string} uid identifiant d'utilisateur Firebase 
 * @param {string|boolean} filtre filtre des tâches (par valeur de 'completee')
 * @returns {Promise<any[]>} Promesse avec le tableau des tâches
 */
export async function lireTout(uid, filtre) {
  const taches = [];
  let reponse;
  if(filtre==='toutes') {
    // Remarquez que l'usage de deux clauses orderBy() requiert un index dans 
    // Firestore (la création d'un index prend quelques minutes intialement)
    reponse = await firestore.collection(collUtil).doc(uid)
                .collection(collTaches).orderBy('completee', 'asc')
                .orderBy('date', 'desc').get();
  }
  else {
    // Remarquez qu'on ne peut pas ordonner des documents par un champ par 
    // lequel on les filtrent (donc pas de orderBy('completee') ici !)
    reponse = await firestore.collection(collUtil).doc(uid)
                .collection(collTaches).where('completee', '==', filtre)
                .orderBy('date', 'desc').get();
  }
  reponse.forEach(
    doc => {
      taches.push({id: doc.id, ...doc.data()})
    }
  );
  return taches;
}

/**
 * Basculer le statut d'une tâche (entre 'completee' = true ou false)
 * pour l'utilisateur connecté (et retourner les tâches: pas efficace, à revoir)
 * @param {string} uid identifiant d'utilisateur Firebase 
 * @param {string} tid identifiant du document Firestore à modifier
 * @param {boolean} statut statut actuel de la tâche à basculer
 * @param {string|boolean} filtre filtre des tâches (par valeur de 'completee')
 * @returns {Promise<any[]>} Promesse avec le tableau des tâches
 */
export async function basculerStatut(uid, tid, statut, filtre) {
  return firestore.collection(collUtil).doc(uid).collection(collTaches).doc(tid)
                  .update({completee: !statut}).then(
                    /* Note (amélioration future) : ce n'est pas efficace de 
                    tout relire après cette opération, ça serait mieux de trier 
                    le tableau d'état sans recours à Firebase */
                    () => lireTout(uid, filtre)
                  );
}

/**
 * EXTRA : amélioration à la fonction précédente (voir la note ci-dessus)

 * Basculer le statut d'une tâche (entre 'completee' = true ou false)
 * pour l'utilisateur connecté (et retourner les tâches: pas efficace, à revoir)
 * @param {string} uid identifiant d'utilisateur Firebase 
 * @param {string} tid identifiant du document Firestore à modifier
 * @param {boolean} statut statut actuel de la tâche à basculer
 * @returns {Promise<any[]>} Promesse avec le tableau des tâches
 */
 export async function basculerStatut_2(uid, tid, statut) {
  return firestore.collection(collUtil).doc(uid).collection(collTaches).doc(tid)
                  .update({completee: !statut});
}


/**
 * Supprimer les tâches complétées pour l'utilisateur connecté
 * @param {string} uid identifiant d'utilisateur Firebase 
 * @returns {Promise<void>} Promesse avec rien ;-)
 */
 export async function supprimerCompletees(uid) {
  return firestore.collection(collUtil).doc(uid).collection(collTaches)
            .where('completee','==',true).get().then(
              resultat => resultat.forEach(doc => doc.ref.delete())
            );
}

/**
 * Supprimer une tâche par son identifiant pour l'utilisateur connecté
 * @param {string} uid Identifiant de l'utilisateur
 * @param {string} tid Identifiant de la tâche à supprimer
 * @returns {Promise<void>}
 */
export async function supprimer(uid, tid) {
  return firestore.collection(collUtil).doc(uid).collection(collTaches)
            .doc(tid).delete();
}