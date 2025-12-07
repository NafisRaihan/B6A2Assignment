export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateRole = (role: string): boolean => {
  return ['admin', 'customer'].includes(role);
};

export const validateVehicleType = (type: string): boolean => {
  return ['car', 'bike', 'van', 'SUV'].includes(type);
};

export const validateBookingStatus = (status: string): boolean => {
  return ['active', 'cancelled', 'returned'].includes(status);
};

export const validateAvailabilityStatus = (status: string): boolean => {
  return ['available', 'booked'].includes(status);
};

export const calculateDays = (startDate: Date, endDate: Date): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
