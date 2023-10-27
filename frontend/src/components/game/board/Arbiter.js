import { useRef, useEffect } from 'react';
import { useGame } from '../../../contexts/GameContext';
import { useUsers } from '../../../contexts/UsersContext';
import checkThreefoldRepetition from '../../../helpers/ThreefoldRepetition';
import updateAvailableMoves from '../../../helpers/AvailableMoves';
import updateSquares from '../../../helpers/SquaresUpdate';
import Pieces from './Pieces';

export default function Arbiter({ setPromotionMenu }) {
    const { game, dispatchGame } = useGame();
    const { users } = useUsers();
    const availableMoves = useRef({ w: {}, b: {} });
    const attackedSquares = useRef({ w: [], b: [] });
    const kingCheckSquares = useRef({ w: [], b: [] });
    const pinnedSquares = useRef({ w: [], b: [] });

    useEffect(() => {
        if (!game.result) {
            if (game.prevMoves.length >= 10) {
                checkThreefoldRepetition(game.prevMoves, dispatchGame);
            }

            updateSquares(game, { attackedSquares, kingCheckSquares, pinnedSquares }, users.player);
            updateAvailableMoves(game, { attackedSquares, kingCheckSquares, pinnedSquares }, availableMoves, dispatchGame, users.player);
        } 
    });

    return (
        <Pieces
            setPromotionMenu={setPromotionMenu}
            availableMoves={availableMoves}
        />
    );
}
