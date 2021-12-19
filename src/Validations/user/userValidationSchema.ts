import * as yup from 'yup'

const UserValidator = yup.object().shape({
  email: yup.string().email('Invalid email provided'),
  password: yup.string().required().min(6)
});

// ===========================================================
// EXPORT PERSON VALIDATOR CLASS
// ===========================================================
export {
  UserValidator
}
