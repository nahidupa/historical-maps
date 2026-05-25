import json

# Read scholars file
with open('scholars.json', 'r', encoding='utf-8') as f:
    scholars_data = json.load(f)

# Add more modern scholars
new_scholars = [
    {
        "id": "fazlurrahman",
        "initials": "FR",
        "color": "#7C3AED",
        "colorBg": "#7C3AED22",
        "colorText": "#7C3AED",
        "born": 1919,
        "died": 1988,
        "name": {"en": "Fazlur Rahman", "bn": "ফজলুর রহমান"},
        "arabic": "فضل الرحمن",
        "birthplace": {"en": "Hazara, British India", "bn": "হাজারা, ব্রিটিশ ভারত", "coords": [34.0, 73.0]},
        "active": {"en": "Chicago · Lahore", "bn": "শিকাগো · লাহোর", "coords": [41.8781, -87.6298]},
        "title": {"en": "Islamic Modernist", "bn": "ইসলামী আধুনিকতাবাদী"},
        "field": {"en": "Islamic Philosophy · Theology · Quranic Studies", "bn": "ইসলামী দর্শন · ধর্মতত্ত্ব · কুরআন অধ্যয়ন"},
        "summary": {"en": "A leading Islamic modernist who sought to reinterpret Islamic tradition in light of contemporary thought.", "bn": "একজন প্রধান ইসলামী আধুনিকতাবাদী যিনি সমসাময়িক চিন্তার আলোকে ইসলামী ঐতিহ্যের পুনর্ব্যাখ্যা করতে চেয়েছিলেন।"},
        "works": [{"title": {"en": "Islam and Modernity", "bn": "ইসলাম ও আধুনিকতা"}, "desc": {"en": "His major work on transforming Islamic thought.", "bn": "ইসলামী চিন্তার রূপান্তর নিয়ে তার প্রধান কাজ।"}}],
        "journeys": []
    },
    {
        "id": "ismailalfaruqi",
        "initials": "IF",
        "color": "#0891B2",
        "colorBg": "#0891B222",
        "colorText": "#0891B2",
        "born": 1921,
        "died": 1986,
        "name": {"en": "Ismail al-Faruqi", "bn": "ইসমাইল আল-ফারুকি"},
        "arabic": "إسماعيل الفاروقي",
        "birthplace": {"en": "Jaffa, Palestine", "bn": "জাফা, ফিলিস্তিন", "coords": [32.0543, 34.7516]},
        "active": {"en": "Philadelphia · Damascus", "bn": "ফিলাডেলফিয়া · দামেস্ক", "coords": [39.9526, -75.1652]},
        "title": {"en": "Scholar of Comparative Religion", "bn": "তুলনামূলক ধর্ম বিশেষজ্ঞ"},
        "field": {"en": "Islamic Studies · Comparative Religion · Philosophy", "bn": "ইসলামী অধ্যয়ন · তুলনামূলক ধর্ম · দর্শন"},
        "summary": {"en": "A Palestinian-American philosopher who pioneered the Islamization of knowledge movement.", "bn": "একজন ফিলিস্তিনি-আমেরিকান দার্শনিক যিনি জ্ঞানের ইসলামীকরণ আন্দোলনের পথপ্রদর্শক ছিলেন।"},
        "works": [{"title": {"en": "The Islamization of Knowledge", "bn": "জ্ঞানের ইসলামীকরণ"}, "desc": {"en": "A framework for integrating Islamic values with modern knowledge.", "bn": "আধুনিক জ্ঞানের সাথে ইসলামী মূল্যবোধের সমন্বয়ের কাঠামো।"}}],
        "journeys": []
    }
]

scholars_data['scholars'].extend(new_scholars)

with open('scholars.json', 'w', encoding='utf-8') as f:
    json.dump(scholars_data, f, ensure_ascii=False, indent=2)

# Read Greek philosophers file
with open('greek_philosophers.json', 'r', encoding='utf-8') as f:
    greek_data = json.load(f)

