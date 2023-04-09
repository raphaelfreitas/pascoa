(() => {
  $ = jQuery;

  let html5QrcodeScanner = false;

  /* Menu */

  $(document).on('click', 'footer a', function(){

    const menu = $(this).data('menu');

    $(this).parents('footer').find('a').removeClass('active');
    $(this).addClass('active');

    $(document).find('main.content').removeClass('active');
    $(document).find(`main.content#${menu}`).addClass('active');

    updateEggsBasket();
    
  });

  updateEggsBasket();

  $(document).on('click', 'main#home .botoes a', function(){
    let dica = $(this).data('dica');
    window.localStorage.setItem('dica', dica);
    updateEggsBasket();
  })

  /* Eggs */


  function updateEggsBasket(){
    const eggs = $(document).find('.eggs');
    const eggs_storage = window.localStorage.getItem('eggs');
    let foundEggs;
  
    if(eggs_storage !== ''){
      foundEggs = JSON.parse(eggs_storage) || [];
    } else {
      foundEggs = [];
    }
  
    if(!Array.isArray(foundEggs)){
      foundEggs = [];
    }

    if( eggs !== 'undefined'){

      eggs.html('');

      for(let i = 1; i <= 12; i++){
        eggs.append(`
                    <div class="egg disabled" key="${i}">
                      <img src="img/ovos/${i}.png" />
                    </div>`);
      }

      let numFound = 0;

      $.each(foundEggs, function(k, v){
        eggs.find(`.egg[key="${v}"]`).removeClass('disabled');
        numFound++;
      });

      if(numFound == 12){

        const dica = window.localStorage.getItem('dica');

        if(dica){
          for(let d=1; d<=4; d++){
            if(dica != d){
              $('main#home').find(`.botoes a[data-dica="${d}"]`).addClass('disabled');
            }
          }
        }

        $('main#home').addClass('com_dicas');


      }

      $(document).find('.ovos_encontrados').text(`${numFound}/12`);

    }

  }


  /* QR */

  if( typeof(Html5QrcodeScanner) !== 'undefined'){
  
    function onScanSuccess(decodedText, decodedResult) {

      if($('main#qr').hasClass('active')){

        if(decodedText.includes('egg---')){

          const eggNumber = decodedText.split('egg---');

          if(typeof (eggNumber[1]) !== 'undefined'){
            const number = parseInt(eggNumber[1]);

            if(number > 0 && number <=12){
              
              const eggs_storage = window.localStorage.getItem('eggs');
              let foundEggs;
            
              if(eggs_storage !== ''){
                foundEggs = JSON.parse(eggs_storage) || [];
              } else {
                foundEggs = [];
              }
            
              if(!Array.isArray(foundEggs)){
                foundEggs = [];
              }

              if(!foundEggs.includes(number)){

                html5QrcodeScanner = false;

                foundEggs.push(number);

                $('main#qr').addClass('novo');

                $('main#qr .img_novo_ovo').html(`
                  <img src="img/ovos/${number}.png" class="novo_ovo" />
                `);

                $('main#qr h1').text('Novo Ovo encontrado!');

                window.localStorage.setItem('eggs', JSON.stringify(foundEggs));

                setTimeout(() => {
                  $(document).find('a[data-menu="eggs"]').trigger('click');
                  $('main#qr').removeClass('novo');
                }, 3000);

              } else if(!$('main#qr').hasClass('novo')) {
                $('main#qr h1').text('Você já achou este ovo antes!');
                setTimeout(() => {
                  $('main#qr h1').text('');
                }, 2000);
              }
            } else {
              $('main#qr h1').text('QR Code Inválido!');
                setTimeout(() => {
                  $('main#qr h1').text('');
                }, 2000);
            }
          }

        }

        if(decodedText == 'egg--reset'){
          window.localStorage.setItem('eggs', []);
          $('main#qr h1').text('Ovos apagados!');
          setTimeout(() => {
            $('main#qr h1').text('');
          }, 2000);
        }

        if(decodedText.includes('egg--resetDica')){
          window.localStorage.setItem('dica', '');
          $('main#qr h1').text('Dica apagadas!');
          setTimeout(() => {
            $('main#qr h1').text('');
          }, 2000);
        }
      }

      // handle the scanned code as you like, for example:
      console.log(`Code matched = ${decodedText}`, decodedResult);
    }
    
    function onScanFailure(error) {
      // handle scan failure, usually better to ignore and keep scanning.
      // for example:
      if($('main#qr').hasClass('active')){
        console.warn(`Code scan error = ${error}`);
      }
    }
    
    html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 5, qrbox: {width: 250, height: 250} },
      /* verbose= */ false);
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
  }

  function closeIt()
  {
    html5QrcodeScanner = false;
  }
  window.onbeforeunload = closeIt;

  
})();