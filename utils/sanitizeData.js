// to return specific data
exports.sanitizeUserLogin = function (user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    nationalID: user.nationalID,
    birthDate: user.birthDate,
    bloodType: user.bloodType,
    city: user.city,
  };
};

exports.sanitizeUserSignup = function (user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    nationalID: user.nationalID,
    birthDate: user.birthDate,
    bloodType: user.bloodType,
    city: user.city,
  };
};

exports.sanitizeUserProfile = function (user) {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    nationalID: user.nationalID,
    birthDate: user.birthDate,
    bloodType: user.bloodType,
    city: user.city,
  };
};
