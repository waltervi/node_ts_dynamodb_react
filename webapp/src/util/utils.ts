const Utils = {
  // getCookie: (name: string): string | null => {
  //   const dc = document.cookie;
  //   console.log("getCookie:", document.cookie);
  //   const prefix = name + "=";
  //   let begin = dc.indexOf("; " + prefix);
  //   let end = 0;
  //   if (begin == -1) {
  //     begin = dc.indexOf(prefix);
  //     if (begin != 0) {
  //       console.log("begin != 0");
  //       return null;
  //     }
  //   } else {
  //     begin += 2;
  //     end = document.cookie.indexOf(";", begin);
  //     if (end == -1) {
  //       end = dc.length;
  //     }
  //   }
  //   // because unescape has been deprecated, replaced with decodeURI
  //   //return unescape(dc.substring(begin + prefix.length, end));
  //   console.log("getCookie", dc);
  //   const decoded = dc.substring(begin + prefix.length, end);
  //   console.log("decoded", decoded);
  //   return decoded;
  // },
  getAxiosConfig: () => {
    const config = {
      withCredentials: true,
    };
    return config;
  },
};


const VariablesUtil = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hasValue(v: any) {
    return v !== undefined && v !== null;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isBoolean (v : any){
    return v === true || v === false;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isNumber( v : any){
    return v == parseInt(v, 10)
  }


};

const StringUtil = {

  requiredString : function (s?: string | null | undefined, maxLength : number | undefined = undefined) {
    if (s === undefined || s === null || s === "") {
      return false;  
    }

    s = s.trim()

    if( s === "" ){
      return false;  
    }
    
    if(  maxLength !== undefined && s.length > maxLength){
      return false;  
    }

    return true;
  },

  isEmpty : function (s?: string | null | undefined) {
    if (s === undefined || s === null || s === "") {
      return true;  
    }
    return s.trim() === "";
  },

  isValidDescription : function (s: string | undefined | null){
    return s !== undefined && s !== null && s.length <= 500;
  },

  isValidColor : function (s: string | undefined | null){
    return s !== undefined && s !== null && s.length <= 10;
  },
  
  isValidURL : function (x: string){
    return (x.startsWith("http://") || x.startsWith("https://")) && this.isValidDescription(x)
  }
};

const BytesUtil = {
  isContentGreaterThan10k: function (o: object): boolean {
    let result = false;
    if (o) {
      result = this.getByteSize(o) > 10240;
    }
    return result;
  },

  shouldCreateANewBucket: function (o: object): boolean {
    let result = false;
    if (o) {
      result = this.getByteSize(o) > this.getMaxRecordSize();
    }
    return result;
  },
  getByteSize: function (o: object) {
    let size = 0;
    if (o) {
      const s = JSON.stringify(o);
      size = new Blob([s]).size;
    }
    return size;
  },
  getMaxRecordSize: function () {
    return 4200;
  },
};
 

const DateUtil = {


  validateAndParseUTCDate: (s: string | null | undefined): DateDto => {

    if (! VariablesUtil.hasValue(s) || StringUtil.isEmpty(s)){
      return { result: false, value: null };
    }

    const data = s as string;


    //const regex = new RegExp("d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2]d|3[0-1])T(?:[0-1]d|2[0-3]):[0-5]d:[0-5]dZ");
    const regex = new RegExp("^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$");
    
    if (!regex.test(data)) return { result: false, value: null };
    const d = new Date(data);

    const ret: DateDto = { result: false, value: null };
    if (d instanceof Date && !isNaN(d.getTime()) && d.toISOString() === s) {
      ret.result = true;
      ret.value = d;
    }
    return ret;
  },
};


interface DateDto {
  result: boolean;
  value: Date | null;
}

const Validator = {
  Strings: StringUtil,
  Dates: DateUtil,
  Bytes: BytesUtil,
  Variables : VariablesUtil

};


export { Utils ,Validator};
