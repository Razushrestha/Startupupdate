import type { AppLocale } from "./locales";

type UiKeys =
  | "language"
  | "love"
  | "like"
  | "share"
  | "comment"
  | "addComment"
  | "postComment"
  | "shareStory"
  | "readingComfort"
  | "showingTranslation"
  | "originalEnglish"
  | "openInTranslate"
  | "linkCopied"
  | "thanksLove"
  | "moreOnStartup"
  | "category";

const dict: Record<AppLocale, Record<UiKeys, string>> = {
  en: {
    language: "Language",
    love: "Love",
    like: "Like",
    share: "Share",
    comment: "Comment",
    addComment: "Write a comment…",
    postComment: "Post",
    shareStory: "Share this story",
    readingComfort:
      "Reactions are shown to readers on this page and may inform how stories are ranked.",
    showingTranslation: "Reading in your language where available.",
    originalEnglish: "Article shown in English. Add more locales in your CMS.",
    openInTranslate: "Open in Google Translate",
    linkCopied: "Link copied. Share it with someone who’d care.",
    thanksLove: "Thank you. That tiny action lifts founders more than you’d think.",
    moreOnStartup: "More on this startup",
    category: "Category",
  },
  bn: {
    language: "ভাষা",
    love: "ভালোবাসা",
    like: "লাইক",
    share: "শেয়ার",
    comment: "মন্তব্য",
    addComment: "মন্তব্য লিখুন…",
    postComment: "পোস্ট",
    shareStory: "এই গল্পটি শেয়ার করুন",
    readingComfort:
      "সময় নিন. ভালো খবর উপভোগ করতে সময় লাগে। আপনার প্রতিক্রিয়া অন্যদেরও গুরুত্বপূর্ণ কিছু খুঁজে পেতে সাহায্য করে।",
    showingTranslation: "সম্ভব হলে আপনার ভাষায় দেখানো হচ্ছে।",
    originalEnglish: "নিবন্ধটি ইংরেজিতে. CMS থেকে আরও ভাষা যোগ করুন।",
    openInTranslate: "Google Translate এ খুলুন",
    linkCopied: "লিঙ্ক কপি হয়েছে. যার যত্ন নেন তার সাথে শেয়ার করুন।",
    thanksLove: "ধন্যবাদ. ছোট এই ভালোবাসা ফাউন্ডারদের বিশাল অনুপ্রেরণা।",
    moreOnStartup: "এই স্টার্টআপ সম্পর্কে আরও",
    category: "বিভাগ",
  },
  hi: {
    language: "भाषा",
    love: "प्यार",
    like: "लाइक",
    share: "शेयर",
    comment: "टिप्पणी",
    addComment: "टिप्पणी लिखें…",
    postComment: "पोस्ट",
    shareStory: "यह कहानी साझा करें",
    readingComfort:
      "अपना समय लें. अच्छी ख़बरों के साथ बैठना भी ज़रूरी है। आपकी प्रतिक्रिया दूसरों को सही कहानियाँ दिखाने में मदद करती है।",
    showingTranslation: "जहाँ उपलब्ध हो, आपकी भाषा में दिखाया जा रहा है।",
    originalEnglish: "लेख अंग्रेज़ी में. CMS में और भाषाएँ जोड़ें।",
    openInTranslate: "Google Translate में खोलें",
    linkCopied: "लिंक कॉपी हो गया. जिसे यह मायने रखता है उसके साथ भेजें।",
    thanksLove: "धन्यवाद. छोटी सी प्रेरणा भी संस्थापकों के लिए बड़ी होती है।",
    moreOnStartup: "इस स्टार्टअप पर और",
    category: "श्रेणी",
  },
  ur: {
    language: "زبان",
    love: "محبت",
    like: "پسند",
    share: "شئیر",
    comment: "تبصرہ",
    addComment: "تبصرہ لکھیں…",
    postComment: "بھیجیں",
    shareStory: "یہ کہانی شیئر کریں",
    readingComfort:
      "آرام سے پڑھیں. اچھی خبریں سننے میں وقت لگتا ہے۔ آپ کی کاوش دوسروں تک اہم کہانیاں پہنچاتی ہے۔",
    showingTranslation: "جہاں دستیاب ہو، آپ کی زبان میں۔",
    originalEnglish: "مضمون انگریزی میں. CMS سے مزید زبانیں شامل کریں۔",
    openInTranslate: "Google Translate میں کھولیں",
    linkCopied: "لنک کاپی ہوا. جسے یہ اہمیت رکھتی ہو بھیجیں۔",
    thanksLove: "شکریہ. چھوٹی سی حوصلہ افزائی بھی بانیوں کے لیے بڑی ہوتی ہے۔",
    moreOnStartup: "اس اسٹارٹ اپ پر مزید",
    category: "زمرہ",
  },
  si: {
    language: "භාෂාව",
    love: "ආදරය",
    like: "ලයික්",
    share: "ශෙයා",
    comment: "අදහස",
    addComment: "අදහස ටයිප් කරන්න…",
    postComment: "පළකරන්න",
    shareStory: "මේ කතාව බෙදාගන්න",
    readingComfort:
      "සෙමින් කියවන්න. හොඳ පුවත්වල ගැඹුර විඳින්න. ඔබේ ප්‍රතිචාර වෙනත් කියවන්නන්ට මාර්ගෝපදේශයක් වෙයි.",
    showingTranslation: "ලබා ගත හැකි වූ විට ඔබේ භාෂාවෙන්.",
    originalEnglish: "ලිපිය ඉංග්‍රීසි. CMS හරහා තව භාෂා එක් කරන්න.",
    openInTranslate: "Google Translate විදින් ආරම්භ කරන්න",
    linkCopied: "සබැඳිය කොපි විය. එය සැලකිලිමත් කෙනෙකුට යවන්න.",
    thanksLove: "ස්තූතියි. කුඩා උණුසුමක් වුවත් ආරම්භකයන්ට ලොකුයි.",
    moreOnStartup: "මෙම ආරම්භක ව්‍යවසාය ගැන තවත්",
    category: "වර්ගය",
  },
  ne: {
    language: "भाषा",
    love: "माया",
    like: "मन पर्‍यो",
    share: "सेयर",
    comment: "प्रतिक्रिया",
    addComment: "प्रतिक्रिया लेख्नुहोस्…",
    postComment: "पोस्ट",
    shareStory: "यो कथा सेयर गर्नुहोस्",
    readingComfort:
      "बिस्तारै पढ्नुहोस्. राम्रो खबरलाई अनुभव गर्न समय चाहिन्छ। तपाईँको प्रतिक्रियाले अरूलाई महत्त्वपूर्ण कुराहरू भेट्न मद्दत गर्छ।",
    showingTranslation: "उपलब्ध भए जहिले तपाईँको भाषामा।",
    originalEnglish: "लेख अङ्ग्रेजीमा. CMS बाट थप भाषाहरू थप्नुहोस्।",
    openInTranslate: "Google Translate मा खोल्नुहोस्",
    linkCopied: "लिङ्क कपि भयो. जसलाई मतलब छ उसैसँग पठाउनुहोस्।",
    thanksLove: "धन्यवाद. सानो सप्रिन सङ्केतले पनि संस्थापकलाई धेरै हुन्छ।",
    moreOnStartup: "यस स्टार्टअपबारे अझ",
    category: "श्रेणी",
  },
  ta: {
    language: "மொழி",
    love: "அன்பு",
    like: "விருப்பு",
    share: "பகிர்",
    comment: "கருத்து",
    addComment: "கருத்தை எழுதவும்…",
    postComment: "வெளியிடு",
    shareStory: "இக் கதையைப் பகிரவும்",
    readingComfort:
      "மெதுவாகப் படிக்கவும். நல்ல செய்திகளுக்கு உங்கள் நேரம் தேவை. உங்கள் உணர்வோட்டம் மற்ற வாசகர்களுக்குப் பாதை காட்டும்.",
    showingTranslation: "கிடைக்கும்போது உங்கள் மொழியில்.",
    originalEnglish: "கட்டுரை ஆங்கிலத்தில். CMS மூலம் மேலும் மொழிகளைச் சேர்க்கவும்.",
    openInTranslate: "Google Translate இல் திறக்க",
    linkCopied: "இணைப்பு நகலாயிற்று. முக்கியமானவருடன் பகிரவும்.",
    thanksLove: "நன்றி. சிறு ஊக்கமும் துவக்குநர்களுக்குப் பெரியது.",
    moreOnStartup: "இந்த ஸ்டார்ட்அப்பைப் பற்றி மேலும்",
    category: "வகை",
  },
  "ta-LK": {
    language: "மொழி",
    love: "அன்பு",
    like: "விருப்பு",
    share: "பகிர்",
    comment: "கருத்து",
    addComment: "கருத்து…",
    postComment: "பதிவு",
    shareStory: "இந்தக் கதையைப் பகிரவும்",
    readingComfort:
      "அமைதியாகப் படிக்கவும். நல்ல செய்தி உணர்வை ஆழமாகத் தருகிறது. உங்கள் பதில் மற்றவர்களுக்கு வழிகாட்டும்.",
    showingTranslation: "கிடைக்கும்போது உங்கள் மொழியில்.",
    originalEnglish: "கட்டுரை ஆங்கிலத்தில். CMS மூலம் மொழிகளைச் சேர்க்கலாம்.",
    openInTranslate: "Google Translate இல் திற",
    linkCopied: "இணைப்பு நகலெடுக்கப்பட்டது.",
    thanksLove: "நன்றி. சிறு ஊக்கம் பெரிது.",
    moreOnStartup: "இந்த ஸ்டார்ட்அப்பைப் பற்றி மேலும்",
    category: "வகை",
  },
  id: {
    language: "Bahasa",
    love: "Sayang",
    like: "Suka",
    share: "Bagikan",
    comment: "Komentar",
    addComment: "Tulis komentar…",
    postComment: "Kirim",
    shareStory: "Bagikan cerita ini",
    readingComfort:
      "Luangkan waktu membaca. Kabar baik layak dihayati. Reaksi Anda membantu pembaca lain menemukan cerita yang bermakna.",
    showingTranslation: "Dalam bahasa Anda jika tersedia.",
    originalEnglish: "Artikel dalam bahasa Inggris. Tambahkan bahasa di CMS Anda.",
    openInTranslate: "Buka di Google Terjemahan",
    linkCopied: "Tautan disalin. Kirim ke siapa pun yang peduli.",
    thanksLove: "Terima kasih. Dukungan kecil Anda sangat berarti bagi para pendiri.",
    moreOnStartup: "Selengkapnya tentang startup ini",
    category: "Kategori",
  },
  ms: {
    language: "Bahasa",
    love: "Sayang",
    like: "Suka",
    share: "Kongsi",
    comment: "Komen",
    addComment: "Tulis komen…",
    postComment: "Hantar",
    shareStory: "Kongsi cerita ini",
    readingComfort:
      "Luangkan masa membaca. Berita baik patut dirasai. Tindakan anda membantu pembaca lain menemui cerita penting.",
    showingTranslation: "Dalam bahasa anda jika tersedia.",
    originalEnglish: "Artikel dalam bahasa Inggeris. Tambah bahasa melalui CMS.",
    openInTranslate: "Buka dalam Google Translate",
    linkCopied: "Pautan disalin. Kongsi dengan mereka yang peduli.",
    thanksLove: "Terima kasih. Sokongan kecil bermakna besar untuk pengasas.",
    moreOnStartup: "Lagi tentang permulaan ini",
    category: "Kategori",
  },
};

export function uiT(locale: AppLocale, key: UiKeys): string {
  return dict[locale]?.[key] ?? dict.en[key];
}
