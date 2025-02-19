function genHardCaptcha() {
  const specialChars = `!@#$%^&*()+`.split("");
  const alpha = `abcdefghijklmnopqrstuvwxyz`.split("");
  let str = "";
  for (let i = 0; i < 6; i++) {
    if (Math.random() > 0.5) {
      let al = alpha[Math.floor(Math.random() * alpha.length)];
      if (Math.random() > 0.8) {
        str += al.toUpperCase();
      } else {
        str += al;
      }
    } else {
      str += specialChars[Math.floor(Math.random() * specialChars.length)];
    }
  }
  return str;
}
export { genHardCaptcha };