# Add modern classical scholarship references
modern_greeks = [
    {
        "id": "werner_jaeger",
        "name": {"en": "Werner Jaeger", "bn": "ভার্নার ইয়েগার"},
        "lifespan": "1888–1961",
        "summary": {"en": "German-American classicist who studied Greek philosophy's influence on Western civilization.", "bn": "জার্মান-আমেরিকান ধ্রুপদী পণ্ডিত যিনি পাশ্চাত্য সভ্যতার ওপর গ্রিক দর্শনের প্রভাব অধ্যয়ন করেছিলেন।"},
        "field": {"en": "Classical Philology · History of Philosophy", "bn": "ধ্রুপদী ভাষাতত্ত্ব · দর্শনের ইতিহাস"},
        "birthplace": {"en": "Lobberich, Germany", "bn": "লবেরিশ, জার্মানি", "coords": [51.2667, 6.3667]},
        "active": {"en": "Harvard · Berlin", "bn": "হার্ভার্ড · বার্লিন", "coords": [42.3770, -71.1167]},
        "works": [{"title": {"en": "Paideia: The Ideals of Greek Culture", "bn": "পাইডেইয়া: গ্রিক সংস্কৃতির আদর্শ"}, "desc": {"en": "A comprehensive study of Greek educational ideals.", "bn": "গ্রিক শিক্ষা আদর্শের ব্যাপক অধ্যয়ন।"}}],
        "influence": {"en": "Revived scholarly interest in Greek philosophy's continuing relevance to modern thought.", "bn": "আধুনিক চিন্তার সাথে গ্রিক দর্শনের ক্রমাগত প্রাসঙ্গিকতার বৈজ্ঞানিক আগ্রহ পুনরুজ্জীবিত করেন।"},
        "eras": [6]
    },
    {
        "id": "eric_voegelin",
        "name": {"en": "Eric Voegelin", "bn": "এরিক ভয়েগেলিন"},
        "lifespan": "1901–1985",
        "summary": {"en": "German-American political philosopher who studied the influence of Greek philosophy on political order.", "bn": "জার্মান-আমেরিকান রাজনৈতিক দার্শনিক যিনি রাজনৈতিক শৃঙ্খলায় গ্রিক দর্শনের প্রভাব অধ্যয়ন করেছিলেন।"},
        "field": {"en": "Political Philosophy · History of Ideas", "bn": "রাজনৈতিক দর্শন · ধারণার ইতিহাস"},
        "birthplace": {"en": "Cologne, Germany", "bn": "কোলন, জার্মানি", "coords": [50.9375, 6.9603]},
        "active": {"en": "Stanford · Munich", "bn": "স্ট্যানফোর্ড · মিউনিখ", "coords": [37.4275, -122.1697]},
        "works": [{"title": {"en": "Order and History", "bn": "শৃঙ্খলা ও ইতিহাস"}, "desc": {"en": "A multi-volume study tracing Greek philosophical concepts through history.", "bn": "ইতিহাসের মধ্য দিয়ে গ্রিক দার্শনিক ধারণার বহু-খণ্ড অধ্যয়ন।"}}],
        "influence": {"en": "Demonstrated the continuing influence of Plato and Aristotle on modern political thought.", "bn": "আধুনিক রাজনৈতিক চিন্তায় প্লেটো এবং অ্যারিস্টটলের ক্রমাগত প্রভাব প্রদর্শন করেন।"},
        "eras": [6]
    },
    {
        "id": "pierre_hadot",
        "name": {"en": "Pierre Hadot", "bn": "পিয়ের আদো"},
        "lifespan": "1922–2010",
        "summary": {"en": "French historian of philosophy who studied ancient Greek philosophy as a way of life.", "bn": "দর্শনের ফরাসি ইতিহাসবিদ যিনি প্রাচীন গ্রিক দর্শনকে জীবনযাপনের উপায় হিসেবে অধ্যয়ন করেছিলেন।"},
        "field": {"en": "History of Philosophy · Ancient Philosophy", "bn": "দর্শনের ইতিহাস · প্রাচীন দর্শন"},
        "birthplace": {"en": "Paris, France", "bn": "প্যারিস, ফ্রান্স", "coords": [48.8566, 2.3522]},
        "active": {"en": "Collège de France", "bn": "কলেজ দ্য ফ্রান্স", "coords": [48.8566, 2.3522]},
        "works": [{"title": {"en": "Philosophy as a Way of Life", "bn": "জীবনযাপনের উপায় হিসেবে দর্শন"}, "desc": {"en": "Explored Greek philosophy as spiritual exercises.", "bn": "আধ্যাত্মিক অনুশীলন হিসেবে গ্রিক দর্শন অন্বেষণ করেন।"}}],
        "influence": {"en": "Renewed interest in the practical and transformative aspects of ancient Greek philosophy.", "bn": "প্রাচীন গ্রিক দর্শনের ব্যবহারিক এবং রূপান্তরকারী দিকগুলিতে নবীন আগ্রহ।"},
        "eras": [6]
    }
]

greek_data['philosophers'].extend(modern_greeks)

with open('greek_philosophers.json', 'w', encoding='utf-8') as f:
    json.dump(greek_data, f, ensure_ascii=False, indent=2)

print("✅ Added modern scholars and Greek philosophers!")
print(f"Total scholars: {len(scholars_data['scholars'])}")
print(f"Total Greek philosophers: {len(greek_data['philosophers'])}")
