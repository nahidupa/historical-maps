# Video Management for Islamic Scholars

## Quick Start: Add Videos from Oases of Wisdom

### Option 1: Add Single Video
```bash
cd /path/to/historical-maps/data
python3 add_oases_videos.py \
  --scholar "Ibn Sina" \
  --title "Ibn Sina: Master Physician - Oases of Wisdom" \
  --video_id "ViI5ZwC8cgM"
```

### Option 2: Batch Add Multiple Videos
1. Create a CSV file with videos:
   ```
   scholar_name, video_title, video_id
   Ibn Sina, Ibn Sina Biography, ViI5ZwC8cgM
   Al-Ghazali, Al-Ghazali Philosophy, Dlf_tIfQmKM
   Al-Kindi, Al-Kindi - Arab Philosopher, yDhXXHjlBvo
   ```

2. Run batch script:
   ```bash
   python3 batch_add_videos.py videos.csv
   ```

## Finding Videos on Oases of Wisdom

### Channel URL
https://www.youtube.com/@OasesOfWisdom/videos

### Steps to Extract Video IDs
1. Visit the channel URL above
2. Scroll through videos and look for scholar names
3. Click on a video to open it
4. The URL will be: `https://www.youtube.com/watch?v=VIDEO_ID`
5. Copy the `VIDEO_ID` part (e.g., `ViI5ZwC8cgM`)

### Known Oases of Wisdom Video IDs
- `ViI5ZwC8cgM` - Ibn Sina
- `Dlf_tIfQmKM` - Al-Ghazali  
- `yDhXXHjlBvo` - Al-Kindi
- `vm5Bw0i4rSM` - Al-Farabi

## File Formats

### Single Video (in JSON)
```json
{
  "title": {
    "en": "Ibn Sina: Master Physician",
    "bn": "ইবনে সিনা: চিকিৎসক দর্শক"
  },
  "url": "https://www.youtube.com/watch?v=ViI5ZwC8cgM"
}
```

### Batch CSV Format
```csv
scholar_name, video_title, video_id
Ibn Sina, Ibn Sina Biography, ViI5ZwC8cgM
Al-Ghazali, Al-Ghazali Philosophy, Dlf_tIfQmKM
```

## Script Features

### `add_oases_videos.py`
- Add single video to a scholar
- Handles scholar name matching (case-insensitive)
- Prevents duplicate videos
- Auto-creates `videos` array if missing

**Usage:**
```bash
python3 add_oases_videos.py --scholar "Ibn Sina" --title "Video Title" --video_id "ABC123"
```

### `batch_add_videos.py`
- Add multiple videos from CSV file
- Reports success/failure for each video
- Prevents duplicates
- Batch processing support

**Usage:**
```bash
python3 batch_add_videos.py videos.csv [output_file]
```

## Available Scholars in Database

### Islamic Scholars (scholars.json)
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
- Ibn Taymiyya
- Mimar Sinan
- Mulla Sadra

### Greek Philosophers (greek_philosophers.json)
- Socrates
- Plato
- Aristotle
- Galen
- Ptolemy
- Euclid
- Archimedes
- Hippocrates
- Herodotus
- Pythagoras
- Plotinus

## Adding Multilingual Titles

### English Title (Required)
Always add in English:
```json
"title": { "en": "Ibn Sina: Master Physician" }
```

### Bengali Translation (Recommended)
```json
"title": { 
  "en": "Ibn Sina: Master Physician",
  "bn": "ইবনে সিনা: চিকিৎসক দর্শক"
}
```

### German Translation (Optional)
```json
"title": { 
  "en": "Ibn Sina: Master Physician",
  "bn": "ইবনে সিনা: চিকিৎসক দর্শক",
  "de": "Ibn Sina: Meisterphysiker"
}
```

## Tips for Adding Videos

1. **Verify Scholar Match**: Make sure the video content matches the scholar
2. **Check for Duplicates**: Don't add the same video twice
3. **Title Accuracy**: Use the exact video title from YouTube
4. **Video ID Format**: Should be 11 characters (e.g., `ViI5ZwC8cgM`)
5. **URL Format**: Always use full YouTube URL format
6. **Multiple Videos**: A scholar can have multiple videos in the array

## Troubleshooting

### Scholar Not Found
- Check spelling of scholar name
- Run: `python3 add_oases_videos.py --scholar "Unknown"` to see error message
- Try partial name (e.g., "Ibn" instead of "Ibn Sina")

### Video ID Invalid
- Verify the video ID is exactly 11 characters
- Test URL: `https://www.youtube.com/watch?v=YOUR_ID`
- Make sure URL works before adding

### File Not Found
- Make sure you're in the correct directory: `historical-maps/data/`
- Check the file path in the script

## Next Steps

1. Visit https://www.youtube.com/@OasesOfWisdom/videos
2. Browse for scholar videos
3. Copy video IDs
4. Use `add_oases_videos.py` or create a CSV and use `batch_add_videos.py`
5. Commit changes to git

## Support

For issues or questions:
1. Check that scholar names match database
2. Verify video IDs are correct
3. Ensure file paths are correct
4. Review JSON syntax if manually editing
