import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Dynamic content that can be updated via admin
const dynamicContent = {
  hero: {
    title: 'Shri Puttagunta Venkata Sateesh Kumar',
    subtitle: 'Successful Business Entrepreneur, Vibrant Leader, Noble Hearted'
  }
}

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.services': 'Services',
      'nav.awards': 'Awards',
      'nav.gallery': 'Gallery',
      
      // Hero Section
      'hero.title': dynamicContent.hero.title,
      'hero.subtitle': dynamicContent.hero.subtitle,
      'hero.cta': 'Explore Journey',
      
      // About Section
      'about.title': 'About The Visionary',
      'about.lionism': 'Lionism Journey',
      'about.lionism.desc': 'Joined Lionism in 2004 and served in various capacities including Club President, District Cabinet Secretary, LCIF Chairman, and more.',
      'about.projects': 'Permanent Projects',
      'about.projects.desc': 'Initiated and completed permanent projects including Health Club and Traffic Police Station Building inaugurated by International Presidents.',
      'about.political': 'Political Career',
      'about.political.desc': 'Active member of TDP since 1994, served in various government committees including Vigilance & Monitoring Committee and Telecom Advisory Board.',
      
      // Services Section
      'services.title': 'Social Services',
      'services.water': 'Safe Drinking Water',
      'services.water.desc': 'Daily supply of safe drinking water to every village in the constituency, benefiting thousands of people.',
      'services.education': 'Education Support',
      'services.education.desc': 'Annual scholarships worth 5 lakhs and distribution of notebooks and textbooks to poor students.',
      'services.health': 'Healthcare Initiatives',
      'services.health.desc': 'Organization of 100 veterinary camps and 100 health camps under "Arogya Jyothi" program.',
      'services.trust': 'Global Service Trust',
      'services.trust.desc': 'Comprehensive care for health and mentally challenged individuals through the Trust.',
      
      // Awards Section
      'awards.title': 'Awards & Recognition',
      'awards.seniorMaster': '"Senior Master" Key Award',
      'awards.presidentCert': 'International President Appreciation Certificates (5 times)',
      'awards.presidentAward': '100% President Award',
      'awards.bestZone': 'Best Zone & Region Person at District and Multiple Level',
      
      // Gallery Section
      'gallery.title': 'Gallery',
      'gallery.recent': 'Recent Activities',
      
      // Footer
      'footer.rights': 'All rights reserved',
    }
  },
  te: {
    translation: {
      'nav.home': 'హోమ్',
      'nav.about': 'గురించి',
      'nav.services': 'సేవలు',
      'nav.awards': 'పురస్కారాలు',
      'nav.gallery': 'గ్యాలరీ',
      
      'hero.title': 'శ్రీ పుట్టగుంట వెంకట సతీష్ కుమార్',
      'hero.subtitle': 'విజయవంతమైన వ్యాపార వేత్త, ప్రగతిశీల నాయకుడు, మంచి మనస్సుకలిగిన వ్యక్తి',
      'hero.cta': 'ప్రయాణాన్ని అన్వేషించండి',
      
      'about.title': 'దూరదర్శి గురించి',
      'about.lionism': 'లయనిజం ప్రయాణం',
      'about.lionism.desc': '2004లో లయనిజంలో చేరి క్లబ్ ప్రెసిడెంట్, డిస్ట్రిక్ట్ క్యాబినెట్ సెక్రటరీ, LCIF చైర్మన్ వంటి వివిధ పదవుల్లో సేవ చేశారు.',
      'about.projects': 'శాశ్వత ప్రాజెక్టులు',
      'about.projects.desc': 'ఇంటర్నేషనల్ ప్రెసిడెంట్లచే ప్రారంభించబడిన హెల్త్ క్లబ్ మరియు ట్రాఫిక్ పోలీస్ స్టేషన్ భవనం సహా శాశ్వత ప్రాజెక్టులను ప్రారంభించి పూర్తి చేశారు.',
      'about.political': 'రాజకీయ జీవితం',
      'about.political.desc': '1994 నుండి టీడీపీలో సక్రియ సభ్యుడిగా, విజిలెన్స్ & మానిటరింగ్ కమిటీ మరియు టెలికాం అడ్వైజరీ బోర్డు వంటి వివిధ ప్రభుత్వ కమిటీల్లో సేవ చేశారు.',
      
      'services.title': 'సామాజిక సేవలు',
      'services.water': 'సురక్షిత తాగునీరు',
      'services.water.desc': 'నియోజకవర్గంలోని ప్రతి గ్రామానికి రోజుకు సురక్షిత తాగునీటి సరఫరా, వేలాది మందికి ప్రయోజనం',
      'services.education': 'విద్యా మద్దతు',
      'services.education.desc': 'సంవత్సరానికి 5 లక్షల విలువైన స్కాలర్షిప్లు మరియు బీద విద్యార్థులకు నోట్బుక్లు, పాఠ్యపుస్తకాల పంపిణీ',
      'services.health': 'ఆరోగ్య సంరక్షణ కార్యక్రమాలు',
      'services.health.desc': '"ఆరోగ్య జ్యోతి" కార్యక్రమం క్రింద 100 వెటర్నరీ శిబిరాలు మరియు 100 ఆరోగ్య శిబిరాలను నిర్వహించడం',
      'services.trust': 'గ్లోబల్ సర్వీస్ ట్రస్ట్',
      'services.trust.desc': 'ట్రస్ట్ ద్వారా ఆరోగ్యం మరియు మానసికంగా సవాళ్లను ఎదుర్కొంటున్న వ్యక్తులకు సమగ్ర సంరక్షణ',
      
      'awards.title': 'పురస్కారాలు & గుర్తింపు',
      'awards.seniorMaster': '"సీనియర్ మాస్టర్" కీ అవార్డు',
      'awards.presidentCert': 'ఇంటర్నేషనల్ ప్రెసిడెంట్ అప్రిసియేషన్ సర్టిఫికెట్లు (5 సార్లు)',
      'awards.presidentAward': '100% ప్రెసిడెంట్ అవార్డు',
      'awards.bestZone': 'డిస్ట్రిక్ట్ మరియు మల్టీపుల్ లెవెల్ వద్ద బెస్ట్ జోన్ & రీజియన్ పర్సన్',
      
      'gallery.title': 'గ్యాలరీ',
      'gallery.recent': 'ఇటీవలి కార్యకలాపాలు',
      
      'footer.rights': 'అన్ని హక్కులు ప్రత్యేకించబడినవి',
    }
  },
  hi: {
    translation: {
      'nav.home': 'होम',
      'nav.about': 'परिचय',
      'nav.services': 'सेवाएं',
      'nav.awards': 'पुरस्कार',
      'nav.gallery': 'गैलरी',
      
      'hero.title': 'श्री पुट्टगुंटा वेंकट सतीश कुमार',
      'hero.subtitle': 'सफल व्यवसायी उद्यमी, गतिशील नेता, उदार हृदय',
      'hero.cta': 'यात्रा का अन्वेषण करें',
      
      'about.title': 'दूरदर्शी के बारे में',
      'about.lionism': 'लायनिज्म यात्रा',
      'about.lionism.desc': '2004 में लायनिज्म में शामिल हुए और क्लब अध्यक्ष, जिला कैबिनेट सचिव, LCIF अध्यक्ष सहित विभिन्न पदों पर सेवा की।',
      'about.projects': 'स्थायी परियोजनाएं',
      'about.projects.desc': 'अंतर्राष्ट्रीय अध्यक्षों द्वारा उद्घाटित स्वास्थ्य क्लब और ट्रैफिक पुलिस स्टेशन भवन सहित स्थायी परियोजनाओं का शुभारंभ और पूरा किया।',
      'about.political': 'राजनीतिक करियर',
      'about.political.desc': '1994 से टीडीपी के सक्रिय सदस्य, सतर्कता और निगरानी समिति और दूरसंचार सलाहकार बोर्ड सहित विभिन्न सरकारी समितियों में सेवा की।',
      
      'services.title': 'सामाजिक सेवाएं',
      'services.water': 'सुरक्षित पेयजल',
      'services.water.desc': 'निर्वाचन क्षेत्र के प्रत्येक गाँव को प्रतिदिन सुरक्षित पेयजल की आपूर्ति, हजारों लोगों को लाभ',
      'services.education': 'शैक्षिक सहायता',
      'services.education.desc': 'प्रति वर्ष 5 लाख रुपये की छात्रवृत्ति और गरीब छात्रों को नोटबुक, पाठ्यपुस्तकों का वितरण',
      'services.health': 'स्वास्थ्य देखभाल पहल',
      'services.health.desc': '"आरोग्य ज्योति" कार्यक्रम के तहत 100 पशु चिकित्सा शिविर और 100 स्वास्थ्य शिविरों का आयोजन',
      'services.trust': 'ग्लोबल सर्विस ट्रस्ट',
      'services.trust.desc': 'ट्रस्ट के माध्यम से स्वास्थ्य और मानसिक रूप से चुनौतीपूर्ण व्यक्तियों के लिए व्यापक देखभाल',
      
      'awards.title': 'पुरस्कार और मान्यता',
      'awards.seniorMaster': '"सीनियर मास्टर" की पुरस्कार',
      'awards.presidentCert': 'अंतर्राष्ट्रीय अध्यक्ष प्रशंसा प्रमाणपत्र (5 बार)',
      'awards.presidentAward': '100% अध्यक्ष पुरस्कार',
      'awards.bestZone': 'जिला और बहुस्तरीय स्तर पर सर्वश्रेष्ठ क्षेत्र और क्षेत्र व्यक्ति',
      
      'gallery.title': 'गैलरी',
      'gallery.recent': 'हाल की गतिविधियां',
      
      'footer.rights': 'सर्वाधिकार सुरक्षित',
    }
  }
}

// Function to update dynamic content
export const updateDynamicContent = (newContent) => {
  Object.keys(resources).forEach(lang => {
    if (resources[lang].translation) {
      Object.keys(newContent).forEach(key => {
        if (resources[lang].translation[key]) {
          resources[lang].translation[key] = newContent[key]
        }
      })
    }
  })
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  })

export default i18n