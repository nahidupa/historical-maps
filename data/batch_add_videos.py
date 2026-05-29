#!/usr/bin/env python3
"""
Batch add videos from a CSV file
Format: scholar_name, video_title, video_id
"""

import json
import csv
import sys
from pathlib import Path

def add_video_to_scholar(scholars_data, scholar_name, video_title, video_id):
    """Add a video to a scholar's videos array"""
    # Find scholar by name (case-insensitive)
    scholar = None
    for s in scholars_data['scholars']:
        scholar_names = [
            s.get('name', {}).get('en', ''),
            s.get('name', {}).get('bn', ''),
        ]
        if any(scholar_name.lower() in sn.lower() or sn.lower() in scholar_name.lower() 
               for sn in scholar_names if sn):
            scholar = s
            break
    
    if not scholar:
        return False, f"Scholar '{scholar_name}' not found"
    
    # Initialize videos array if it doesn't exist
    if 'videos' not in scholar:
        scholar['videos'] = []
    
    # Create video entry
    video_entry = {
        "title": {
            "en": video_title,
            "bn": video_title  # TODO: Add Bengali translation
        },
        "url": f"https://www.youtube.com/watch?v={video_id}"
    }
    
    # Check if video already exists
    for existing_video in scholar.get('videos', []):
        if existing_video.get('url') == video_entry['url']:
            return False, f"Video already exists for {scholar.get('name', {}).get('en', 'Scholar')}"
    
    # Add video
    scholar['videos'].append(video_entry)
    return True, f"Added video to {scholar.get('name', {}).get('en', 'Scholar')}"

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 batch_add_videos.py <csv_file> [output_file]")
        print("\nCSV Format:")
        print("scholar_name, video_title, video_id")
        print("\nExample:")
        print("Ibn Sina, Ibn Sina Biography, ViI5ZwC8cgM")
        print("Al-Ghazali, Imam Al-Ghazali, Dlf_tIfQmKM")
        sys.exit(1)
    
    csv_file = sys.argv[1]
    # Default to scholars.json in current directory or data/ subdirectory
    if len(sys.argv) > 2:
        output_file = sys.argv[2]
    else:
        output_file = 'scholars.json' if Path('scholars.json').exists() else 'data/scholars.json'
    
    # Read CSV
    videos_to_add = []
    try:
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            next(reader)  # Skip header
            for row in reader:
                if len(row) >= 3:
                    videos_to_add.append({
                        'scholar': row[0].strip(),
                        'title': row[1].strip(),
                        'video_id': row[2].strip()
                    })
    except Exception as e:
        print(f"❌ Error reading CSV: {e}")
        sys.exit(1)
    
    # Read scholars data
    file_path = Path(output_file)
    if not file_path.exists():
        print(f"❌ File not found: {output_file}")
        sys.exit(1)
    
    with open(file_path, 'r', encoding='utf-8') as f:
        scholars_data = json.load(f)
    
    # Add all videos
    added = 0
    failed = 0
    for item in videos_to_add:
        success, message = add_video_to_scholar(
            scholars_data,
            item['scholar'],
            item['title'],
            item['video_id']
        )
        if success:
            print(f"✅ {message}")
            added += 1
        else:
            print(f"❌ {message}")
            failed += 1
    
    # Save to file
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(scholars_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n📊 Summary:")
    print(f"✅ Added: {added}")
    print(f"❌ Failed: {failed}")
    print(f"💾 Saved to: {output_file}")

if __name__ == '__main__':
    main()
