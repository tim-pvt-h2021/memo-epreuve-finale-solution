import './Controle.scss';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import * as crudTaches from '../services/crud-taches';
import { useState } from 'react';
// Les prochains 3 modules importés sont utilisés pour une fonctionnalité 
// non-demandée dans les évaluations
import { ThemeProvider, unstable_createMuiStrictModeTheme } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

// Cette instruction est utilisée pour une fonctionnalité non-demandée dans les 
// évaluations
const theme = unstable_createMuiStrictModeTheme();

export default function Controle({etatFiltre, etatTaches, utilisateur}) {
  const uid = utilisateur.uid;

  const [taches, setTaches] = etatTaches;
  const nbTaches = taches.length;
  const nbTachesCompletees = taches.filter((tache) => tache.completee).length;
  const nbTachesRestantes = nbTaches - nbTachesCompletees;
  const plurielCompletees = (nbTachesCompletees>1) ? 's' : '';

  const [filtre, setFiltre] = etatFiltre;

  // États associés aux messages 'toast' (non-demandé dans l'évaluations)
  const [toastOuvert, setToastOuvert] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastNiveau, setToastNiveau] = useState('success');

  function gererFiltreTaches(e,choix) {
    if(choix !== null) {
      crudTaches.lireTout(uid, choix).then(
        taches => setTaches(taches)
      )
      setFiltre(choix);
    }
  }

  /**
   * Gérer le clic sur le bouton pour supprimer toutes les tâches complétées 
   * s'il y en a en appelant le code d'intégration Firestore ; gérer aussi 
   * l'affichage d'un message 'toast' approprié.
   * @param {string} uid Identifiant de l'utilisateur Firebase
   * @returns {void}
   */
  function gererSupprimerCompletees(uid) {
    if(taches.length === nbTachesRestantes) {
      setToastNiveau('info');
      setToastMsg("Aucune tâche à supprimer.");
      setToastOuvert(true);
      return;
    }
    crudTaches.supprimerCompletees(uid).then(
      () => {
        setTaches(taches.filter(tache => tache.completee === false));
        setToastNiveau('success');
        setToastMsg(`${nbTachesCompletees} tâche${plurielCompletees} 
                complétée${plurielCompletees} supprimée${plurielCompletees}.`);
        setToastOuvert(true);
      }
    );
  }

  return (
    <footer className="Controle">
      <ToggleButtonGroup 
        size="small" 
        value={filtre} 
        exclusive={true} 
        onChange={gererFiltreTaches}
      >
        <ToggleButton value={'toutes'}>Toutes</ToggleButton>
        <ToggleButton value={true}>Complétées</ToggleButton>
        <ToggleButton value={false}>Actives</ToggleButton>
      </ToggleButtonGroup>
      {
        // On veut afficher le nombre de tâches restantes et le bouton qui 
        // permet de supprimer toutes les tâches complétées uniquement lorsque
        // le filtre d'affichage est à 'toutes'
        filtre === 'toutes' &&
        <>
          <span className="compte">
            {nbTachesRestantes} 
            &nbsp;{nbTachesRestantes>1?'tâches restantes':'tâche restante'} 
          </span>
          <IconButton 
            aria-label="delete" 
            size="small" 
            variant="contained" 
            color="secondary" 
            onClick={() => gererSupprimerCompletees(utilisateur.uid)} 
            title="Supprimer les tâches complétées"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </>
      }
      {/* Le composant SnackBar est utilisé pour une fonctionnalité non-demandée 
          dans les évaluations : testez le code et devinez comment c'est utilisé 
          par vous-même */}
      <ThemeProvider theme={theme}>
        <Snackbar 
          open={toastOuvert} 
          autoHideDuration={3000} 
          onClose={()=>setToastOuvert(false)}
        >
          <Alert severity={toastNiveau}>
            {toastMsg}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </footer>
  );
}