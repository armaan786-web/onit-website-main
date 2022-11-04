const date = new Date();
const arr = String(date).split(" ");
export const today = `${arr[0]}, ${arr[1]} ${arr[2]}, ${arr[3]}`;
