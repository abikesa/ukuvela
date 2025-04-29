from youtube_comment_downloader import YoutubeCommentDownloader

# Initialize the downloader
downloader = YoutubeCommentDownloader()

# Replace with your YouTube video ID
video_id = 'BooPVxoRmEY'

try:
    # Get comments from the video
    comments = downloader.get_comments_from_url(f'https://www.youtube.com/watch?v={video_id}')

    # Print comments
    print("Comments from the video:")
    for comment in comments:
        print(comment.get('text', 'No text available'))  # Use .get() to handle missing keys gracefully

except Exception as e:
    print(f"An error occurred: {e}")
# flick 20250409213602-38sE
# flick 20250409214208-C7M1
# flick 20250409214624-mCmP
# flick 20250409230606-pwJv
# flick 20250410002733-u0l0
