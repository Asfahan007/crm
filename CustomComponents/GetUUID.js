import uuid from 'react-native-uuid';
function generateUUID() {
  return uuid.v4();
}

export default generateUUID;