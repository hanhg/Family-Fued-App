import { useState, useEffect} from 'react'
import Textfit from 'react-textfit'
import Card from './Card.jsx'
import Score from './Score.jsx'
import data from './assets/data.json'
import newContent from '/content.txt'
import axios from 'axios'

function App() {
  const [cards, setCards] = useState(Array(8).fill(null));
  const [unsavedCards, setUnsavedCards] = useState(Array(8).fill(null));
  const [unsavedScores, setUnsavedScores] = useState({
    "team1": 0,
    "team2": 0
  });
  const [unsavedQuestion, setUnsavedQuestion] = useState("");
  const [edit, setEdit] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState("team1");
  const [scores, setScores] = useState({
    "team1": 0,
    "team2": 0
  });
  const [buzzerNum, setBuzzerNum] = useState(0);
  const [displayX, setDisplayX] = useState(false);
  const [question, setQuestion] = useState("");
  let fetch = false;

  let fetchContent = async() =>{
    if (fetch)
    {
      return;
    }
    fetch = true;

    let resp = await axios.get(newContent);
    let final = await resp.data;
    let arr = final.split("\n");

    let isTitle = true;
    let emptyBlock = false;
    let title = "";
    let tempCards = Array(8).fill(null);
    for(let i=0; i < arr.length; i++)
    {
      if(isTitle)
      {
        title = arr[i].substring(0,arr[i].length-2);
        isTitle = false;
      }
      else if(!emptyBlock)
      {
        tempCards = Array(8).fill(null);
        let count = 0;
        while(arr[i].length > 1) {
          let line = arr[i];
          
          tempCards[count] = {
            "answer": line.substring(0, line.indexOf("(")-1),
            "points": line.substring(line.indexOf("(")+1).replaceAll(")","")
          }
          count++;
          i++;
          emptyBlock = true;
        }
        isTitle = true;
      }
      
      if(emptyBlock)
      {
        let index = data.length;
        data[index] = {
          "title": title,
        }
        for(let j = 0; j < tempCards.length; j++)
        {
          let set = data[index];
          if(tempCards[j])
          {
            set[j+1] = tempCards[j];
            
          }
          else
          {
            set[j+1] = {
              "answer": null,
              "points": null
            }
          }
          
        }
        emptyBlock = false;
      }
    }
  }

  useEffect( () => {
    const tempCards = Array(8);
    for(let i=0; i < 8; i++)
    {
      tempCards[i] = {
        answer: null,
        points: null,
        clicked: false,
      }
    }

    fetchContent();

    setCards(tempCards);
    setUnsavedCards(tempCards);
  }, [])

  const fetchRandomCardSet = () => {
    const randomIndex = Math.floor(Math.random() * data.length);
    const tempCards = cards.slice();
    
    const set = data[randomIndex];
    setQuestion(data[randomIndex].title.toUpperCase());
    for(let i=1; i <= cards.length; i++)
      {
        if(set[i].answer && set[i].points)
        {
          let answer = set[i].answer.toUpperCase();
          let points = set[i].points.replaceAll(" ", "");
          
          if (i > 1) {
            let prev = tempCards[i-2].points;
            if(parseInt(points) >= parseInt(prev))
            {
              points = parseInt(prev) -1 + "";
            }
          }

          tempCards[i-1] = {
            answer: answer,
            points: points,
            clicked: false
          }
        }
        else
        {
        tempCards[i-1] = {
          answer: null,
          points: null,
          clicked: false
        }
      }
      }
    for(let i =0; i < tempCards.length; i++)
    {
      if(parseInt(tempCards[i].points) <= 0)
      {
        tempCards[i] = {
          answer: null,
          points: null,
          clicked: false
        }
      }
    }

    for(let i = 0; i < tempCards.length; i++)
    {
      if(tempCards[i].answer == null || tempCards[i].points == null)
      {
        for(let j= i+1; j < tempCards.length; j++)
        {
          if(tempCards[j].answer != null && tempCards[j].points != null)
          {
            tempCards[i] = tempCards[j]
            tempCards[j] = {
              answer: null,
              points: null,
              clicked: false
            };
            break;
          }
        }
      }
    }
    setCards(tempCards);
  }

  const handleCardInput = (index, type, event) => {
    const tempCards = unsavedCards.slice();

    let clone = cloneCard(tempCards[index]);
    switch (type)
    {
      case "answer":
        if(event.target.value.replaceAll(" ", "") != "")
        {
          clone.answer = (event.target.value).toUpperCase();
          tempCards[index] = clone;
        }
        break;
      case "points":
        clone.points = event.target.value;
        tempCards[index] = clone;
        break
      default:
    }
    setUnsavedCards(tempCards);
  }
  const handleScoreInput = (team, event) => {

    const tempUnsavedScores = {...unsavedScores};
    tempUnsavedScores[team] = event.target.value;
    setUnsavedScores(tempUnsavedScores);
  }

  const cloneCard = (card) => {
    return {
      answer: card.answer,
      points: card.points,
      clicked: card.clicked,
    }
  }

  const handleClick = (index) => {
    
    const tempCards = cards.slice();
    const tempScores = {...scores};
    
    let clone = cloneCard(tempCards[index]);
    if(!clone.clicked)
    {
      clone.clicked = true;
      tempCards[index] = clone;
      tempScores[selectedTeam] = tempScores[selectedTeam] + parseInt(clone.points);
    }

    
    setScores(tempScores);
    setCards(tempCards);
  }

  const handleSetEdits = () => {
    const tempCards = cards.slice();
    const tempUnsavedCards = unsavedCards.slice();
    const tempUnsavedScores = {...unsavedScores};

    if(edit)
    {
      resetBoard(tempCards);
      for(let i = 0; i < tempCards.length; i++)
      {
        if(tempCards[i].answer == null || tempCards[i].points == null)
        {
          for(let j= i+1; j < tempCards.length; j++)
          {
            if(tempCards[j].answer != null && tempCards[j].points != null)
            {
              tempCards[i] = tempCards[j]
              tempCards[j] = {
                answer: null,
                points: null,
                clicked: false
              };
              break;
            }
          }
        }
      }
    }
    else
    {
      for(let i = 0; i < tempUnsavedCards.length; i++)
      {
        tempUnsavedCards[i] = {
          answer: null,
          points: null,
          clicked: false
        };
      }
      tempUnsavedScores.team1 = 0;
      tempUnsavedScores.team2 = 0;
      setUnsavedScores(tempUnsavedScores);
      setUnsavedCards(tempUnsavedCards);
      setUnsavedQuestion("");
    }
    setCards(tempCards);
    setEdit(!edit);
  }

  const handleSaveBoard = () => {
    const tempCards = unsavedCards.slice();
    setCards(tempCards);
    setQuestion(unsavedQuestion.toUpperCase());
  }

  const handleSaveScore = () => {
    const tempUnsavedScores = {...unsavedScores}
    if(tempUnsavedScores.team1 === "")
      tempUnsavedScores.team1 = 0;
    if(tempUnsavedScores.team2 === "")
      tempUnsavedScores.team2 = 0;
    setScores(tempUnsavedScores);
  }

  const resetBoard = (tempCards) => {
    for(let i=0; i < tempCards.length; i++)
    {
      let clone = cloneCard(tempCards[i]);
      clone.clicked = false;
      tempCards[i] = clone;
    }
  }

  const onKeyPress = (e) => {
    if(e.key === 'x' && !edit)
    {
      
      setDisplayX(true);
      if(buzzerNum == 3)
        setBuzzerNum(0);
      else
        setBuzzerNum(buzzerNum+1);
    }
  }

  return (
    <>
      <div tabIndex={0} style={{backgroundImage:"url(/background.png)", width: "99.3%", height: "958px"}} onKeyDown={onKeyPress} className="absolute bg-contain">
        
        <div style={{height:"8%"}} className='m-2 flex flex-row w-full h-1/6'>
          <button onClick={handleSetEdits} style={{height:"65%"}} className="m-2 bg-blue-800 w-1/12 border-2 border-black rounded-3xl hover:bg-blue-900 active:bg-blue-950">
            {edit && <p className="text-white font-bold text-3xl">Start</p>}
            {!edit && <p className="text-white font-bold text-3xl">Edit</p>}
          </button>

          {!edit && <button onClick={() => {
            const temp = cards.slice();
            resetBoard(temp);
            setCards(temp);
            }} style={{height:"65%"}} className="m-2 bg-blue-800 w-1/6 border-2 border-black rounded-3xl hover:bg-blue-900 active:bg-blue-950">
            <p className="text-white font-bold text-3xl">Reset Board</p>
          </button>}

          {!edit && <button onClick={() => 
            setScores({
              team1: 0,
              team2: 0
            })} style={{height:"65%"}} className="m-2 bg-blue-800 w-1/6 border-2 border-black rounded-3xl hover:bg-blue-900 active:bg-blue-950">
            <p className="text-white font-bold text-3xl">Reset Score</p>
          </button>}

          {edit && <button onClick={handleSaveBoard} style={{height:"65%"}} className="m-2 bg-blue-800 w-1/6 border-2 border-black rounded-3xl hover:bg-blue-900 active:bg-blue-950">
            <p className="text-white font-bold text-3xl">Save Board</p>
          </button>}
          
          {edit && <button onClick={handleSaveScore} style={{height:"65%"}} className="m-2 bg-blue-800 w-1/6 border-2 border-black rounded-3xl hover:bg-blue-900 active:bg-blue-950">
            <p className="text-white font-bold text-3xl">Save Score</p>
          </button>}
          {edit && <button onClick={fetchRandomCardSet} style={{height:"65%"}} className="m-2 bg-blue-800 w-1/6 border-2 border-black rounded-3xl hover:bg-blue-900 active:bg-blue-950">
            <p className="text-white font-bold text-3xl">Random Set</p>
          </button>}
        </div>

        <img style={{width:"281px", height:"162px"}} src="/family_feud_logo.png" alt="Family Feud Logo" className="mx-auto"/>
        
        <div style={{height:"10%"}} className="w-1/2 bg-blue-500 mx-auto bg-gradient-to-t from-blue-950 to-blue-900 rounded-3xl">
            {!edit && <Textfit  mode="multi" className="h-full text-center text-white font-bold p-2">{question}</Textfit>}
            {edit && <>
              {(question === "") && <input type="text" onChange={(e) => setUnsavedQuestion(e.target.value)} placeholder="Fill in question" className='w-full h-full text-white font-bold text-3xl bg-transparent border-none p-2'/>}
              {!(question === "") && <input type="text" onChange={(e) => setUnsavedQuestion(e.target.value)} placeholder={question} className='w-full h-full text-white font-bold text-3xl bg-transparent border-none p-2'/>}
            </>}
        </div>
        <div style={{height:"53%"}} className="w-full flex flex-row flex-between">
          <Score handleScoreInput={(e) => handleScoreInput("team1", e)} editingMode={edit} teamSelect={() => setSelectedTeam("team1")} selected={selectedTeam === "team1"} score={scores["team1"]}/>
          <div style={{borderRadius:"40px", width:"50%", height:"100%"}} className="relative mx-auto bg-black border-2 border-white mt-4">
            <div style={{padding:"16px", borderRadius:"30px", top:"3.125%", borderColor:"#f8dfa0", height:"92%", width:"95%"}} className="relative border-8 mx-auto">
              <span className="flex flex-wrap flex-col w-full h-full">
                {cards.map((card, index) => (
                  <Card 
                    description={card}
                    key={index}
                    number={index+1}
                    onClick={() => handleClick(index)}
                    handleInput={handleCardInput}
                    edit = {edit}
                    />
                ))}
              </span>
            </div>
          </div>
          <Score handleScoreInput={(e) => handleScoreInput("team2", e)} editingMode={edit} teamSelect={() => setSelectedTeam("team2")} selected={selectedTeam === "team2"} score={scores["team2"]}/>
        </div>
        {(buzzerNum != 0 && !edit && displayX) &&<>
          <BuzzerComponent endBuzzer={() => setDisplayX(false)} buzzerNum={buzzerNum}/></>}
      </div>

    </>
  )
}

const BuzzerComponent = (props) => {
  //allow x buzzer to show for two seconds
  useEffect(() => {
    const id = setInterval(() => {
      props.endBuzzer();
    }, 2000)

    return () => {
      clearInterval(id);
    };
  }, [])

  return (<div className="absolute top-0 left-0 w-full h-full flex flex-between">
  <img src={"/" + props.buzzerNum + "-x.gif"} className="mx-auto h-96 mt-80"></img>
</div>)
}

export default App
