import React, { useState, useMemo } from 'react'
import './App.css'

import TinderCard from 'react-tinder-card'
import { ReactComponent as Rewind } from './img/rewind.svg';
import { ReactComponent as Nope } from './img/nope.svg';
import { ReactComponent as SuperLike } from './img/super like.svg';
import { ReactComponent as Like } from './img/like.svg';
import { ReactComponent as Boost } from './img/boost.svg';

const db = [
  {
    name: 'Juna à la maison',
    url: 'https://pbs.twimg.com/media/EgVbXTHXYAEF6Au?format=jpg&name=large'
  },
  {
    name: 'Juna à la plage',
    url: 'https://pbs.twimg.com/media/EbdV7ytXkAAxHMj?format=jpg&name=large'
  }
]

const alreadyRemoved = []
let charactersState = db // This fixes issues with updating characters state forcing it to use the current state and not the state that was active when the card was created.

function App () {
  const [characters, setCharacters] = useState(db)
  const [lastDirection, setLastDirection] = useState()

  const childRefs = useMemo(() => Array(db.length).fill(0).map(i => React.createRef()), [])

  const swiped = (direction, nameToDelete) => {
    console.log('removing: ' + nameToDelete)
    setLastDirection(direction)
    alreadyRemoved.push(nameToDelete)
  }

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!')
    charactersState = charactersState.filter(character => character.name !== name)
    setCharacters(charactersState)
  }

  const swipe = (dir) => {
    const cardsLeft = characters.filter(person => !alreadyRemoved.includes(person.name))
    if (cardsLeft.length) {
      const toBeRemoved = cardsLeft[cardsLeft.length - 1].name // Find the card object to be removed
      const index = db.map(person => person.name).indexOf(toBeRemoved) // Find the index of which to make the reference to
      alreadyRemoved.push(toBeRemoved) // Make sure the next card gets removed next time if this card do not have time to exit the screen
      childRefs[index].current.swipe(dir) // Swipe the card!
    }
  }

  return (
    <div className='app'>
      <div>
        <h1>The Juna Gallery</h1>
        <div className='cardContainer'>
          {characters.map((character, index) =>
            <TinderCard
              ref={childRefs[index]}
              className='swipe'
              key={character.name}
              onSwipe={(dir) => swiped(dir, character.name)}
              onCardLeftScreen={() => outOfFrame(character.name)}>
                <div style={{ backgroundImage: 'url(' + character.url + ')' }} className='card'>
                  <h3>{character.name}</h3>
                </div>
            </TinderCard>
          )}
        </div>
        <div className='buttons'>
            <Rewind
              className='button'
            />
            <Nope
              onClick={() => swipe('left')}
              className='button'
            />
            <SuperLike
              onClick={() => swipe('right')}
              className='button'
            />
            <Like
              onClick={() => swipe('right')}
              className='button'
            />
            <Boost
              className='button'
            />
        </div>
      </div>
    </div>
  )
}

export default App