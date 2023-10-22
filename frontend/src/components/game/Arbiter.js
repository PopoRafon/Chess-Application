import { useRef, useEffect } from 'react';
import Pieces from './Pieces';
import { useGame } from '../../contexts/GameContext';
import updateSquares from '../../helpers/SquaresUpdate';
import checkThreefoldRepetition from '../../helpers/ThreefoldRepetition';
import updateAvailableMoves from '../../helpers/AvailableMoves';

export default function Arbiter({ setPromotionMenu }) {
    const { game, dispatchGame } = useGame();
    const availableMoves = useRef({ w: {}, b: {} });
    const attackedSquares = useRef({ w: [], b: [] });
    const kingCheckSquares = useRef({ w: [], b: [] });
    const pinnedSquares = useRef({ w: [], b: [] });

    useEffect(() => {
        if (!game.result) {
            if (game.prevMoves.length >= 10) {
                checkThreefoldRepetition(game.prevMoves, dispatchGame);
            }

            updateSquares({ attackedSquares, kingCheckSquares, pinnedSquares }, game);
            updateAvailableMoves(game, { attackedSquares, kingCheckSquares, pinnedSquares }, availableMoves, dispatchGame);
        } 
    });

    return (
        <Pieces
            setPromotionMenu={setPromotionMenu}
            availableMoves={availableMoves}
        />
    );
}