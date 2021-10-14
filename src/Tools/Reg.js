// exec 값이 null인 경우 정규식에 부합하지 않은 값.

const idReg = /^[A-Za-z]{1}[A-Za-z0-9]{4,14}$/;
const phoneReg = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
const passwordReg = /^(?=.*[a-zA-Z])((?=.*\d)(?=.*\W)).{8,20}$/;

export {idReg, phoneReg, passwordReg};
