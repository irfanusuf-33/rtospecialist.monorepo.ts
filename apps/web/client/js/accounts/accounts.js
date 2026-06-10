import { nameValidation, nameValidationWithSpaces, emailValidation, getObjectLength, validateAustralianPhoneNumber, passwordValidation, alphanumericWithSpacesValidation, containsSpecialCharacters, containsNumbers, appointmentEmailValidation, appointmentPhoneValidation, appointmentMessageValidation } from "../main";

// validate login form
export function validateLoginForm (email, password, accountType) {

  let obj = {};

 const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail === '') {
    obj.email = 'Email field empty';
  } else
  if (email.length > 254) {
    obj.email = 'Email should not exceed 254 characters';
  }
  else if (!emailValidation(normalizedEmail)) {
    obj.email = 'Enter a valid email ID';
  }
  if (password.trim() === '') {
    obj.password = 'Password field empty';
  } else if (password.length > 70) {
    obj.password = 'Password must not exceed 70 characters';
  }

  if (accountType === null) {
    obj.accounttype = 'Select your account type';
  }

  let valid = getObjectLength(obj) === 0;

  return {
    obj,
    valid,
    normalizedEmail
  };
}

export function resetpasswordForm (email, accountType) {

  let obj = {};

  if (email.trim() === '') {
    obj.email = 'enter email to send password reset link';
  }
  if (!obj.email) {
    if (!emailValidation(email)) {
      obj.email = 'enter a valid email ID';
    }
  }
  if (accountType === null) {
    obj.accounttype = 'select your account type';
  }

  let valid = getObjectLength(obj) === 0;

  return {
    obj,
    valid
  };
}

export function validateResetPasswordForm (password, confirmpassword){

  let obj = {};

  if (password.trim() === '') {
    obj.password = 'enter new password for your account';
  }

  if (confirmpassword.trim() === '') {
    obj.confirmpassword = 're-enter your password';
  }

  if (!obj.password) {
    if (!passwordValidation(password)) {
      obj.passwordlenerr = true;
    }
  }

  if (!obj.password && !obj.confirmpassword) {
    if (password.trim() !== confirmpassword.trim()) {
      obj.confirmpassword = 'passwords do not match';
    }
  }

  let valid = getObjectLength(obj) === 0;

  return {
    obj,
    valid
  };
}

export function validateRtoSpecialistRegistrationForm (formData) {

  let obj = {};
  const normalizedEmail = formData.email.trim().toLowerCase();

  if (formData.firstname.trim() === '') {
    obj.firstname = 'Enter your firstname';
  }

  if (formData.lastname.trim() === '') {
    obj.lastname = 'Enter your lastname';
  }

   if (normalizedEmail === '') {
    obj.email = 'Enter your email ID';
  }

  if (formData.phone.trim() === '') {
    obj.phone = 'Enter your mobile number';
  }

  if (formData.password.trim() === '') {
    obj.password = 'Set your password';
  }

  if (formData.confirmPassword.trim() === '') {
    obj.confirmpassword = 'Confirm your password';
  }

  if (!obj.firstname) {
    const result = nameValidation(formData.firstname);
    if (!result.valid) {
      obj.firstname = result.error;
    }
  }

  if (!obj.lastname) {
    const result = nameValidation(formData.lastname);
    if (!result.valid) {
      obj.lastname = result.error;
    }
  }

  if (!obj.email) {
    if (!emailValidation(formData.email)) {
      obj.email = 'Invalid email format';
    }
  }

  if (!obj.phone) {
    if (!validateAustralianPhoneNumber(formData.phone)) {
      obj.phone = 'Enter a valid phone number';
    }
  }

  if (!obj.password) {
    if (!passwordValidation(formData.password)) {
      obj.password = 'Min 8 Char, at least 1 letter, 1 uppercase, 1 numb & 1 special char';
    }
  }

  let valid = getObjectLength(obj) === 0;

 return {
    obj,
    valid,
    normalizedData: {
      ...formData,
      email: normalizedEmail
    }
  };
}

export function validateAppointmentForm (formData) {

  let obj = {};

  if (formData.firstName.trim() === '') {
    obj.firstname = 'Please enter your first name.';
  }  else if (containsSpecialCharacters(formData.firstName)) {
    obj.firstname = 'Invalid name. Only alphabets allowed.';
  } else if (containsNumbers(formData.firstName)) {
    obj.firstname = 'First name cannot contain numbers.';
  }

  if (formData.lastName.trim() === '') {
    obj.lastname = 'Please enter your last name.';
  } else if (containsSpecialCharacters(formData.lastName)) {
    obj.lastname = 'Invalid name. Only alphabets allowed.';
  } else if (containsNumbers(formData.lastName)) {
    obj.lastname = 'Last name cannot contain numbers.';
  }

  if (formData.email.trim() === '') {
    obj.email = 'Please enter your email address.';
  }

  if (formData.phoneNumber.trim() === '') {
    obj.phoneNumber = 'Please enter your phone number.';
  }

  if (formData.companyName.trim() === '') {
    obj.companyname = 'Please enter your company name.';
  } else if (containsSpecialCharacters(formData.companyName)) {
    obj.companyname = 'Invalid company name. Special characters not allowed.';
  }

  if (formData.position.trim() === '') {
    obj.location = 'Please enter your position.';
  } else if (containsSpecialCharacters(formData.position)) {
    obj.location = 'Invalid position. Special characters not allowed.';
  }

  if (formData.state.trim() === '') {
    obj.state = 'Please select your state.';
  }

  if (formData.message.trim() === '') {
    obj.message = 'Please type your message with clear information.';
  } else if (appointmentMessageValidation(formData.message)) {
    obj.message = 'Invalid message. Only letters, numbers, spaces, commas, periods, quotes, and hyphens allowed.';
  }

  if (!obj.firstname) {
    if (!nameValidationWithSpaces(formData.firstName)) {
      obj.firstname = 'First name should be between 3-30 characters.';
    }
  }

  if (!obj.lastname) {
    if (!nameValidationWithSpaces(formData.lastName)) {
      obj.lastname = 'Last name should be between 3-30 characters.';
    }
  }

  if (!obj.email) {
    if (!appointmentEmailValidation(formData.email)) {
      obj.email = 'Invalid email format or too many domain extensions';
    }
  }
  if (!obj.companyname) {
    if (!alphanumericWithSpacesValidation(formData.companyName)) {
      obj.companyname = 'Company name should be between 3-30 characters.';
    }   
  }

  if (!obj.location) {
    if (!alphanumericWithSpacesValidation(formData.position)) {
      obj.location = 'Position should be between 3-30 characters.';
    }
  }

  if (!obj.phone) {
    if (!appointmentPhoneValidation(formData.phoneNumber)) {
      obj.phone = 'Enter a valid phone number with optional + prefix';
    }
  }

  let valid = getObjectLength(obj) === 0;

  return {
    obj,
    valid
  };
}

export function verifyOtp (otp) {
  let obj = {};

  if (otp.trim() === "") {
    obj.otpErr = 'Enter your 8-digit otp';
  }

  else if (otp.length !== 8) {
    obj.otpErr = 'Invalid otp length';
  }

  let valid = getObjectLength(obj) === 0;
  return {
    obj,
    valid
  };
}

export function verifyEmailOtp (otp) {
  let obj = {};

  for (let i=0; i<otp.length; i++) {
    if (otp[i] === "") {
      obj.otp = 'Fields are empty!';
      break;
    }
  }
  let valid = getObjectLength(obj) === 0;
  return {
    obj,
    valid
  };
}

export function formatOtp (otp) {
  return otp.join('');
}


