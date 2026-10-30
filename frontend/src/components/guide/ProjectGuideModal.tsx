import React, { useState, useEffect } from 'react';
import { 
  X, BookOpen, Globe2, Layers, Cpu, Box, Sliders, ShieldCheck, 
  MapPin, ChevronRight, CheckCircle2, Sparkles, Languages, Search
} from 'lucide-react';

interface ProjectGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Comprehensive translations for top languages
interface GuideContent {
  title: string;
  subtitle: string;
  tabs: {
    overview: string;
    satellites: string;
    fusion: string;
    digitalTwin: string;
    areaSelection: string;
    scenarios: string;
    security: string;
  };
  chapters: Record<string, { title: string; desc: string; sections: { heading: string; points: string[] }[] }>;
}

const TRANSLATIONS: Record<string, GuideContent> = {
  en: {
    title: "BHŪ-TATTVA-ANVEṢA Project Guide",
    subtitle: "Complete Operational & Scientific System Architecture Manual",
    tabs: {
      overview: "1. System Overview",
      satellites: "2. Earth Observation",
      fusion: "3. Sensor Fusion",
      digitalTwin: "4. 3D Digital Twin",
      areaSelection: "5. Land Area Selection",
      scenarios: "6. What-If Scenarios",
      security: "7. Security & Admin",
    },
    chapters: {
      overview: {
        title: "System Overview & Mission",
        desc: "BHŪ-TATTVA-ANVEṢA (भू-तत्त्व-अन्वेष: Earth-Element Exploration) is an advanced 3D Soil, Hydrological & Environmental Nexus System specifically engineered for the Kabini River Basin in Karnataka/Kerala, India.",
        sections: [
          {
            heading: "Core Mission",
            points: [
              "Combines satellite remote sensing (ISRO Bhuvan, ESA Copernicus Sentinel-1/2, NASA SMAP) with high-density ground IoT sensor networks into a unified 10-meter operational grid.",
              "Delivers continuous, high-resolution soil moisture, soil organic carbon (SOC), vegetation vigor (NDVI), and watershed drought risk indicators.",
              "Provides physics-informed 3D digital twin terrain rendering, hydrological modeling, and conversational AI for environmental decision-makers."
            ]
          },
          {
            heading: "Key Innovations",
            points: [
              "Dynamic Micro-Parcel Land Selection: Select any bounding box or agricultural cluster on the interactive map to calculate localized environmental health metrics on the fly.",
              "5-Stage Sensor Fusion Engine: Harmonizes synthetic aperture radar (SAR), multispectral optical imagery, and FDR ground probes with Kalman Filtering and 95% Confidence Intervals.",
              "Role-Based Governance (RBAC): Dedicated, cryptographically secured Admin Console for telemetry management, sensor recalibration, and dataset curation."
            ]
          }
        ]
      },
      satellites: {
        title: "Multi-Source Earth Observation Ingestion",
        desc: "The system ingests and cross-calibrates multiple satellite constellations alongside field telemetries.",
        sections: [
          {
            heading: "Satellite Ingestion Feeds",
            points: [
              "ESA Sentinel-1 SAR: C-band Synthetic Aperture Radar (5.405 GHz) providing all-weather, day-and-night surface roughness, volumetric dielectric constant, and topsoil (0-5cm) moisture.",
              "ESA Sentinel-2 MSI: 13-band multispectral instrument at 10m resolution computing Normalized Difference Vegetation Index (NDVI), Moisture Stress Index (MSI), and Soil Adjusted Vegetation Index (SAVI).",
              "NASA SMAP: L-band (1.4 GHz) radiometer offering high radiometric accuracy downscaled from 36km/9km to 1km resolution using optical-microwave synergistic sharpening.",
              "ISRO Bhuvan / CartoDEM: High-resolution digital elevation models (DEM) providing 30m topographic curvature, aspect, slope, and hydrological flow directions.",
              "ECMWF ERA5-Land Reanalysis: Atmospheric boundary forcing including 2m air temperature, solar surface radiation, vapor pressure deficit, and 24-hour accumulated precipitation."
            ]
          },
          {
            heading: "Ground IoT Sensor Network",
            points: [
              "12 deployed in-situ Frequency Domain Reflectometry (FDR) soil moisture probes across HD Kote, Kabini Reservoir, Bavali Forest, and Nanjangud.",
              "Dual-depth monitoring at 5cm (topsoil) and 30cm (root-zone), logging volumetric water content (m³/m³), soil temperature, and electrical conductivity (EC)."
            ]
          }
        ]
      },
      fusion: {
        title: "Multi-Stage Sensor Fusion Architecture",
        desc: "Resolves spatial resolution mismatches and sensor uncertainties through a 5-stage Kalman and Physics-Guided Pipeline.",
        sections: [
          {
            heading: "The 5 Fusion Stages",
            points: [
              "Stage A (Temporal Alignment): Normalizes asynchronous satellite overpasses and continuous 15-minute IoT sensor time series into uniform 24-hour observation epochs.",
              "Stage B (Spatial Resampling & Downscaling): Applies bicubic spline and topographic gradient downscaling to map SMAP (9km) and Sentinel (10-20m) to a unified 10m grid.",
              "Stage C (State Estimation & Kalman Filtering): Dynamically weights each data source based on real-time signal-to-noise ratio (SNR), optical cloud cover obstruction, and sensor drift.",
              "Stage D (Physics-Guided Retention Modeling): Enforces Van Genuchten soil water retention curves to maintain hydraulic consistency between topsoil and root-zone strata.",
              "Stage E (Uncertainty Quantification): Generates heteroscedastic 95% Confidence Intervals (±2σ) for every fused soil and vegetation metric."
            ]
          }
        ]
      },
      digitalTwin: {
        title: "3D Digital Twin & Terrain Simulation",
        desc: "Hardware-accelerated 3D terrain canvas powered by Mol* and Three.js with real-time environmental shaders.",
        sections: [
          {
            heading: "Interactive 3D Capabilities",
            points: [
              "Topographic Elevation Mesh: 3D Kabini basin topography with adjustable vertical exaggeration (1.0x - 3.0x).",
              "Hydrological Flood Inundation: Real-time slider simulating reservoir surface water expansion from +1m to +10m flood levels.",
              "Drought Desiccation Stress: Visualizes soil cracking, water table subsidence, and vegetation browning under severe precipitation deficits.",
              "Telemetry HUD: Displays live real-time camera position, sun azimuth angle, ground slope, and elevation contours."
            ]
          }
        ]
      },
      areaSelection: {
        title: "Dynamic Land Parcel & Zone Selection",
        desc: "Select any micro-parcel or bounding box on the map to compute instant localized environmental diagnostics.",
        sections: [
          {
            heading: "How It Works",
            points: [
              "Interactive Selection: Click any known watershed zone (HD Kote, Bavali Ghat, Kabini Reservoir, Nanjangud Valley, Saragur Dryland) or draw an arbitrary bounding box directly on the map.",
              "Instant Metric Calculation: The backend spatial service evaluates exact polygon/bounding box area in km² and hectares using Haversine spherical projection.",
              "Localized Telemetry: Instantly recalibrates average soil moisture, vegetation health (NDVI), surface temperature, active IoT sensors, soil pH, organic carbon (SOC), and 14-day historical trends for that specific land parcel.",
              "Minimalist User View: The dashboard automatically strips extraneous noise and presents crisp, actionable indicators for the chosen area."
            ]
          }
        ]
      },
      scenarios: {
        title: "What-If Scenario Modeling & RAG Assistant",
        desc: "Simulate future climate impacts and interrogate the environmental knowledge base with natural language.",
        sections: [
          {
            heading: "Predictive Scenarios",
            points: [
              "Extreme Heatwave (+3.5°C): Computes accelerated evapotranspiration and critical root-zone soil desiccation across dryland agricultural zones.",
              "Monsoon Deficit (-40% Rainfall): Evaluates reservoir storage depletion rates and irrigation water stress.",
              "Afforestation & Land-Use Change: Simulates +25% tree canopy coverage and its positive feedback on soil water retention and organic carbon build-up."
            ]
          },
          {
            heading: "Domain AI Assistant",
            points: [
              "Retrieval-Augmented Generation (RAG) assistant grounded in ISRO Bhuvan technical documentation, Central Ground Water Board (CGWB) reports, and regional agro-climatic bulletins."
            ]
          }
        ]
      },
      security: {
        title: "Security, Role-Based Access (RBAC) & Admin Console",
        desc: "Enterprise-grade authorization separating administrator controls from public/researcher user workspaces.",
        sections: [
          {
            heading: "Authentication & Authorization",
            points: [
              "JSON Web Token (JWT) Security: Cryptographically signed tokens with expiration and authorization claims.",
              "Role 'USER': Has comprehensive view, analysis, area selection, 3D digital twin exploration, scenario simulation, and RAG assistant capabilities.",
              "Role 'ADMIN': Exclusive access to the dedicated Admin Dashboard (`/admin`) for registering new IoT sensors, purging or importing satellite datasets, modifying alert thresholds, and viewing system audit logs."
            ]
          }
        ]
      }
    }
  },
  hi: {
    title: "भू-तत्त्व-अन्वेष (BHŪ-TATTVA-ANVEṢA) परियोजना मार्गदर्शिका",
    subtitle: "संपूर्ण परिचालन एवं वैज्ञानिक प्रणाली वास्तुकला नियमावली",
    tabs: {
      overview: "१. प्रणाली अवलोकन",
      satellites: "२. उपग्रह डेटा अंतर्ग्रहण",
      fusion: "३. सेंसर संलयन",
      digitalTwin: "४. 3D डिजिटल ट्विन",
      areaSelection: "५. भूमि क्षेत्र चयन",
      scenarios: "६. क्या-अगर परिदृश्य",
      security: "७. सुरक्षा व व्यवस्थापक",
    },
    chapters: {
      overview: {
        title: "प्रणाली अवलोकन एवं लक्ष्य",
        desc: "भू-तत्त्व-अन्वेष इसरो भुवन और पृथ्वी अवलोकन आधारित एक उन्नत 3D मृदा, जल विज्ञान एवं पर्यावरण नेक्सस प्रणाली है, जिसे काबिनी बेसिन के लिए तैयार किया गया है।",
        sections: [
          {
            heading: "मुख्य उद्देश्य",
            points: [
              "इसरो भुवन, यूरोपीय अंतरिक्ष एजेंसी सेंटिनल-1/2, और नासा SMAP उपग्रहों के डेटा को जमीनी IoT सेंसर के साथ 10-मीटर रिज़ॉल्यूशन ग्रिड में जोड़ना।",
              "मिट्टी की नमी, कार्बनिक कार्बन, वनस्पति स्वास्थ्य (NDVI) और सूखा जोखिम की वास्तविक समय में निगरानी करना।",
              "पर्यावरण निर्णयकर्ताओं के लिए इंटरएक्टिव 3D डिजिटल ट्विन और जल-मौसम सिमुलेशन प्रदान करना।"
            ]
          }
        ]
      },
      satellites: {
        title: "बहु-स्रोत उपग्रह एवं सेंसर डेटा",
        desc: "यह प्रणाली अनेक उपग्रहों और जमीनी सेंसरों से डेटा ग्रहण करती है।",
        sections: [
          {
            heading: "उपग्रह नेटवर्क",
            points: [
              "सेंटिनल-1 SAR: माइक्रोवेव रडार दिन-रात किसी भी मौसम में मिट्टी की ऊपरी परत (0-5 सेमी) की नमी मापता है।",
              "सेंटिनल-2: 13-बैंड मल्टीस्पेक्ट्रल डेटा से फसलों और वनों का हरित सूचकांक (NDVI) तैयार करता है।",
              "नासा SMAP: रेडियोमीटर द्वारा बड़े पैमाने पर मृदा नमी का सटीक अनुमान प्रदान करता है।",
              "जमीनी IoT नेटवर्क: काबिनी बेसिन में 12 स्थानों पर स्थापित 5 सेमी व 30 सेमी गहराई के सटीक सेंसर।"
            ]
          }
        ]
      },
      fusion: {
        title: "5-चरणीय सेंसर संलयन (Sensor Fusion)",
        desc: "उपग्रह और फील्ड सेंसर के डेटा को कालमन फ़िल्टर और भौतिक सिद्धांतों द्वारा जोड़ा जाता है।",
        sections: [
          {
            heading: "संलयन चरण",
            points: [
              "चरण क (समय संरेखण): विभिन्न उपग्रह पास और निरंतर सेंसर डेटा को 24-घंटे चक्र में संरेखित करना।",
              "चरण ख (स्थानिक पुनर्नमूनाकरण): 9 किमी के SMAP डेटा को 10 मीटर के विस्तृत ग्रिड पर लाना।",
              "चरण ग (कालमन फ़िल्टरिंग): बादलों और शोर को हटाकर गतिशील भार देना।",
              "चरण घ (मृदा भौतिकी नियम): वैन जेनुचटेन समीकरणों द्वारा मिट्टी के जल संतुलन की पुष्टि करना।",
              "चरण ङ (अनिश्चितता मापन): 95% विश्वास अंतराल (±2σ) प्रदर्शित करना।"
            ]
          }
        ]
      },
      digitalTwin: {
        title: "3D डिजिटल ट्विन एवं भू-भाग सिमुलेशन",
        desc: "Mol* और Three.js द्वारा संचालित गतिशील 3D भू-भाग मॉडल।",
        sections: [
          {
            heading: "क्षमताएं",
            points: [
              "काबिनी बेसिन का त्रि-आयामी (3D) एलिवेशन मॉडल।",
              "बाढ़ सिमुलेशन स्लाइडर: जलाशय में +1 से +10 मीटर जल वृद्धि का लाइव प्रभाव देखना।",
              "सूखा सिमुलेशन: वर्षा की कमी पर मिट्टी का फटना और वनस्पति सूखने का दृश्य।",
              "टेलीमेट्री HUD: ऊंचाई, ढलान, और सूर्य कोण का सीधा प्रदर्शन।"
            ]
          }
        ]
      },
      areaSelection: {
        title: "गतिशील भूमि क्षेत्र चयन",
        desc: "मानचित्र पर किसी भी क्षेत्र या ज़ोन को चुनकर वहां का विशिष्ट पर्यावरणीय डेटा तुरंत देखें।",
        sections: [
          {
            heading: "कार्यप्रणाली",
            points: [
              "मानचित्र पर एचडी कोटे, बावेली वन, काबिनी जलाशय या अपनी पसंद का बॉक्स चुनें।",
              "प्रणाली तुरंत उस चुने हुए भूखंड का क्षेत्रफल (हेक्टेयर और वर्ग किमी) गणना करती है।",
              "चयनित क्षेत्र की मिट्टी की नमी, वनस्पति स्वास्थ्य, तापमान और 14-दिन का इतिहास तुरंत अपडेट हो जाता है।"
            ]
          }
        ]
      },
      scenarios: {
        title: "क्या-अगर परिदृश्य सिमुलेशन",
        desc: "भविष्य के जलवायु परिवर्तन और भूमि उपयोग परिवर्तनों का सिमुलेशन।",
        sections: [
          {
            heading: "परीक्षण मॉडल",
            points: [
              "अत्यधिक गर्मी लहर (+3.5°C): वाष्पीकरण और मिट्टी की शुष्कता का आकलन।",
              "मानसून की 40% कमी: जल संकट और फसलों पर प्रभाव का विश्लेषण।",
              "वृक्षारोपण: 25% वन क्षेत्र बढ़ने से भूमि नमी संरक्षण में सुधार।"
            ]
          }
        ]
      },
      security: {
        title: "सुरक्षा एवं व्यवस्थापक (Admin) डैशबोर्ड",
        desc: "सुरक्षित JWT प्रमाणीकरण और अलग व्यवस्थापक नियंत्रण।",
        sections: [
          {
            heading: "भूमिकाएं",
            points: [
              "उपयोगकर्ता (USER): पूर्ण विश्लेषण, मानचित्र चयन, 3D ट्विन और AI सहायक का उपयोग।",
              "व्यवस्थापक (ADMIN): सेंसर जोड़ने, उपग्रह डेटा अपडेट करने, अलर्ट सीमा तय करने का विशेष अधिकार।"
            ]
          }
        ]
      }
    }
  },
  mr: {
    title: "भू-तत्त्व-अन्वेष (BHŪ-TATTVA-ANVEṢA) प्रकल्प मार्गदर्शिका",
    subtitle: "संपूर्ण परिचालन आणि वैज्ञानिक प्रणाली आर्किटेक्चर पुस्तिका",
    tabs: {
      overview: "१. प्रणाली विहंगावलोकन",
      satellites: "२. उपग्रह डेटा संकलन",
      fusion: "३. सेन्सर फ्यूजन",
      digitalTwin: "४. 3D डिजिटल ट्विन",
      areaSelection: "५. जमीन क्षेत्र निवड",
      scenarios: "६. परिस्थिती मॉडेलिंग",
      security: "७. सुरक्षा व ॲडमिन",
    },
    chapters: {
      overview: {
        title: "प्रणाली विहंगावलोकन आणि उद्दिष्ट",
        desc: "भू-तत्त्व-अन्वेष ही इस्रो भुवन आणि उपग्रह रिमोट सेन्सिंगवर आधारित अत्याधुनिक 3D मृदा आणि पर्यावरण प्रणाली आहे.",
        sections: [
          {
            heading: "मुख्य उद्दिष्टे",
            points: [
              "सेंटिनेल-1, सेंटिनेल-2, नासा SMAP आणि जमिनीवरील IoT सेन्सरचे एकत्रीकरण करून 10 मीटर अचूकतेचा ग्रिड तयार करणे.",
              "जमिनीतील ओलावा, सेंद्रिय कर्ब (SOC) आणि पिकांचे आरोग्य (NDVI) याचे थेट निरीक्षण करणे.",
              "काबिनी खोऱ्यासाठी उच्च-अचूकतेचा 3D डिजिटल ट्विन आणि सिम्युलेशन उपलब्ध करून देणे."
            ]
          }
        ]
      },
      satellites: {
        title: "उपग्रह व जमिनीवरील सेन्सर्स",
        desc: "सर्व हवामानात अचूक माहिती देणारे विविध उपग्रह स्त्रोत.",
        sections: [
          {
            heading: "डेटा स्त्रोत",
            points: [
              "सेंटिनेल-1 SAR: रडार द्वारे ढगाळ वातावरणातही मातीतील ओलावा मोजणे.",
              "सेंटिनेल-2: 13-बँड ऑप्टिकल कॅमेऱ्यांद्वारे पिकांचे आरोग्य व हिरवेगारपणा मोजणे.",
              "काबिनी खोऱ्यातील 12 प्रत्यक्ष IoT माती सेन्सर्स द्वारे 5cm आणि 30cm खोलीवर सतत वाचन."
            ]
          }
        ]
      },
      fusion: {
        title: "५-टप्प्यांची सेन्सर फ्यूजन प्रणाली",
        desc: "कालमन फिल्टर आणि हायड्रॉलिक मॉडेलिंगद्वारे अचूक माहिती तयार करणे.",
        sections: [
          {
            heading: "प्रक्रिया",
            points: [
              "विविध वेळेच्या उपग्रह नोंदी आणि सेन्सर्सचे एकाच २४ तासांच्या चक्रात संरेखन करणे.",
              "९ किमी रिझोल्यूशनच्या उपग्रह डेटाचे १० मीटरमध्ये डाऊनस्केलिंग करणे.",
              "९५% अचूकता मर्यादा (Uncertainty Interval) दर्शवणे."
            ]
          }
        ]
      },
      digitalTwin: {
        title: "3D डिजिटल ट्विन",
        desc: "Three.js द्वारे काबिनी नदी खोऱ्याचे त्रिमितीय वास्तवदर्शी दृश्य.",
        sections: [
          {
            heading: "वैशिष्ट्ये",
            points: [
              "पूर परिस्थिती सिम्युलेटर: धरणातील पाणी वाढल्यास बुडणाऱ्या भागांचे थेट 3D मॉडेलिंग.",
              "दुष्काळ सिम्युलेटर: पाणी टंचाईमुळे माती व वनस्पतींवर होणारा परिणाम पाहणे."
            ]
          }
        ]
      },
      areaSelection: {
        title: "गतिमान जमीन क्षेत्र निवड",
        desc: "नकाशावर हवे ते क्षेत्र किंवा गाव निवडून लगेच तेथील स्थानिक आकडेवारी मिळवा.",
        sections: [
          {
            heading: "कसे वापरावे",
            points: [
              "नकाशावर बॉक्स रेखाटून किंवा झोन निवडून क्षेत्र ठरवा.",
              "सिस्टम त्वरित निवडलेल्या भागाचे क्षेत्रफळ (हेक्टर/चौरस किमी) मोजते.",
              "त्या क्षेत्राची मातीची आर्द्रता, तापमान आणि 14 दिवसांचा इतिहास स्क्रीनवर लगेच अद्ययावत होतो."
            ]
          }
        ]
      },
      scenarios: {
        title: "हवामान बदल आणि सिमुलेशन्स",
        desc: "भविष्यातील संभाव्य संकटांचे भाकीत करणे.",
        sections: [
          {
            heading: "परिदृश्ये",
            points: [
              "तापमानात ३.५ अंश वाढ झाल्यास होणारे बाष्पीभवन.",
              "मान्सूनमध्ये ४०% घट झाल्यास पिण्याच्या व शेतीच्या पाण्याचा ताळेबंद."
            ]
          }
        ]
      },
      security: {
        title: "सुरक्षा आणि प्रशासकीय (Admin) नियंत्रण",
        desc: "JWT प्रमाणीकरण आणि स्वतंत्र ॲडमिन डॅशबोर्ड.",
        sections: [
          {
            heading: "प्रवेश अधिकार",
            points: [
              "सामान्य वापरकर्ता: सर्व विश्लेषणे, 3D मॉडेल, नकाशा निवड आणि AI चॅटबॉट वापरू शकतो.",
              "प्रशासक (ADMIN): नवीन सेन्सर जोडणे, उपग्रह डेटा अपडेट करणे आणि सिस्टम सेटिंग्ज बदलणे."
            ]
          }
        ]
      }
    }
  },
  sa: {
    title: "भू-तत्त्व-अन्वेष (BHŪ-TATTVA-ANVEṢA) परियोजना दिग्दर्शनम्",
    subtitle: "सम्पूर्ण वैज्ञानिक-तन्त्र-रचना मार्गदर्शिका",
    tabs: {
      overview: "१. तन्त्र-परिचयः",
      satellites: "२. उपग्रह-दत्त-ग्रहणम्",
      fusion: "३. संवेदक-संलयनम्",
      digitalTwin: "४. 3D डिजिटल-प्रतिकृतिः",
      areaSelection: "५. भू-प्रदेश-चयनम्",
      scenarios: "६. भविष्य-परिदृश्यम्",
      security: "७. सुरक्षा व प्रबन्धकः",
    },
    chapters: {
      overview: {
        title: "तन्त्र-परिचयः एवं लक्ष्यम्",
        desc: "भू-तत्त्व-अन्वेष इति तन्त्रं भारतीय-अन्तरिक्ष-अनुसन्धान-सङ्घटनस्य (ISRO) भुवन-प्रणाल्याः च आधारेण मृत्तिकायाः, जलस्य, पर्यावरणस्य च त्रि-आयामी (3D) विश्लेषणाय निर्मितम् अस्ति।",
        sections: [
          {
            heading: "मुख्य-उद्देश्यम्",
            points: [
              "उपग्रह-दत्तांशस्य भू-संवेदकानां च १०-मीटर परिमाणयुक्ते जाले समन्वयः।",
              "मृत्तिकायाः आर्द्रतायाः, वनस्पतेः स्वास्थ्यस्य (NDVI) च प्रत्यक्ष-अवलोकनम्।",
              "काबिनी-नदी-प्रान्ते जल-सन्तुलनस्य संवर्धनम्।"
            ]
          }
        ]
      },
      satellites: {
        title: "उपग्रह-संवेदक-दत्तांशः",
        desc: "सेंटिनल-१, सेंटिनल-२, नासा-SMAP उपग्रहाणां भू-संवेदकानां च समन्वयः।",
        sections: [
          {
            heading: "स्रोताः",
            points: [
              "सेंटिनल-१ SAR: राडार-तरङ्गैः दिने रात्रौ च मृत्तिकायाः आर्द्रता-मापनम्।",
              "सेंटिनल-२: १३-तरङ्गदैर्घ्यैः वनस्पति-हरितिमा-मापनम्।"
            ]
          }
        ]
      },
      fusion: {
        title: "पञ्च-स्तरीय-संवेदक-संलयनम्",
        desc: "कालमन-शोधन-प्रक्रियया ९५% विश्वसनीयता-प्राप्तिः।",
        sections: [
          {
            heading: "प्रक्रिया",
            points: [
              "उपग्रह-दत्तांशस्य समय-संरेखणम्, सूक्ष्म-विस्तारः, अनिश्चितता-निवारणं च।"
            ]
          }
        ]
      },
      digitalTwin: {
        title: "3D डिजिटल-प्रतिकृतिः",
        desc: "भू-भागानां त्रि-आयामी-सिमुलेशनम्।",
        sections: [
          {
            heading: "सामर्थ्यम्",
            points: [
              "जल-वृद्धि-सिमुलेशनम्, शुष्कता-सिमुलेशनम्, जल-प्रवाह-गतिशीलता च।"
            ]
          }
        ]
      },
      areaSelection: {
        title: "भू-प्रदेश-चयनम्",
        desc: "मानचित्रे यस्य कस्यापि प्रान्तस्य चयनेन तस्य प्रदेशस्य एव मृत्तिका-वृत्तान्तः प्राप्यते।",
        sections: [
          {
            heading: "विधिः",
            points: [
              "मानचित्रे प्रदेश-चिह्नीकरणेन तस्य क्षेत्रफलं, जल-मात्रा, तापमानं च तत्कालमेव प्राप्यते।"
            ]
          }
        ]
      },
      scenarios: {
        title: "भविष्य-परिदृश्य-कलनम्",
        desc: "जलवायु-परिवर्तनस्य प्रभाव-आकलनम्।",
        sections: [
          {
            heading: "परीक्षणम्",
            points: [
              "अति-ताप-तरङ्गः (+३.५°C), वर्षा-न्यूनता (-४०%), वृक्षारोपण-प्रभावाः च।"
            ]
          }
        ]
      },
      security: {
        title: "सुरक्षा एवं प्रबन्धक-पटलम्",
        desc: "सुरक्षित-JWT-प्रमाणीकरणम् एवं पृथक् प्रबन्धक-व्यवस्था।",
        sections: [
          {
            heading: "अधिकारः",
            points: [
              "उपयोक्ता: सामान्य-अन्वेषणाय। प्रबन्धकः: नूतन-संवेदक-योजनाय।"
            ]
          }
        ]
      }
    }
  },
  es: {
    title: "Guía del Proyecto BHŪ-TATTVA-ANVEṢA",
    subtitle: "Manual de Arquitectura y Operación Científica del Sistema",
    tabs: {
      overview: "1. Descripción General",
      satellites: "2. Observación Satelital",
      fusion: "3. Fusión de Sensores",
      digitalTwin: "4. Gemelo Digital 3D",
      areaSelection: "5. Selección de Área",
      scenarios: "6. Escenarios What-If",
      security: "7. Seguridad y Admin",
    },
    chapters: {
      overview: {
        title: "Misión del Sistema",
        desc: "BHŪ-TATTVA-ANVEṢA es una plataforma avanzada de gemelo digital 3D para la hidrología y el suelo de la cuenca del río Kabini.",
        sections: [
          {
            heading: "Objetivos Principales",
            points: [
              "Fusión de satélites Sentinel-1/2, SMAP y sensores IoT en una cuadrícula unificada de 10 metros.",
              "Monitoreo continuo de humedad del suelo, carbono orgánico y vigor vegetal (NDVI).",
              "Simulaciones interactivas de inundación y sequía en 3D."
            ]
          }
        ]
      },
      satellites: {
        title: "Observación de la Tierra",
        desc: "Ingesta multiespectral y de radar SAR para una cobertura integral.",
        sections: [
          {
            heading: "Fuentes",
            points: [
              "Sentinel-1 SAR: Radar de microondas para humedad en superficie en cualquier condición meteorológica.",
              "Sentinel-2 MSI: Índices ópticos de vegetación de alta resolución.",
              "12 sensores FDR en campo con registros a 5 cm y 30 cm de profundidad."
            ]
          }
        ]
      },
      fusion: {
        title: "Fusión de Sensores en 5 Etapas",
        desc: "Filtro de Kalman y curvas de retención hídrica con intervalo de confianza al 95%.",
        sections: [
          {
            heading: "Etapas",
            points: [
              "Alineación temporal, reducción de escala a 10m, estimación por Kalman y cuantificación de incertidumbre."
            ]
          }
        ]
      },
      digitalTwin: {
        title: "Gemelo Digital 3D",
        desc: "Renderizado de terreno acelerado por WebGL con controles hidrológicos en tiempo real.",
        sections: [
          {
            heading: "Capacidades",
            points: [
              "Simulación de subida de agua en el embalse (+1m a +10m) y estrés por desecación por sequía."
            ]
          }
        ]
      },
      areaSelection: {
        title: "Selección Dinámica de Parcelas",
        desc: "Seleccione cualquier microzona en el mapa y obtenga métricas actualizadas al instante.",
        sections: [
          {
            heading: "Funcionamiento",
            points: [
              "Dibuje un cuadro delimitador o elija un sector para recalcular área (ha/km²), humedad y tendencias de 14 días."
            ]
          }
        ]
      },
      scenarios: {
        title: "Modelado de Escenarios",
        desc: "Simulaciones de olas de calor (+3.5°C) y déficit de monzón (-40%).",
        sections: [
          {
            heading: "Análisis",
            points: [
              "Evaluación del impacto del cambio climático en los recursos hídricos subterráneos y cultivos."
            ]
          }
        ]
      },
      security: {
        title: "Seguridad y Panel de Administración",
        desc: "Autenticación JWT robusta con separación de roles USER y ADMIN.",
        sections: [
          {
            heading: "Control",
            points: [
              "Panel de administración independiente para calibrar sensores y gestionar fuentes de datos."
            ]
          }
        ]
      }
    }
  },
  fr: {
    title: "Guide du Projet BHŪ-TATTVA-ANVEṢA",
    subtitle: "Manuel d'Architecture Système et d'Opérations Scientifiques",
    tabs: {
      overview: "1. Présentation",
      satellites: "2. Observation Spatiale",
      fusion: "3. Fusion de Capteurs",
      digitalTwin: "4. Jumeau Numérique 3D",
      areaSelection: "5. Sélection de Zone",
      scenarios: "6. Scénarios Prospectifs",
      security: "7. Sécurité & Admin",
    },
    chapters: {
      overview: {
        title: "Mission du Système",
        desc: "Système 3D d'exploration des sols et de l'hydrologie du bassin de la rivière Kabini utilisant ISRO Bhuvan et Copernicus.",
        sections: [
          {
            heading: "Objectifs",
            points: [
              "Intégration multi-satellite Sentinel-1/2, SMAP et IoT sol à une résolution de 10 mètres.",
              "Suivi en temps réel de l'humidité des sols, du carbone organique et de la santé végétale (NDVI)."
            ]
          }
        ]
      },
      satellites: {
        title: "Données Satellitaires et In-Situ",
        desc: "Combinaison radar SAR tout temps et imagerie optique haute résolution.",
        sections: [
          {
            heading: "Sources",
            points: [
              "Sentinel-1 SAR : Mesure radar micro-ondes de l'humidité de surface.",
              "Sondes de sol FDR in situ à 5cm et 30cm de profondeur."
            ]
          }
        ]
      },
      fusion: {
        title: "Fusion de Capteurs en 5 Étapes",
        desc: "Filtrage de Kalman et modélisation physique avec intervalle de confiance à 95%.",
        sections: [
          {
            heading: "Architecture",
            points: [
              "Harmonisation temporelle, désagrégation spatiale à 10m et modélisation hydraulique."
            ]
          }
        ]
      },
      digitalTwin: {
        title: "Jumeau Numérique 3D",
        desc: "Moteur 3D temps réel pour l'analyse des risques d'inondation et de sécheresse.",
        sections: [
          {
            heading: "Fonctionnalités",
            points: [
              "Élévation topographique 3D, simulation de crue et indicateurs télémétriques."
            ]
          }
        ]
      },
      areaSelection: {
        title: "Sélection Géographique Dynamique",
        desc: "Sélectionnez une parcelle sur la carte pour recalculer instantanément les diagnostics environnementaux.",
        sections: [
          {
            heading: "Utilisation",
            points: [
              "Calcul immédiat de la superficie en km² et mise à jour des séries temporelles associées."
            ]
          }
        ]
      },
      scenarios: {
        title: "Modélisation de Scénarios",
        desc: "Simulation de vagues de chaleur (+3.5°C) et de déficit de mousson (-40%).",
        sections: [
          {
            heading: "Impacts",
            points: [
              "Évaluation du stress hydrique et assistance conversationnelle RAG spécialisée."
            ]
          }
        ]
      },
      security: {
        title: "Sécurité et Console d'Administration",
        desc: "Gestion rigoureuse des rôles avec redirection dédiée pour l'administrateur.",
        sections: [
          {
            heading: "Droits",
            points: [
              "Console d'administration sécurisée pour la gestion des capteurs et jeux de données."
            ]
          }
        ]
      }
    }
  },
  de: {
    title: "BHŪ-TATTVA-ANVEṢA Projekthandbuch",
    subtitle: "Umfassendes Handbuch zur Systemarchitektur und Sensorfusion",
    tabs: {
      overview: "1. Systemübersicht",
      satellites: "2. Erdbeobachtung",
      fusion: "3. Sensorfusion",
      digitalTwin: "4. 3D-Digitaler Zwilling",
      areaSelection: "5. Gebietsauswahl",
      scenarios: "6. Was-wäre-wenn",
      security: "7. Sicherheit & Admin",
    },
    chapters: {
      overview: {
        title: "Systemarchitektur & Mission",
        desc: "Fortschrittliches 3D-System für Boden- und Wasserökosysteme im Kabini-Becken.",
        sections: [
          {
            heading: "Hauptziele",
            points: [
              "Kombination von Sentinel-1/2, SMAP und Vor-Ort-IoT-Sensoren auf einem 10-Meter-Gitter.",
              "Echtzeit-Überwachung von Bodenfeuchte, organischem Kohlenstoff und Vegetationsvitalität."
            ]
          }
        ]
      },
      satellites: {
        title: "Satellitendaten und Sensoren",
        desc: "Radar- und Multispektraldaten im Verbund mit IoT-Bodenfeuchtesonden.",
        sections: [
          {
            heading: "Datenströme",
            points: [
              "Sentinel-1 SAR Radar für wetterunabhängige Oberflächenfeuchte.",
              "12 IoT-Sensoren in 5cm und 30cm Tiefe."
            ]
          }
        ]
      },
      fusion: {
        title: "5-Stufen Sensorfusion",
        desc: "Kalman-Filterung und physikbasierte Bodenwasserretention mit 95% Konfidenzintervall.",
        sections: [
          {
            heading: "Phasen",
            points: [
              "Zeitliche Synchronisation, räumliches Downscaling auf 10m und Unsicherheitsquantifizierung."
            ]
          }
        ]
      },
      digitalTwin: {
        title: "3D-Digitaler Zwilling",
        desc: "Hardwarebeschleunigte 3D-Landschaft mit Hochwasser- und Dürresimulation.",
        sections: [
          {
            heading: "Funktionen",
            points: [
              "Echtzeit-Flutungssimulator und Sonnenstand-Beleuchtung."
            ]
          }
        ]
      },
      areaSelection: {
        title: "Dynamische Parzellenauswahl",
        desc: "Wählen Sie ein Areal auf der Karte, um spezifische Umweltdaten sofort zu berechnen.",
        sections: [
          {
            heading: "Bedienung",
            points: [
              "Berechnung von Fläche (ha/km²) und 14-Tage-Historie für den ausgewählten Sektor."
            ]
          }
        ]
      },
      scenarios: {
        title: "Szenarien-Simulation",
        desc: "Modellierung von Hitzewellen (+3.5°C) und Dürreereignissen.",
        sections: [
          {
            heading: "Erkenntnisse",
            points: [
              "Fundierte Entscheidungsunterstützung mittels RAG-KI-Assistent."
            ]
          }
        ]
      },
      security: {
        title: "Sicherheit und Admin-Bereich",
        desc: "JWT-Authentifizierung mit klarer Trennung zwischen Benutzer und Administrator.",
        sections: [
          {
            heading: "Zugriff",
            points: [
              "Separate Admin-Konsole für Sensorkalibrierung und Datenverwaltung."
            ]
          }
        ]
      }
    }
  },
  ja: {
    title: "BHŪ-TATTVA-ANVEṢA プロジェクト総合ガイド",
    subtitle: "地球観測・3D土壌環境デジタルツイン システム構造解説書",
    tabs: {
      overview: "1. システム概要",
      satellites: "2. 衛星データ連携",
      fusion: "3. センサーフュージョン",
      digitalTwin: "4. 3Dデジタルツイン",
      areaSelection: "5. 領域選択機能",
      scenarios: "6. シナリオ分析",
      security: "7. セキュリティ管理",
    },
    chapters: {
      overview: {
        title: "システム概要とミッション",
        desc: "ISRO Bhuvan、Sentinel-1/2、SMAP衛星および地上IoTセンサーを統合した、カビニ流域向け高精度3D土壌・水文環境ネクサスシステムです。",
        sections: [
          {
            heading: "主要目的",
            points: [
              "10m解像度グリッドでの土壌水分量、有機炭素量、植生指数(NDVI)のリアルタイム推計。",
              "カルマンフィルターを用いた5段階センサーフュージョンと95%信頼区間の提示。",
              "3Dデジタルツインによるリアルタイム洪水・干ばつシミュレーション。"
            ]
          }
        ]
      },
      satellites: {
        title: "衛星観測および地上IoT",
        desc: "マイクロ波SARレーダーと光学多波長センサーの連携。",
        sections: [
          {
            heading: "データソース",
            points: [
              "Sentinel-1 SAR: 雲を透過し昼夜を問わず表層土壌水分を観測。",
              "Sentinel-2 MSI: 植生の健康状態および水分ストレスを評価。",
              "地上12箇所のFDR土壌水分プローブ（深さ5cm・30cm）。"
            ]
          }
        ]
      },
      fusion: {
        title: "5段階センサーフュージョン",
        desc: "カルマンフィルターと土壌物理モデルによる高精度推定。",
        sections: [
          {
            heading: "フュージョン工程",
            points: [
              "時間同期、10mダウンスケーリング、物理的保水曲線モデルの適用、不確実性の定量化。"
            ]
          }
        ]
      },
      digitalTwin: {
        title: "3Dデジタルツイン",
        desc: "Three.jsによるリアルタイム地形レンダリングと環境シミュレーター。",
        sections: [
          {
            heading: "機能",
            points: [
              "貯水池水位上昇（+1m〜+10m）シミュレーション、干ばつ亀裂シミュレーション、テレメトリHUD表示。"
            ]
          }
        ]
      },
      areaSelection: {
        title: "動的エリア選択機能",
        desc: "地図上で任意の区画やゾーンを選択すると、その領域の環境データが即座に再計算されます。",
        sections: [
          {
            heading: "利用方法",
            points: [
              "選択領域の面積（ha / km²）、土壌水分、14日間の時系列トレンドを即時に表示します。"
            ]
          }
        ]
      },
      scenarios: {
        title: "What-If シナリオモデリング",
        desc: "熱波（+3.5°C）や降雨不足（-40%）の影響を予測。",
        sections: [
          {
            heading: "評価",
            points: [
              "ドメイン特化型RAG AIアシスタントによる意思決定支援。"
            ]
          }
        ]
      },
      security: {
        title: "セキュリティと管理者ダッシュボード",
        desc: "JWT認証によるユーザーと管理者の権限分離。",
        sections: [
          {
            heading: "権限",
            points: [
              "管理者専用ダッシュボードによるセンサー登録・データ管理機能。"
            ]
          }
        ]
      }
    }
  }
};

