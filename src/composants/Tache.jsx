import './Tache.scss';
import IconButton from '@material-ui/core/IconButton';
import DoneIcon from '@material-ui/icons/Done';
import DeleteIcon from '@material-ui/icons/Delete';
import formaterDateEtHeure from '../services/utilitaires';

export default function Tache({id, texte, completee, date, gererBasculerStatut, 
                                            gererSupprimerTache, utilisateur}) {
  return (
    <div className={`Tache ${completee && 'completee'}`}>
      <IconButton
        size="small"
        className="btnCompletee"
        color="primary"
        title="Cliquez pour marquer cette tâche complétée" 
        onClick={e => gererBasculerStatut(utilisateur.uid, id, completee)}
      >
        <DoneIcon />
      </IconButton>
      <span className="texte">{texte}</span>
      <span className="date">({formaterDateEtHeure(date)})</span>
      <IconButton
        size="small"
        className="btnSupprimer"
        color="primary"
        title="Supprimer cette tâche" 
        onClick={() => gererSupprimerTache(utilisateur.uid, id)}
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
}