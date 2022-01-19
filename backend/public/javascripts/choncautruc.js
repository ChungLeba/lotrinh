//Chọn theo cấu trúc
          //Chọn tỉnh
          var cactinh =['<option value="NA">Chọn Tỉnh/thành phố</option>',];
          for (var key in diachi.data){
              //console.log(`${key}: ${diachi.data[key].name}`)
              var idtinh = parseInt(key)+1;
              //console.log(typeof key)
              tinh=`${diachi.data[key].name}`
              cactinh.push('<option value='+key+'>'+tinh+'</option>')
              
          }
          var kqtinh = '<select id="select_tinh" class="form-control is-invalid" aria-label="Default select example">'+cactinh+'</select>';
          $("#select_tinh").replaceWith(kqtinh)
          //Tinh to Quan/huyen
          
          $("#select_tinh").change(function(){
            
            var idTinh = $('#select_tinh').val()
            console.log(idTinh)
            console.log(diachi.data[idTinh].level2s)
            var cacHuyen = diachi.data[idTinh].level2s
            var luachonchuyen=['<option value="NA">Chọn Quận/huyện</option>',]
            let i = 0;
            for (var element of cacHuyen){
                huyen = element.name
                //console.log('- '+huyen)
                luachonchuyen.push('<option value='+i+'>'+huyen+'</option>')
                i++
            }
            //console.log(luachonchuyen)
            var kqhuyen = '<select id="select_quan" class="form-control is-invalid" aria-label="Default select example">'+luachonchuyen+'</select>';
            $("#select_quan").replaceWith(kqhuyen)
  
            //Quan to xa/phuong
            $("#select_quan").change(function(){
              var idTinh = $('#select_tinh').val()
              var idHuyen = $('#select_quan').val()
              var cacHuyen = diachi.data[idTinh].level2s
              let cacXa = diachi.data[idTinh].level2s[idHuyen].level3s;
              console.log(cacXa)
              var luachonxa=[]
              let i = 0;
              for (let element of cacXa){
                  xa = element.name
                  console.log('- '+xa)
                  luachonxa.push('<option value='+i+'>'+xa+'</option>')
                  i++
              }
              //console.log(luachonchuyen)
              var kqxa = '<select id="select_phuong" class="form-control is-invalid" aria-label="Default select example">'+luachonxa+'</select>';
              $("#select_phuong").replaceWith(kqxa)
            })
            
          })