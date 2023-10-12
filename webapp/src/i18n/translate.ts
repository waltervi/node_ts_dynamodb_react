import { english_Messages, spanish_Messages, french_Messages, german_Messages, portuguese_Messages,italian_Messages } from "./messages"
import { UserContextType, LanguageEnum } from "../util/types";

function translate(userContext: UserContextType, key: string) {
  let messages : object | null = null;
  switch (userContext.language) {
    case LanguageEnum.ENGLISH:
      messages = english_Messages;
      break;
    case LanguageEnum.SPANISH:
      messages = spanish_Messages;
      break;
    case LanguageEnum.FRENCH:
      messages = french_Messages;
      break;
      case LanguageEnum.ITALIAN:
        messages = italian_Messages;
        break;      
    case LanguageEnum.GERMAN:
      messages = german_Messages;
      break;
    case LanguageEnum.PORTUGUESE:
      messages = portuguese_Messages;
      break;
    default:
      messages = english_Messages;
  }

  let value = messages[key];

  value = value !== undefined ? value : "";

  return value;
}

export { translate };
