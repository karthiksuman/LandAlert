import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Volume2, VolumeX, Pause, Play, Sparkles } from 'lucide-react';

const VoiceAssistant = () => {
  const { 
    selectedLanguage, 
    locations, 
    selectedZoneId, 
    alerts, 
    activePortal, 
    citizenActiveTab,
    t 
  } = useApp();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSupported(false);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Map language codes to BCP 47 speech synthesis tags
  const getLocaleForLang = (code) => {
    switch (code) {
      case 'hi': return 'hi-IN';
      case 'te': return 'te-IN';
      case 'bn': return 'bn-IN';
      case 'as': return 'as-IN';
      case 'ne': return 'ne-NP';
      case 'mn': return 'hi-IN';
      case 'en': 
      default: return 'en-IN';
    }
  };

  // Generate localized readout speech text based on active portal and zone
  const generateSpeechText = () => {
    const activeZone = locations.find(l => l.id === selectedZoneId) || locations[0];
    const riskPercent = activeZone ? activeZone.riskPercentage : 86;
    const riskLevel = activeZone ? activeZone.riskLevel : 'CRITICAL';
    const zoneName = activeZone ? activeZone.name : 'Mangan Corridor';

    if (selectedLanguage === 'hi') {
      return `लैंड-अलर्ट पूर्व चेतावनी प्रणाली में आपका स्वागत है। वर्तमान क्षेत्र ${zoneName} का भूस्खलन जोखिम स्तर ${riskLevel}, अर्थात ${riskPercent} प्रतिशत है। ढलान कोण 42 डिग्री और 24 घंटे की वर्षा 112 मिलीमीटर दर्ज की गई है। सतर्क रहें और आधिकारिक आपदा सलाह का पालन करें।`;
    } else if (selectedLanguage === 'te') {
      return `ల్యాండ్‌అలర్ట్ విపత్తు నిర్వహణ మరియు ముందస్తు హెచ్చరిక వ్యవస్థకు స్వాగతం. ప్రస్తుతం పర్యవేక్షిస్తున్న ప్రాంతం ${zoneName}. ఇక్కడ కొండచరియలు విరిగిపడే ప్రమాద స్థాయి ${riskPercent} శాతం ఉంది. గత 24 గంటల్లో వర్షపాతం 112 మిల్లీమీటర్లు, నేల తేమ 91 శాతంగా నమోదైంది. దయచేసి అప్రమత్తంగా ఉండండి, సురక్షిత ప్రత్యామ్నాయ మార్గాలను మరియు సహాయక శిబిరాల మార్గదర్శకాలను పాటించండి.`;
    } else if (selectedLanguage === 'bn') {
      return `ল্যান্ড-অ্যালার্ট দুর্যোগ ব্যবস্থাপনা ব্যবস্থায় স্বাগতম। বর্তমান অঞ্চল ${zoneName}-এর ভূমিধসের ঝুঁকি ${riskLevel}, প্রায় ${riskPercent} শতাংশ। ২৪ ঘণ্টার বৃষ্টিপাত ১১২ মিলিমিটার। নিরাপদ স্থানে থাকুন।`;
    } else if (selectedLanguage === 'as') {
      return `লেণ্ড-এলাৰ্ট দুৰ্যোগ ব্যৱস্থাপনা প্ৰণালীত স্বাগতম। বৰ্তমান অঞ্চল ${zoneName}-ৰ ভূমিস্খলনৰ আশংকা ${riskPercent} শতাংশ। সতৰ্ক থাকক আৰু নিৰাপদ স্থানলৈ স্থানান্তৰ হওক।`;
    } else if (selectedLanguage === 'ne') {
      return `ल्याण्ड-अलर्ट विपद् व्यवस्थापन प्रणालीमा स्वागत छ। हालको क्षेत्र ${zoneName} मा पहिरोको जोखिम ${riskPercent} प्रतिशत रहेको छ। कृपया सतर्क रहनुहोला र सुरक्षित स्थानमा जानुहोला।`;
    } else if (selectedLanguage === 'mn') {
      return `LandAlert disaster warning. Current sector ${zoneName} landslide probability is ${riskPercent} percent with critical slope instability. Please exercise safety.`;
    } else {
      return `Welcome to LandAlert India. Current monitored sector is ${zoneName}. The landslide hazard probability is ${riskLevel} at ${riskPercent} percent. 24-hour precipitation is 112 millimeters with 91 percent soil moisture saturation. Please review safe detour routes and relief camp coordinates.`;
    }
  };

  const handleToggleSpeak = () => {
    if (!supported) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      return;
    }

    if (isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    // Start speaking
    window.speechSynthesis.cancel();
    const textToSpeak = generateSpeechText();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const targetLocale = getLocaleForLang(selectedLanguage);
    utterance.lang = targetLocale;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick best matching voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(targetLocale.slice(0, 2)));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = (e) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const getLanguageLabel = () => {
    switch(selectedLanguage) {
      case 'hi': return 'हिन्दी';
      case 'te': return 'తెలుగు';
      case 'as': return 'অসমীয়া';
      case 'bn': return 'বাংলা';
      case 'ne': return 'नेपाली';
      case 'mn': return 'মৈতৈলোন্';
      default: return 'English';
    }
  };

  return (
    <div className="voice-assistant-badge">
      <button 
        className={`voice-assistant-btn ${isSpeaking ? 'speaking' : ''}`}
        onClick={handleToggleSpeak}
        title={`Listen to Page Info in ${getLanguageLabel()}`}
      >
        <Volume2 size={15} className={isSpeaking ? 'voice-wave-icon' : ''} />
        <span className="voice-btn-text">
          {isSpeaking ? (isPaused ? "Resume Audio" : "Reading...") : `Audio (${getLanguageLabel()})`}
        </span>
      </button>

      {isSpeaking && (
        <button 
          className="voice-stop-btn"
          onClick={handleStop}
          title="Stop Audio"
        >
          <VolumeX size={13} />
        </button>
      )}
    </div>
  );
};

export default VoiceAssistant;
