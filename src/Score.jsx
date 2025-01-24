
import {Textfit} from 'react-textfit'

function Score(props) {
  
    const getSelectedStyle = () => {
        if (props.selected)
            return "border-8 border-yellow-400";
        return "border-2 border-white";
    }

  return (
    <>
    <div className="relative w-1/6 h-1/3 bg-black m-4 rounded-3xl border-2 border-white">
        <button onClick={props.teamSelect} style={{width:"88%", height:"82%", backgroundImage:"url(/theme1.png)"}} className={"bg-cover relative bg-blue-950 m-4 rounded-xl "+getSelectedStyle()}>
            {!props.editingMode && <Textfit mode="multi" className="h-full text-center text-white font-bold p-1">{props.score}</Textfit>}
            {props.editingMode && <input type="number" placeholder="0" onChange={props.handleScoreInput} className='w-full h-full text-white font-bold text-4xl text-center bg-transparent border-none p-2'/>}
        </button>
        
    </div>
    </>
  )
}

export default Score;
