from pathlib import Path 
import bz2
import os

demo_directory = os.getenv("DEMO_DIRECTORY")


def scan_directory(demo_directory):

    print(f'Scanning {demo_directory} for .dem.bz2 files')

    try:

        for file in demo_directory.glob("*.dem.bz2"):
            print(f'Decompressing {file} to .dem file...')
            compressed_file = file 
            decompressed_file = str(file).removesuffix(".bz2")

            with bz2.open(compressed_file, "rb") as file_in:
                file_content = file_in.read()

            with open(decompressed_file, 'wb') as file_out:
                file_out.write(file_content)

            print(f'{file} successfully decompressed to {decompressed_file}')

        print(f'All files decompressed successfully')
        
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

    print(f'Fetching paths to demo files...')

    demo_paths = []

    try:

        for file in demo_directory.glob('*.dem'):
            print(file)
            demo_paths.append(file)

        print(f'Demos fetched: {demo_paths}')

        return demo_paths

    except:

        print('Failed to fetch paths')


        
scan_directory(demo_directory)
get_path_to_demos(demo_directory)

