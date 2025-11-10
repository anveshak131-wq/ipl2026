from moviepy.editor import TextClip, concatenate_videoclips, ColorClip, CompositeVideoClip, ImageClip
import os
import re

def create_video_from_script(script_path, output_path="ipl_cricket_hub_video.mp4"):
    # Read the script
    with open(script_path, 'r') as f:
        content = f.read()

    # Parse the script into sections
    sections = []
    lines = content.split('\n')
    current_section = None
    current_duration = 5  # default
    current_text = []

    for line in lines:
        line = line.strip()
        if line.startswith('[') and line.endswith(']'):
            if current_section:
                sections.append((current_section, '\n'.join(current_text), current_duration))
            # Parse title and duration
            match = re.match(r'\[(.+?) - (\d+) seconds\]', line)
            if match:
                current_section = match.group(1)
                current_duration = int(match.group(2))
            else:
                current_section = line[1:-1]
                current_duration = 5
            current_text = []
        elif line and not line.startswith('Title:'):
            current_text.append(line)

    if current_section:
        sections.append((current_section, '\n'.join(current_text), current_duration))

    # Define team mappings for logos
    team_logos = {
        'csk': 'assets/csk_logo_new.svg',
        'mi': 'assets/mi_logo_new.svg',
        'rcb': 'assets/rcb_logo_new.svg',
        'kkr': 'assets/kkr_logo_new.svg',
        'srh': 'assets/srh_logo_new.svg',
        'dc': 'assets/dc_logo_new.svg',
        'rr': 'assets/rr_logo_new.svg',
        'kxip': 'assets/kxip_logo_new.svg',
        'lsg': 'assets/lsg_logo_new.svg',
        'gt': 'assets/gt_logo_new.svg'
    }

    # Define section-specific backgrounds (HTML files can't be used directly)
    # For now, using cricket background for all sections
    # To use webpage backgrounds, need actual screenshot images
    section_backgrounds = {}

    # Create video clips
    clips = []
    for title, text, duration in sections:
        # Determine background
        if title in section_backgrounds and os.path.exists(section_backgrounds[title]):
            bg_clip = ImageClip(section_backgrounds[title]).set_duration(duration).resize(height=1080).crop(x1=0, y1=0, x2=1920, y2=1080)
        else:
            bg_clip = ImageClip('assets/cricket_background.jpg').set_duration(duration)

        # Create title text clip
        title_clip = TextClip(title, fontsize=70, color='white', font='Arial-Bold').set_position(('center', 100)).set_duration(duration)

        # Create content text clip
        text_clip = TextClip(text, fontsize=40, color='white', font='Arial').set_position('center').set_duration(duration)

        # Check for team mentions and add logos (SVG support limited, skipping for now)
        composite_clips = [bg_clip, title_clip, text_clip]
        # Note: SVG logos require additional dependencies for MoviePy
        # For now, logos are disabled to ensure video generation works

        # Composite the clips
        video_clip = CompositeVideoClip(composite_clips)

        clips.append(video_clip)

    # Concatenate all clips
    final_clip = concatenate_videoclips(clips, method="compose")

    # Write the video file
    final_clip.write_videofile(output_path, fps=24, codec="libx264")

    return output_path

if __name__ == "__main__":
    script_path = "/Users/anvesh/Downloads/ipl2020/video_script.txt"  # Adjust path as needed
    output_path = "ipl_cricket_hub_video.mp4"
    create_video_from_script(script_path, output_path)
    print(f"Video created: {output_path}")
