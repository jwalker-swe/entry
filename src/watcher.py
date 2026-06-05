from pathlib import Path 
from dotenv import load_dotenv
import bz2
import os

load_dotenv()

demo_directory = Path(os.getenv("DEMO_DIRECTORY"))

def scan_directory(demo_directory):

    print(f'Scanning {demo_directory} for .dem.bz2 files\n')

    try:

        for file in demo_directory.glob("*.dem.bz2"):
            print(f'Decompressing {file} to .dem file...')
            compressed_file = file 
            decompressed_file = str(file).removesuffix(".bz2")

            with bz2.open(compressed_file, "rb") as file_in:
                file_content = file_in.read()

            with open(decompressed_file, 'wb') as file_out:
                file_out.write(file_content)

            print(f'{file} successfully decompressed to {decompressed_file}\n')

        print(f'All files decompressed successfully\n')
        
        for file in demo_directory.glob("*.dem.bz2"):
            if file.is_file():
                file.unlink()
                print(f'Deleted: {file}')

        for file in demo_directory.glob("*Zone*"):
            if file.is_file():
                file.unlink()
                print(f'Deleted Zone Identifier: {file}')

    except:

        print(f'Failed to scan {demo_directory}')



def get_path_to_demos(demo_directory):

    print(f'Fetching paths to demo files...\n')

    demo_paths = []

    try:

        for file in demo_directory.glob('*.dem'):
            demo_paths.append(str(file))

        print(f'Demos fetched: ')
        for demo in demo_paths:
            print(demo)

        print(f'\n')

        return demo_paths

    except:

        print('Failed to fetch paths')


        
#scan_directory(demo_directory)
#get_path_to_demos(demo_directory)

