var lastChangeTimer: NodeJS.Timer | null = null;

export default function changeIntent( value: string, doChange: Function, changeDelay: number ) : undefined {
    
    if( lastChangeTimer != null ) {
        clearTimeout(lastChangeTimer);
    }
    lastChangeTimer = setTimeout( () => {
        doChange(value);
    }, changeDelay );

    return undefined;
}