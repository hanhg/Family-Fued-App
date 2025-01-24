import {Textfit} from 'react-textfit'
import {useState} from 'react'
import CardInput from './CardInput.jsx'

function Card(props) {
  

  return (
    <>
      <div className="w-1/2 h-1/4">
        <div style={{width:"96%", height:"95%", top:"2.5%", left:"2%"}} className=" relative border-2 border-white">
            {(!props.edit) &&
            <button onClick={() => {if(props.description.answer && props.description.points) props.onClick()}} style={{width:"98%", height:"95%", top:"2.5%", left: "1%"}} className="relative border-2 border-white bg-gradient-to-t from-blue-900 to-blue-300 hover:bg-gradient-to-r">
                
                {props.description.clicked && 
                <span className="flex flex-row w-full h-full bg-gradient-to-t from-blue-900 to-blue-300">
                  <div className="w-8/12 h-full border-r border-white bg-gradient-to-t from-blue-950 to-blue-900 p-2 float-left">
                    <Textfit mode="multi" className="h-full text-center text-white font-bold">{props.description.answer}</Textfit>
                  </div>
                  <div className=" w-4/12 h-full p-2">
                    <p className="truncate text-center text-white font-bold text-5xl mt-2">{props.description.points}</p>
                  </div>
                </span>}

                {(!props.description.clicked && (props.description.answer && props.description.points)) && <>
                <img src="/numberHolder.png" alt="number background" style={{width:"28%", left:"36%"}} className="relative"/>
                <p style={{top: "23%", left:"45%"}} className="absolute text-white font-bold text-5xl">{props.number}</p>
                </>}
            </button>}
            {props.edit &&
              <CardInput description={props.description} index={props.number-1} handleInput={props.handleInput}/>
            }
        </div>
      </div>
    </>
  )
}

export default Card
