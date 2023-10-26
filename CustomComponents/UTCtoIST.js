export default function parseTimestampToIST(timestamp) {
    const year = parseInt(timestamp.slice(0, 4));
    const month = parseInt(timestamp.slice(5, 7)) - 1; // start from 0 indes
    const day = parseInt(timestamp.slice(8, 10));
    const hour = parseInt(timestamp.slice(11, 13));
    const minute = parseInt(timestamp.slice(14, 16));
    const second = parseInt(timestamp.slice(17, 19));
    const millisecond = parseInt(timestamp.slice(20, 23));
  
    return Date.UTC(year, month, day, hour, minute, second, millisecond);
  }