const appPrefix = "spotify";

export default function getClassName( mainClass: string, secondaryClass?: string ) : string {    
    if( secondaryClass ) {
        return `${appPrefix}_${mainClass} ${appPrefix}_${secondaryClass}`;
    } else {
        return `${appPrefix}_${mainClass}`;
    }
}
