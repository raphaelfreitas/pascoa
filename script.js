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

      $(document).find('.ovos_encontrados').text(`${numFound}/12`);

    }

  }


  /* QR */

  if( typeof(Html5QrcodeScanner) !== 'undefined'){
  
    function onScanSuccess(decodedText, decodedResult) {

      if($('main#eggs').hasClass('active')){

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

                $('main#eggs').addClass('novo');

                $('main#eggs .img_novo_ovo').html(`
                  <h1>Novo Ovo encontrado!</h1>
                  <img src="img/ovos/${number}.png" class="novo_ovo" />
                `);

                $('main#eggs h1').text('Novo Ovo encontrado!');

                window.localStorage.setItem('eggs', JSON.stringify(foundEggs));

                setTimeout(() => {
                  $(document).find('a[data-menu="eggs"]').trigger('click');
                  $('main#eggs').removeClass('novo');
                }, 3000);

              } else if(!$('main#eggs').hasClass('novo')) {
                $('main#eggs h1').text('Você já achou este ovo antes!');
                setTimeout(() => {
                  $('main#eggs h1').text('');
                }, 2000);
              }
            } else {
              $('main#eggs h1').text('QR Code Inválido!');
                setTimeout(() => {
                  $('main#eggs h1').text('');
                }, 2000);
            }
          }

        }

        if(decodedText.includes('egg--reset')){
          window.localStorage.setItem('eggs', []);
          $('main#eggs h1').text('Ovos apagados!');
          setTimeout(() => {
            $('main#eggs h1').text('');
          }, 2000);
        }
      }

      // handle the scanned code as you like, for example:
      console.log(`Code matched = ${decodedText}`, decodedResult);
    }
    
    function onScanFailure(error) {
      // handle scan failure, usually better to ignore and keep scanning.
      // for example:
      if($('main#eggs').hasClass('active')){
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