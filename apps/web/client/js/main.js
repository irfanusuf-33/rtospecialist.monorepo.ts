export function nameValidation (name) {
  if (name.includes(' ')) {
    return { valid: false, error: 'Invalid firstname/lastname spaces not allowed' };
  }
  // Only letters A-Z or a-z allowed
  if (!/^[A-Za-z]+$/.test(name)) {
    return { valid: false, error: 'Special characters or numbers not allowed' };
  }
  if (name.length < 2 || name.length > 30) {
    return { valid: false, error: 'Firstname/Lastname must be between 2 and 30 characters' };
  }
  return { valid: true };
}
export function nameValidationWithSpaces (name) {
  let format = /^[A-Za-z\s]{3,30}$/;
  if (name.match(format)) {
    return true;
  }
  return false;
}

export function alphanumericWithSpacesValidation (input) {
  let format = /^[A-Za-z0-9\s]{3,30}$/;
  return format.test(input);
}

export function containsSpecialCharacters (input) {
  return /[^A-Za-z0-9\s]/.test(input);
}

export function appointmentEmailValidation (email) {
  const domainParts = email.split('@')[1]?.split('.') || [];
  if (domainParts.length > 4) {
    return false;
  }
  let format = /^(?=.{5,254}$)\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return format.test(email);
}

export function appointmentPhoneValidation (phone) {
  let format = /^\+?\d{8,15}$/;
  return format.test(phone);
}

export function appointmentMessageValidation (input) {
  return /[^A-Za-z0-9\s,.'"\-]/.test(input);
}

export function containsNumbers (input) {
  return /\d/.test(input);
}

export function emailValidation (email) {

  let format = /^(?=.{5,254}$)\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (email.match(format)) {
    return true;
  }
  return false;
}

export function passwordValidation (password) {

  let format = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (password.match(format)) {
    return true;
  }
  return false;
}

export function validateAustralianPhoneNumber (phone) {

  let format = /^\d{8,15}$/;
  if (phone.match(format)) {
    return true;
  }
  return false;
}

export function getObjectLength (obj) {
  return Object.keys(obj).length;
}

export function checkIfPasswordsMatch (password, confirm) {

  return (password.trim() === confirm.trim());
}

export function containsDigitsOnly (text) {
  let format = /^[0-9]+$/;
  if (text.match(format)) {
    return true;
  }
  return false;
}

export function isRegExp (value) {
  let format = /^[a-zA-Z\s]+$/;
  if (value.match(format)) {
    return true;
  }
  return false;
}

export function containsEmailorDigits (summary) {
  const format = /^(?!.*\d)(?!.*[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})(?!.*[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+$).+$/;
  if (summary.match(format)) {
    return false;
  }
  return true;
}

export function titleValidation (title) {
  const t = title || "";
  const format = /^[A-Za-z0-9 _-]+$/;
  return format.test(t);
}

export function textFieldValidation (text) {
  const format = /^[A-Za-z\s&'-]{2,50}$/; // min 2, max 50 chars
  if (text.match(format)) {
    return true;
  }
  return false;
}

export function gstDateValidation (date) {
  const format = /^\d{4}-\d{2}-\d{2}$/;
  if (date.match(format)) {
    return true;
  }
  return false;
}