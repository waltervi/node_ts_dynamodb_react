type DoneFunction = ( err : object | undefined , result : object | undefined ) => void;

interface UserDataType {
    userId: string;
    until: string;
    clave: string;
}


  
export {DoneFunction,UserDataType}