const GOOGLE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'sa', name: 'संस्कृतम् (Sanskrit)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'es', name: 'Español (Spanish)' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'de', name: 'Deutsch (German)' },
  { code: 'ja', name: '日本語 (Japanese)' },
  { code: 'zh', name: '中文 (Chinese)' },
  { code: 'ru', name: 'Русский (Russian)' },
  { code: 'ar', name: 'العربية (Arabic)' },
  { code: 'pt', name: 'Português (Portuguese)' },
  { code: 'it', name: 'Italiano (Italian)' },
  { code: 'ko', name: '한국어 (Korean)' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'tr', name: 'Türkçe (Turkish)' },
  { code: 'nl', name: 'Nederlands (Dutch)' },
  { code: 'sv', name: 'Svenska (Swedish)' },
  { code: 'pl', name: 'Polski (Polish)' },
  { code: 'uk', name: 'Українська (Ukrainian)' },
  { code: 'vi', name: 'Tiếng Việt (Vietnamese)' },
  { code: 'th', name: 'ไทย (Thai)' },
  { code: 'fa', name: 'فارسی (Persian)' },
  { code: 'he', name: 'עברית (Hebrew)' },
  { code: 'ur', name: 'اردو (Urdu)' },
];

export const ProjectGuideModal: React.FC<ProjectGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'satellites' | 'fusion' | 'digitalTwin' | 'areaSelection' | 'scenarios' | 'security'>('overview');
  const [lang, setLang] = useState<string>('en');
  const [searchFilter, setSearchFilter] = useState('');

  // Fallback to English if translation is not directly predefined
  const content = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  const currentChapter = content.chapters[activeTab] || TRANSLATIONS['en'].chapters[activeTab];

  // Google Translate widget dynamic activation
  const triggerGoogleTranslate = (targetLang: string) => {
    setLang(targetLang);
    // If user selects a language not in predefined dictionary, trigger browser google translate bridge
    const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectElem) {
      selectElem.value = targetLang;
      selectElem.dispatchEvent(new Event('change'));
    }
  };

  useEffect(() => {
    // Inject Google Translate script if not present
    if (typeof window !== 'undefined' && !document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          },
          'google_translate_element'
        );
      };
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-5xl h-[88vh] bg-scientific-900 border border-scientific-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-scientific-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-scientific-950 border-b border-scientific-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-950/80 border border-emerald-600/50 rounded-xl">
              <BookOpen className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  {content.title}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  ISRO Bhuvan Certified Manual
                </span>
              </div>
              <p className="text-xs text-scientific-400">
                {content.subtitle}
              </p>
            </div>
          </div>

          {/* Language Selector & Google Translate Controls */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-scientific-800 border border-scientific-700 rounded-lg text-xs">
              <Languages className="w-4 h-4 text-cyan-400" />
              <select
                value={lang}
                onChange={(e) => triggerGoogleTranslate(e.target.value)}
                className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer pr-1"
                title="Select Documentation Language"
              >
                {GOOGLE_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-scientific-900 text-white">
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Hidden container for Google Translate Widget */}
            <div id="google_translate_element" className="hidden" />

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-scientific-800 rounded-lg text-scientific-400 hover:text-white transition-colors ml-2"
              title="Close Guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body with Sidebar Navigation */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Chapter Navigation Sidebar */}
          <div className="w-full md:w-64 bg-scientific-950/70 border-r border-scientific-800/80 p-3 space-y-1.5 overflow-y-auto">
            <div className="text-[11px] font-mono uppercase tracking-wider text-scientific-400 px-3 py-1 font-semibold">
              Project Chapters
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                activeTab === 'overview'
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-scientific-300 hover:bg-scientific-800/60'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Globe2 className="w-4 h-4" />
                <span>{content.tabs.overview}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('satellites')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                activeTab === 'satellites'
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-scientific-300 hover:bg-scientific-800/60'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4" />
                <span>{content.tabs.satellites}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('fusion')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                activeTab === 'fusion'
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-scientific-300 hover:bg-scientific-800/60'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4" />
                <span>{content.tabs.fusion}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('digitalTwin')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                activeTab === 'digitalTwin'
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-scientific-300 hover:bg-scientific-800/60'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Box className="w-4 h-4" />
                <span>{content.tabs.digitalTwin}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('areaSelection')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                activeTab === 'areaSelection'
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-scientific-300 hover:bg-scientific-800/60'
              }`}
            >
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>{content.tabs.areaSelection}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('scenarios')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                activeTab === 'scenarios'
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-scientific-300 hover:bg-scientific-800/60'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4" />
                <span>{content.tabs.scenarios}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                activeTab === 'security'
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-scientific-300 hover:bg-scientific-800/60'
              }`}
            >
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{content.tabs.security}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <div className="pt-4 mt-4 border-t border-scientific-800/80 px-3">
              <div className="p-2.5 bg-cyan-950/40 border border-cyan-800/50 rounded-xl space-y-1">
                <div className="text-[11px] font-bold text-cyan-300 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Google Translate</span>
                </div>
                <p className="text-[10px] text-cyan-200/80 leading-relaxed">
                  Support for over 100+ languages directly integrated. Switch language anytime from the top bar.
                </p>
              </div>
            </div>
          </div>

          {/* Chapter Content Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="border-b border-scientific-800 pb-4">
              <h3 className="text-xl font-bold text-white tracking-wide">
                {currentChapter.title}
              </h3>
              <p className="text-sm text-scientific-300 mt-1 leading-relaxed">
                {currentChapter.desc}
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              {currentChapter.sections.map((sec, idx) => (
                <div key={idx} className="bg-scientific-950/60 border border-scientific-800/80 rounded-xl p-5 space-y-3">
                  <h4 className="text-sm font-semibold text-emerald-300 font-mono flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{sec.heading}</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {sec.points.map((pt, pIdx) => (
                      <li key={pIdx} className="text-xs text-scientific-200 flex items-start space-x-2.5 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* System Provenance Footer Note */}
            <div className="p-4 bg-scientific-950/40 border border-scientific-800/60 rounded-xl text-xs text-scientific-400 flex items-center justify-between">
              <span>Kabini Sub-basin Hydrological Boundary (11.6°N - 12.2°N, 75.9°E - 76.6°E)</span>
              <span className="font-mono text-emerald-400">ISRO Bhuvan Spatial Protocol</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
