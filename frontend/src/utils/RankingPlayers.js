/**
 * Fetches ranking players data from server and sets players state with it.
 * @param {React.Dispatch<React.SetStateAction<players>>} setPlayers 
 * @param {number} count 
 * @returns {Promise<void>}
 */
export default function getRankingPlayers(setPlayers, count) {
    fetch(`/api/v1/ranking?count=${count}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then((data) => {
        setPlayers([...data, ...Array(count - data.length).fill('')]);
    })
    .catch((error) => {
        console.log(error);
    });
}
