(() => {
  if (!"speechSynthesis" in window) {
    alert("Sorry, your browser doesn't support text to speech!");
    return;
  }

  const button = document.getElementById("speak");
  const pauseButton = document.getElementById("pause");
  const voiceSelect = document.getElementById("voices");
    
    const synth = window.speechSynthesis;
    let voices;

    setTimeout(()=>{
     
        
        voices = synth.getVoices();

        setVoices();

        button.addEventListener("click", () => {

            console.log('play');
    
            if (synth.paused === true) {
              console.log('play')
              synth.resume();
              return;
            }
        
            const main = document.querySelector("main");

            console.log(main);
            textToSpeech(main.innerText);
          });
        
          pauseButton.addEventListener("click", () => {
            
            synth.pause();
          });

    }, 600)


            
    function textToSpeech(text) {
        const msg = new SpeechSynthesisUtterance();
        msg.text = text;
        msg.voice = getSelectedVoice();

        console.log(msg);
    
        window.speechSynthesis.speak(msg);
      }
    
      function setVoices() {
        if (voices.length === 0) {
          alert("Sorry, it seems this browser does not support different voices.");
          voiceSelect.remove();
        }
    
        for (let i = 0; i < voices.length; i++) {
          const option = document.createElement("option");
          option.textContent = `${voices[i].name} (${voices[i].lang})`;
    
          if (voices[i].default) {
            option.textContent += " — DEFAULT";
          }
    
          option.setAttribute("data-lang", voices[i].lang);
          option.setAttribute("data-name", voices[i].name);
          voiceSelect.appendChild(option);
        }
      }
    
      function getSelectedVoice() {
        const option = voiceSelect.selectedOptions[0];
        return voices.find(
          (voice) =>
            voice.name === option.dataset.name && voice.lang === option.dataset.lang
        );
      }

  
})();