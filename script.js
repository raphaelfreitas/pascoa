(() => {
  $ = jQuery;

  /* Eggs */
  function updateEggsBasket(){
    const eggs = $(document).find('.eggs');

    if( eggs !== 'undefined'){

      for(let i = 1; i <= 12; i++){
        eggs.append(`
                    <div class="egg disabled" key="${i}">
                      <img src="img/ovos/${i}.png" />
                    </div>`);
      }

      
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

      let numFound = 0;

      $.each(foundEggs, function(k, v){
        eggs.find(`.egg[key="${v}"]`).removeClass('disabled');
        numFound++;
      });

      $(document).find('.ovos_encontrados').text(`${numFound}/12`);

    }

  }

  updateEggsBasket();


  /* QR */

  if( typeof(Html5QrcodeScanner) !== 'undefined'){
  
    function onScanSuccess(decodedText, decodedResult) {


      if(decodedText.includes('egg---')){
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

        const eggNumber = decodedText.split('egg---');

        if(typeof (eggNumber[1]) !== 'undefined'){
          const number = parseInt(eggNumber[1]);

          if(!foundEggs.includes(number)){

            foundEggs.push(number);

            $('main.content').html(`
              <h1>Novo Ovo encontrado!</h1>
              <img src="img/ovos/${number}.png" class="novo_ovo" />
            `);

            window.localStorage.setItem('eggs', JSON.stringify(foundEggs));

          }
        }

      }

      if(decodedText.includes('egg--reset')){
        window.localStorage.setItem('eggs', []);
      }

      // handle the scanned code as you like, for example:
      console.log(`Code matched = ${decodedText}`, decodedResult);
    }
    
    function onScanFailure(error) {
      // handle scan failure, usually better to ignore and keep scanning.
      // for example:
      console.warn(`Code scan error = ${error}`);
    }
    
    let html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: {width: 250, height: 250} },
      /* verbose= */ false);
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
  }

  
})();