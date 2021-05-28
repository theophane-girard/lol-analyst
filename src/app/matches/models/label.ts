import { CONFIG } from "src/config/config"
import { LabelClasses } from "./label-classes"

export class Label {
  name: string
  labelClasses: LabelClasses

  static factory(str: string) {
    return {
      name: CONFIG.label[str],
      labelClasses: {
        hyperCarry: str === 'hyperCarry' ? true : false,
        inter: str === 'inter' ? true : false,
        newAccount: str === 'newAccount' ? true : false,
        troller: str === 'troller' ? true : false,
        carry: str === 'carry' ? true : false,
      }
    }
  }
}
