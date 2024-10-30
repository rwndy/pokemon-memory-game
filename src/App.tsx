import { useState } from 'react'
import './App.css'
import MockCardGame from './json/mock-data.json'
import CardBlack from '/assets/illustrations/tcg-card-back.jpg'
import { CardData, MockData } from './utils/types'
import { useMemoryGame } from './utils/hooks/useMemoryGame'
import { shuffleCards } from './utils/helper'

function App(): JSX.Element {
    const [shuffledCards, setShuffledCards] = useState<CardData[]>([])
    const cards = (MockCardGame as MockData).data

    const {
        gameState: { flippedCards, matchedPairs, moves, gameStarted, score },
        handleCardClick,
        startGame: startGameLogic,
        resetGame: resetGameLogic
    } = useMemoryGame(cards)

    const startGame = () => {
        setShuffledCards(shuffleCards(cards))
        startGameLogic()
    }

    const resetGame = () => {
        setShuffledCards(shuffleCards(cards))
        resetGameLogic()
    }

    return (
        <main className="game-container">
            <div className="game-header">
                <h4>
                    <div className="header-content">
                        <img
                            src="/assets/pokeball.png"
                            alt="pokeball icon"
                            width={32}
                            height={32}
                        />
                        <span className="title-pokemon">Pokémon</span>
                        <span className="title-match">Match Memory Game</span>
                    </div>
                </h4>

                <div className="buttons-container">
                    <button
                        onClick={gameStarted ? resetGame : startGame}
                        className="game-button primary"
                    >
                        {gameStarted ? 'Reset Game' : 'Start Game'}
                    </button>
                    <button className="game-button secondary">Settings</button>
                </div>
            </div>

            {gameStarted && (
                <div className="game-stats">
                    <div className="stat-card">
                        <span className="stat-label">Moves</span>
                        <span className="stat-value">{moves}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Score</span>
                        <span className="stat-value">{score}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Matches</span>
                        <span className="stat-value">
                            {matchedPairs.length / 2}
                        </span>
                    </div>
                </div>
            )}

            <div className="layout-board">
                <div className="layout-card-container">
                    {shuffledCards.map((card: CardData) => {
                        const isFlipped =
                            flippedCards.includes(card.id) ||
                            matchedPairs.includes(card.id)
                        const isMatched = matchedPairs.includes(card.id)

                        return (
                            <div
                                key={card.id}
                                className={`card ${isMatched ? 'matched' : ''}`}
                                onClick={() =>
                                    gameStarted &&
                                    !isMatched &&
                                    handleCardClick(card.id)
                                }
                            >
                                <div
                                    className={`card-inner ${isFlipped ? 'flipped' : ''}`}
                                >
                                    <div className="card-front">
                                        <div className="card-pattern">
                                            <div className="pokeball-pattern"></div>
                                        </div>
                                        <img src={CardBlack} alt="card-back" />
                                    </div>
                                    <div className="card-back">
                                        <img
                                            src={card.image}
                                            alt={`Pokemon card ${card.pairId}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <footer className="game-footer">
                <div className="footer-links">
                    <a
                        href="https://www.pokemon.com/us/pokedex/"
                        className="footer-link"
                    >
                        Pokédex
                    </a>
                    <a
                        href="https://www.pokemon.com/us/pokemon-tcg"
                        className="footer-link"
                    >
                        Trading Cards
                    </a>
                    <a
                        href="https://www.pokemon.com/us/strategy/tips-to-get-started-in-pokemon-go-trainer-battles"
                        className="footer-link"
                    >
                        Battle Guide
                    </a>
                </div>
                <p className="footer-trivia">
                    Did you know? The first Pokémon Memory Game was released in
                    1996!
                </p>
            </footer>
        </main>
    )
}

export default App
