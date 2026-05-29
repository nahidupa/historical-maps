#!/usr/bin/env python3
"""
Helper script to add videos from Oases of Wisdom channel to scholars data
Usage: python3 add_oases_videos.py --scholar "Ibn Sina" --title "Ibn Sina Explained" --video_id "ViI5ZwC8cgM"
"""

import json
import argparse
import sys
from pathlib import Path

def find_scholar_by_name(scholars_data, name):
    """Find a scholar by name (case-insensitive)"""
    for scholar in scholars_data['scholars']:
        scholar_names = [
            scholar.get('name', {}).get('en', ''),
            scholar.get('name', {}).get('bn', ''),
        ]
        if any(name.lower() in sn.lower() or sn.lower() in name.lower() for sn in scholar_names if sn):
            return scholar
    return None

def add_video_to_scholar(scholars_data, scholar_name, video_title, video_id):
    """Add a video to a scholar's videos array"""
    scholar = find_scholar_by_name(scholars_data, scholar_name)
    
    if not scholar:
        print(f"❌ Scholar '{scholar_name}' not found in database")
        print("Available scholars:")
        for s in scholars_data['scholars'][:10]:
            print(f"  - {s.get('name', {}).get('en', 'Unknown')}")
        return False
    
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
            print(f"⚠️  Video already exists for {scholar.get('name', {}).get('en', 'Scholar')}")
            return False
    
    # Add video
    scholar['videos'].append(video_entry)
    print(f"✅ Added video to {scholar.get('name', {}).get('en', 'Scholar')}")
    print(f"   Title: {video_title}")
    print(f"   URL: {video_entry['url']}")
    
    return True

def main():
    parser = argparse.ArgumentParser(
        description='Add videos from Oases of Wisdom channel to scholars database'
    )
    parser.add_argument('--scholar', required=True, help='Scholar name (e.g., "Ibn Sina")')
    parser.add_argument('--title', required=True, help='Video title')
    parser.add_argument('--video_id', required=True, help='YouTube video ID (from watch?v=ID)')
    parser.add_argument('--file', default='scholars.json', help='Path to scholars.json file')
    parser.add_argument('--save', action='store_true', default=True, help='Save changes to file')
    
    args = parser.parse_args()
    
    # Read scholars data - check current directory first
    file_path = Path(args.file)
    if not file_path.exists() and Path('data') / args.file.replace('data/', ''):
        file_path = Path('data') / args.file.replace('data/', '')
    if not file_path.exists():
        print(f"❌ File not found: {args.file}")
        sys.exit(1)
    
    with open(file_path, 'r', encoding='utf-8') as f:
        scholars_data = json.load(f)
    
    # Add video
    success = add_video_to_scholar(
        scholars_data,
        args.scholar,
        args.title,
        args.video_id
    )
    
    if not success:
        sys.exit(1)
    
    # Save to file
    if args.save:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(scholars_data, f, ensure_ascii=False, indent=2)
        print(f"\n💾 Changes saved to {args.file}")
    else:
        print("\n⚠️  Changes NOT saved (use --save flag to save)")

if __name__ == '__main__':
    main()
