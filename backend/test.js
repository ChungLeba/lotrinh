/* const userInput = '05:20';
const hours = userInput.slice(0, 2);
const minutes = userInput.slice(3);

const date = new Date();
date.setHours(hours, minutes);
console.log(hours, minutes) */


/* function slugify(string) {
    const a = "àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ·/_,:;"
    const b = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd------"
    const p = new RegExp(a.split('').join('|'), 'g')
  
    return string.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text
}

console.log(slugify('Điểm dừng tại 617 Nguyễn Tất Thành, Phường Xuân Hà, Quận Thanh Khê, Đà Nẵng')) */
var choose = 6
var sl = [{1:"a"},{2:"b"},{3:"c"},{4:"d"},{5:"e"}, {6:"f"}]
//console.log(Object.values(Object.values(sl)[0])[0])
for (const key in sl) {
  //console.log(sl[key])
  let k = parseInt(key) + 1
  if (k==choose){
    console.log('<option value="'+(k)+'" selected >'+Object.values(Object.values(sl)[key])[0]+'</option>')
  } else {
    console.log('<option value="'+(k)+'">'+Object.values(Object.values(sl)[key])[0]+'</option>')
  }
}