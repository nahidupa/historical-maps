# Adding Videos from Oases of Wisdom Channel

## Channel
- **URL**: https://www.youtube.com/@OasesOfWisdom/videos
- **Focus**: Muslim Scholars and Islamic Knowledge

## How to Add Videos

### Step 1: Browse the Channel
Visit https://www.youtube.com/@OasesOfWisdom/videos and look for videos about specific scholars.

### Step 2: Video Format
Each video entry in `scholars.json` or `greek_philosophers.json` should follow this structure:

```json
{
  "title": {
    "en": "Video Title in English",
    "bn": "ভিডিও শিরোনাম বাংলায়",
    "de": "Video Titel auf Deutsch (optional)"
  },
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

### Step 3: Video ID
- Copy the YouTube URL: `https://www.youtube.com/watch?v=BHHAkDMjRqI`
- The video ID is: `BHHAkDMjRqI` (the part after `v=`)

### Step 4: Use the Helper Script
Run the Python helper script to add videos:

```bash
python3 add_oases_videos.py --scholar "Ibn Sina" --title "Ibn Sina Explained" --video_id "ViI5ZwC8cgM"
```

## Examples of Known Oases of Wisdom Videos
(To be discovered by visiting the channel)

### Video IDs Found on Channel
- ViI5ZwC8cgM
- Dlf_tIfQmKM
- yDhXXHjlBvo
- vm5Bw0i4rSM

## Popular Muslim Scholars in Data
- Abu Hanifa
- Imam Malik
- Imam al-Shafi'i
- Imam Ahmad ibn Hanbal
- Al-Kindi
- Al-Razi
- Al-Farabi
- Ibn al-Haytham
- Al-Biruni
- Ibn Sina
- Al-Ghazali
- Ibn Rushd
- Al-Zamakhshari

## Multilingual Titles
When adding videos, try to provide titles in multiple languages:
- **en**: English
- **bn**: Bengali (use translator or existing patterns)
- **de**: German (optional)

## Tips
1. **Match Scholar Names**: Ensure the video is actually about the scholar you're adding it to
2. **Check Duplication**: Don't add duplicate videos for the same scholar
3. **Multiple Videos**: You can add multiple videos to one scholar - just expand the "videos" array
4. **Update Both Files**: If a video covers Greek philosophers, update `greek_philosophers.json` as well

## JSON Structure Example with Multiple Videos

```json
{
  "id": "ibn_sina",
  "name": { "en": "Ibn Sina", "bn": "ইবনে সিনা" },
  "videos": [
    {
      "title": { "en": "Ibn Sina: The Master Physician" },
      "url": "https://www.youtube.com/watch?v=EXISTING_ID"
    },
    {
      "title": { "en": "Ibn Sina Biography - Oases of Wisdom" },
      "url": "https://www.youtube.com/watch?v=ViI5ZwC8cgM"
    }
  ]
}
```

## Questions?
- How to find video IDs? They're at the end of YouTube URLs after `v=`
- How to translate titles? Use Google Translate or create English-only titles
- Need help? Open an issue with the video URL and target scholar name
