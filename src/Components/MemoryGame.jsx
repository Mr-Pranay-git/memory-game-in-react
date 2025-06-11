import React, { useEffect, useState } from 'react'

const MemoryGame = () => {

  const [gridSize, setGridsize] = useState(4);
  const [cards, setCards] = useState([]);
  const [flipped, setflipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disable, setDisable] = useState(false);
  const [won,setWon] = useState(false);

  const handleGridSizeChange = (e)=>{
    const size = parseInt(e.target.value)
    console.log(size);
    if(size >=2 && size <=10)setGridsize(size)    
  }

  const initializeGame = () =>{
    const totalCards = gridSize*gridSize; //16
    const paircount =  Math.floor(totalCards/2) //8
    const number = [...Array(paircount).keys()].map((e)=>e+1);
    const shuffledCards = [...number , ...number].sort(()=>Math.random() - 0.5)
    .slice(0, totalCards)
    .map((number, index)=>({id: index , number}))    

    setCards(shuffledCards);
    setflipped([]);
    setSolved([]);  
    setWon(false);

  };
  useEffect(()=>{
    initializeGame()
  },[gridSize]);

  const checkMatch =(secondId)=>{
    const [firstId] = flipped
    if(cards[firstId].number == cards[secondId].number){
      setSolved([...solved, firstId, secondId]);
      setflipped([])
      setDisable(false)
    }
    else{
      setTimeout(() => {
        setflipped([])
        setDisable(false)
      }, 1000);
    }
  }

  const handleclick=(id)=>{
    if (disable || won) return;

    if(flipped.length === 0 ){
      setflipped([id]);
      return;
    }

    if(flipped.length === 1){
      setDisable(true);
      if(id !== flipped[0]){
        setflipped([...flipped, id])
        checkMatch(id)
      }
      else{
         setflipped([])
         setDisable(false) 
      }
    }
  };

  const isFlipped = (id)=> flipped.includes(id) || solved.includes(id);
  const isSolved = (id) => solved.includes(id);
  
  useEffect(()=>{
    if(solved.length === cards.length && cards.length >0){
      setWon(true)
    }
  },[solved,cards])

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <h1 className='text-4xl font-bold mb-6'>Memory Game</h1>
      {/* input */}
      
      <div> 
        <label htmlFor="gridSize">Grid size (max:10)</label>
        <input id='gridSize' type="number" className='border-2 ml-2 rounded mb-5' max='10' min='2' value={gridSize} onChange={handleGridSizeChange} />
      </div>
      {/* Game board */}

      <div
      className={`grid gap-2 mb-4`}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        width:`min(100%, ${gridSize*5.5}rem)`,
      }}
      >
        
          {cards.map((card)=>{
            return(<div key={card.id} 
              onClick={()=> handleclick(card.id)}
              className={`aspect-square flex items-center justify-center text-xl font-bold rounded-xl
              cursor-pointer transition-all duration-300 ${isFlipped(card.id)? isSolved(card.id)
                ? "bg-green-500 text-white"
                : "bg-blue-500 text-white" 
                : "text-black bg-gray-300"}`}
              
            >
              {isFlipped(card.id) ? card.number : `?`}
            </div>
            );
          })}        
      </div>
      {/* Result */}
      {won && (
        <div className='mt-4 text-3xl font-bold text-green-600 animate-bounce '>You Won!</div>
        )}

      {/* Reset / Play again Btn */}
        <button
        onClick={initializeGame}
         className='px-4 py-2 bg-green-600 font-bold text-white rounded  hover:bg-green-700 border-none'>
          {won ? 'Play Again':'Reset'}
        </button>
      
    </div>
  )
}

export default MemoryGame
