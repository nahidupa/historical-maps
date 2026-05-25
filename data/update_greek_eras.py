#!/usr/bin/env python3
import json

# Read the current file
with open('greek_philosophers.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Update eras for existing philosophers to add more coverage
era_updates = {
    'socrates': [0, 3, 4],
    'plato': [0, 3, 4],
    'aristotle': [0, 3, 4, 5],
    'galen': [0, 1, 2, 3, 4, 5],
    'ptolemy': [0, 3, 4, 5],
    'euclid': [0, 3, 4, 5],
    'archimedes': [0, 3, 4],
    'hippocrates': [0, 1, 2, 3, 4, 5],
    'herodotus': [0],
    'pythagoras': [0, 3, 4]
}

# Update existing philosophers
for phil in data['philosophers']:
    if phil['id'] in era_updates:
        phil['eras'] = era_updates[phil['id']]

# Add new Greek philosophers for missing eras
new_philosophers = [
    {
        "id": "john_philoponus",
        "name": {
            "en": "John Philoponus",
            "bn": "জন ফিলোপোনাস"
        },
        "lifespan": "490–570 CE",
        "summary": {
            "en": "Late antique Christian philosopher who challenged Aristotelian physics; his critique influenced Islamic philosophy.",
            "bn": "প্রাচীন-উত্তর খ্রিস্টান দার্শনিক যিনি অ্যারিস্টটলীয় পদার্থবিদ্যাকে চ্যালেঞ্জ করেছিলেন; তার সমালোচনা ইসলামী দর্শনকে প্রভাবিত করে।"
        },
        "field": {
            "en": "Physics · Theology · Logic",
            "bn": "পদার্থবিদ্যা · ধর্মতত্ত্ব · যুক্তিবিদ্যা"
        },
        "birthplace": {
            "en": "Alexandria, Egypt",
            "bn": "আলেকজান্দ্রিয়া, মিশর",
            "coords": [31.2001, 29.9187]
        },
        "active": {
            "en": "Alexandria",
            "bn": "আলেকজান্দ্রিয়া",
            "coords": [31.2001, 29.9187]
        },
        "works": [
            {
                "title": {
                    "en": "Against Aristotle on the Eternity of the World",
                    "bn": "বিশ্বের চিরন্তনতা প্রসঙ্গে অ্যারিস্টটলের বিরুদ্ধে"
                },
                "desc": {
                    "en": "A critique arguing for creation in time, influencing Islamic theological debates.",
                    "bn": "সময়ে সৃষ্টির পক্ষে যুক্তি, যা ইসলামী ধর্মতাত্ত্বিক বিতর্ককে প্রভাবিত করে।"
                }
            },
            {
                "title": {
                    "en": "Commentary on Aristotle's Physics",
                    "bn": "অ্যারিস্টটলের পদার্থবিদ্যার ওপর ভাষ্য"
                },
                "desc": {
                    "en": "Challenged Aristotelian ideas about motion and impetus.",
                    "bn": "গতি ও চালকশক্তি নিয়ে অ্যারিস্টটলীয় ধারণাকে চ্যালেঞ্জ করে।"
                }
            }
        ],
        "influence": {
            "en": "His critiques of Aristotle provided tools for Islamic philosophers like Al-Ghazali to challenge peripatetic philosophy.",
            "bn": "অ্যারিস্টটলের তার সমালোচনা আল-গাজালীর মতো ইসলামী দার্শনিকদের জন্য প্রত্যাশিত দর্শনকে চ্যালেঞ্জ করার হাতিয়ার প্রদান করে।"
        },
        "eras": [1, 2, 3]
    },
    {
        "id": "plotinus",
        "name": {
            "en": "Plotinus",
            "bn": "প্লোটিনাস"
        },
        "lifespan": "204–270 CE",
        "summary": {
            "en": "Founder of Neoplatonism; his ideas on emanation influenced Islamic mysticism and philosophy.",
            "bn": "নব্যপ্লেটোবাদের প্রতিষ্ঠাতা; নির্গমন সম্পর্কে তার ধারণা ইসলামী তাসাউফ ও দর্শনকে প্রভাবিত করে।"
        },
        "field": {
            "en": "Metaphysics · Mysticism · Neoplatonism",
            "bn": "অধিবিদ্যা · মরমিবাদ · নব্যপ্লেটোবাদ"
        },
        "birthplace": {
            "en": "Lycopolis, Egypt",
            "bn": "লাইকোপোলিস, মিশর",
            "coords": [27.1809, 31.1656]
        },
        "active": {
            "en": "Rome",
            "bn": "রোম",
            "coords": [41.9028, 12.4964]
        },
        "works": [
            {
                "title": {
                    "en": "Enneads",
                    "bn": "এনিয়াডস"
                },
                "desc": {
                    "en": "A philosophical text on the One, emanation, and mystical union.",
                    "bn": "একত্ব, নির্গমন এবং মরমি ঐক্য সম্পর্কে দার্শনিক গ্রন্থ।"
                }
            }
        ],
        "influence": {
            "en": "Neoplatonic concepts of emanation shaped Islamic philosophical cosmology and Sufi thought.",
            "bn": "নির্গমনের নব্যপ্লেটোনীয় ধারণা ইসলামী দার্শনিক বিশ্বতত্ত্ব ও সুফি চিন্তাকে প্রভাবিত করে।"
        },
        "eras": [0, 1, 3]
    }
]

# Add new philosophers
data['philosophers'].extend(new_philosophers)

# Write back
with open('greek_philosophers.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated greek_philosophers.json successfully!")
print("Total philosophers:", len(data['philosophers']))
