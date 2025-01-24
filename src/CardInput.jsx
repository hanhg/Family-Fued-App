
import {useState} from 'react'

function CardInput(props) {
  

  return (
    <>
    <span className="flex flex-row w-full h-full bg-gradient-to-t from-blue-900 to-blue-300">
    {props.description && <> <div className="w-2/3 h-full border-r border-white bg-gradient-to-t from-blue-950 to-blue-900 float-left">
          
            {!props.description.answer && 
            <input type="text" onChange={(e)=> props.handleInput(props.index,"answer", e)} placeholder={"Fill in answer"} className='w-full h-full text-white font-bold text-3xl bg-transparent border-none p-2'/>}
            {props.description.answer && 
            <input type="text" onChange={(e)=> props.handleInput(props.index,"answer", e)} placeholder={props.description.answer} className='w-full h-full text-white font-bold text-3xl bg-transparent border-none p-2'/>}

        </div>

        <div className="w-1/3 h-full">
            {!props.description.points && 
            <input type="number" onChange={(e)=> props.handleInput(props.index,"points", e)} max={99} placeholder="0" className='w-full h-full text-white font-bold text-4xl text-center bg-transparent border-none p-2'/>}
            {props.description.points && 
            <input type="number" onChange={(e)=> props.handleInput(props.index,"points", e)} max={99} placeholder={props.description.points} className='w-full h-full text-white font-bold text-4xl text-center bg-transparent border-none p-2'/>}

        </div></>}
    </span>
    </>
  )
}

export default CardInput
