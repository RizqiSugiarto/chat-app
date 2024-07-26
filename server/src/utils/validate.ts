import { VALIDATION_MSGS, VALIDATION_TYPES } from "../constants.js";
export default function validate(payload: any, type: string) {
  switch (type) {
    case VALIDATION_TYPES.SIGNUP_REQ:
      if (!payload?.email) {
        return VALIDATION_MSGS.NO_EMAIL;
      } else if (!payload?.password) {
        return VALIDATION_MSGS.NO_PASSWORD;
      } else if (!payload?.name) {
        return VALIDATION_MSGS.NO_NAME;
      }
      return VALIDATION_MSGS.VALIDATED;
    case VALIDATION_TYPES.LOGIN_REQ:
      if (!payload?.email) {
        return VALIDATION_MSGS.NO_EMAIL;
      } else if (!payload?.password) {
        return VALIDATION_MSGS.NO_PASSWORD;
      }
      return VALIDATION_MSGS.VALIDATED;
  }
}
