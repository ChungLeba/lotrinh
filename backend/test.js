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
/* ---------------- */
/* var choose = 6
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
} */
/* -------------- */

/*
1. query > slug
2. slug > origin
3. find(origin)/chieudi,chieuve > kq (điểm đi, điểm đến, đi qua)
 */

var cactinh = 
[
  { no: 1, name: 'Hà Nội', name_slug: 'ha-noi' },
  { no: 2, name: 'Hà Giang', name_slug: 'ha-giang' },
  { no: 3, name: 'Cao Bằng', name_slug: 'cao-bang' },
  { no: 4, name: 'Bắc Kạn', name_slug: 'bac-kan' },
  { no: 5, name: 'Tuyên Quang', name_slug: 'tuyen-quang' },
  { no: 6, name: 'Lào Cai', name_slug: 'lao-cai' },
  { no: 7, name: 'Điện Biên', name_slug: 'dien-bien' },
  { no: 8, name: 'Lai Châu', name_slug: 'lai-chau' },
  { no: 9, name: 'Sơn La', name_slug: 'son-la' },
  { no: 10, name: 'Yên Bái', name_slug: 'yen-bai' },
  { no: 11, name: 'Hoà Bình', name_slug: 'hoa-binh' },
  { no: 12, name: 'Thái Nguyên', name_slug: 'thai-nguyen' },
  { no: 13, name: 'Lạng Sơn', name_slug: 'lang-son' },
  { no: 14, name: 'Quảng Ninh', name_slug: 'quang-ninh' },
  { no: 15, name: 'Bắc Giang', name_slug: 'bac-giang' },
  { no: 16, name: 'Phú Thọ', name_slug: 'phu-tho' },
  { no: 17, name: 'Vĩnh Phúc', name_slug: 'vinh-phuc' },
  { no: 18, name: 'Bắc Ninh', name_slug: 'bac-ninh' },
  { no: 19, name: 'Hải Dương', name_slug: 'hai-duong' },
  { no: 20, name: 'Hải Phòng', name_slug: 'hai-phong' },
  { no: 21, name: 'Hưng Yên', name_slug: 'hung-yen' },
  { no: 22, name: 'Thái Bình', name_slug: 'thai-binh' },
  { no: 23, name: 'Hà Nam', name_slug: 'ha-nam' },
  { no: 24, name: 'Nam Định', name_slug: 'nam-dinh' },
  { no: 25, name: 'Ninh Bình', name_slug: 'ninh-binh' },
  { no: 26, name: 'Thanh Hóa', name_slug: 'thanh-hoa' },
  { no: 27, name: 'Nghệ An', name_slug: 'nghe-an' },
  { no: 28, name: 'Hà Tĩnh', name_slug: 'ha-tinh' },
  { no: 29, name: 'Quảng Bình', name_slug: 'quang-binh' },
  { no: 30, name: 'Quảng Trị', name_slug: 'quang-tri' },
  { no: 31, name: 'Thừa Thiên Huế', name_slug: 'thua-thien-hue' },
  { no: 32, name: 'Đà Nẵng', name_slug: 'da-nang' },
  { no: 33, name: 'Quảng Nam', name_slug: 'quang-nam' },
  { no: 34, name: 'Quảng Ngãi', name_slug: 'quang-ngai' },
  { no: 35, name: 'Bình Định', name_slug: 'binh-dinh' },
  { no: 36, name: 'Phú Yên', name_slug: 'phu-yen' },
  { no: 37, name: 'Khánh Hòa', name_slug: 'khanh-hoa' },
  { no: 38, name: 'Ninh Thuận', name_slug: 'ninh-thuan' },
  { no: 39, name: 'Bình Thuận', name_slug: 'binh-thuan' },
  { no: 40, name: 'Kon Tum', name_slug: 'kon-tum' },
  { no: 41, name: 'Gia Lai', name_slug: 'gia-lai' },
  { no: 42, name: 'Đắk Lắk', name_slug: 'dak-lak' },
  { no: 43, name: 'Đắk Nông', name_slug: 'dak-nong' },
  { no: 44, name: 'Lâm Đồng', name_slug: 'lam-dong' },
  { no: 45, name: 'Bình Phước', name_slug: 'binh-phuoc' },
  { no: 46, name: 'Tây Ninh', name_slug: 'tay-ninh' },
  { no: 47, name: 'Bình Dương', name_slug: 'binh-duong' },
  { no: 48, name: 'Đồng Nai', name_slug: 'dong-nai' },
  { no: 49, name: 'Bà Rịa - Vũng Tàu', name_slug: 'ba-ria-vung-tau' },
  { no: 50, name: 'Hồ Chí Minh', name_slug: 'ho-chi-minh' },
  { no: 51, name: 'Long An', name_slug: 'long-an' },
  { no: 52, name: 'Tiền Giang', name_slug: 'tien-giang' },
  { no: 53, name: 'Bến Tre', name_slug: 'ben-tre' },
  { no: 54, name: 'Trà Vinh', name_slug: 'tra-vinh' },
  { no: 55, name: 'Vĩnh Long', name_slug: 'vinh-long' },
  { no: 56, name: 'Đồng Tháp', name_slug: 'dong-thap' },
  { no: 57, name: 'An Giang', name_slug: 'an-giang' },
  { no: 58, name: 'Kiên Giang', name_slug: 'kien-giang' },
  { no: 59, name: 'Cần Thơ', name_slug: 'can-tho' },
  { no: 60, name: 'Hậu Giang', name_slug: 'hau-giang' },
  { no: 61, name: 'Sóc Trăng', name_slug: 'soc-trang' },
  { no: 62, name: 'Bạc Liêu', name_slug: 'bac-lieu' },
  { no: 63, name: 'Cà Mau', name_slug: 'ca-mau' }
]
/* let tinhcantim = 'ca-mau'
function timtinh(kqtimtinh){
  return kqtimtinh.name_slug === tinhcantim
}


console.log(cactinh.find(timtinh)) */

/* var a = 
[
  {
    id: "620f5ee0bc2344d8fe18655b",
    tenncc: 'LỘ TRÌNH VIỆT'
  },
  { id: "620fb6c82b3f6d5556725c37", tenncc: 'A' }
]

for (const key in a) {
  //console.log(a[key])
  console.log('<option value="'+(a[key].id)+'" selected >'+a[key].tenncc+'</option>')
  
} */
console.log(cactinh.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))) 
