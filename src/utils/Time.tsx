

export function formatDuration( duration_ms: number ) {
    let seconds = ((duration_ms % 60000) / 1000).toFixed(0);
    let minutes = Math.floor(duration_ms / 60000);
    if( seconds == '60' ) {
        seconds = '00';
        minutes += 1;
    }
    if( seconds.length == 1 ) {
        seconds = '0' + seconds;
    }
    return `${minutes}:${seconds}`;
}