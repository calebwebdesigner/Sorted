import { encode } from 'html-entities';

// format date object into nice-looking string
const niceifyDate = dateObject => {
  const dayWord = dateObject.toLocaleString('default', { weekday: 'short' });
  const dayNum = dateObject.getDate();
  const month = dateObject.toLocaleString('default', { month: 'long' });
  const year = dateObject.getFullYear();

  return `${dayWord}, ${dayNum} ${month} ${year}`;
};

// sanitisation
// remove all special chars from string
const removeSpecialChars = stringToSanitise => {
  // only allow alphanumeric chars, and spaces
  stringToSanitise = stringToSanitise.replace(/[^a-z0-9\s]/gi, '');

  return stringToSanitise;
};

// remove some special chars from string, html encode the rest, good for comment/email inputs
const removeSomeSpecialChars = stringToSanitise => {
  // remove obvious xss/etc. chars
  stringToSanitise = stringToSanitise.replace(/[</>]/g, '');

  // html encode the rest
  stringToSanitise = encode(stringToSanitise);

  return stringToSanitise;
};

export { niceifyDate, removeSpecialChars, removeSomeSpecialChars };
