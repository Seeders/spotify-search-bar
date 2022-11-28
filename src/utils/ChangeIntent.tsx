var lastChangeTimer: NodeJS.Timer | null = null;

export default function changeIntent( doChange: Function, changeDelay: number ) : undefined {
    
    if( lastChangeTimer != null ) {
        clearTimeout(lastChangeTimer);
    }
    lastChangeTimer = setTimeout( () => {
        doChange();
    }, changeDelay );

    return undefined;
}