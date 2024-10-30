import { useState, useCallback } from 'react'

export interface CardData {
    id: number
    pairId: string
    image: string
}

export interface GameState {
    flippedCards: number[]
    matchedPairs: number[]
    moves: number
    gameStarted: boolean
    isLocked: boolean
    score: number
}

const initialGameState: GameState = {
    flippedCards: [],
    matchedPairs: [],
    moves: 0,
    gameStarted: false,
    isLocked: false,
    score: 0
}

export const useMemoryGame = (cards: CardData[]) => {
    const [gameState, setGameState] = useState<GameState>(initialGameState)

    const checkForMatch = useCallback(
        (firstId: number, secondId: number): boolean => {
            const firstCard = cards.find((card) => card.id === firstId)
            const secondCard = cards.find((card) => card.id === secondId)
            return firstCard?.pairId === secondCard?.pairId
        },
        [cards]
    )

    const handleCardClick = useCallback(
        (cardId: number): void => {
            setGameState((prev) => {
                if (
                    prev.isLocked ||
                    prev.matchedPairs.includes(cardId) ||
                    prev.flippedCards.includes(cardId)
                ) {
                    return prev
                }

                const newFlippedCards = [...prev.flippedCards, cardId]

                if (newFlippedCards.length === 2) {
                    const [firstCard, secondCard] = newFlippedCards

                    if (checkForMatch(firstCard, secondCard)) {
                        const newScore = prev.score + 100
                        return {
                            ...prev,
                            flippedCards: [],
                            matchedPairs: [
                                ...prev.matchedPairs,
                                firstCard,
                                secondCard
                            ],
                            moves: prev.moves + 1,
                            score: newScore
                        }
                    }

                    setTimeout(() => {
                        setGameState((current) => ({
                            ...current,
                            flippedCards: [],
                            isLocked: false
                        }))
                    }, 1000)

                    return {
                        ...prev,
                        flippedCards: newFlippedCards,
                        moves: prev.moves + 1,
                        isLocked: true,
                        score: Math.max(0, prev.score - 10)
                    }
                }

                return {
                    ...prev,
                    flippedCards: newFlippedCards
                }
            })
        },
        [checkForMatch]
    )

    const startGame = useCallback((): void => {
        setGameState({
            ...initialGameState,
            gameStarted: true
        })
    }, [])

    const resetGame = useCallback((): void => {
        setGameState(initialGameState)
    }, [])

    return {
        gameState,
        startGame,
        handleCardClick,
        resetGame
    }
}
