
const getUserMessage= function( s: string | undefined){
  let r = s;

  if ( s === undefined){
    return r;
  }
  switch(s){
    case "COR_TOKEN_EMPTY":
      r = "Please Login"
      break;
  }

  return r;
}
const ErrorMessageService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get: (err: any) => {

    const arr: string[] = err.message.split(":");

    const code = arr[0];
    const messageCode = arr.length > 2 ? arr[2] : undefined;
    const message = getUserMessage(messageCode);
    const otherData = arr.length > 3 ? arr[3] : undefined;

    const ret = { code, message, otherData};
    return ret;
  },
};

export { ErrorMessageService };
