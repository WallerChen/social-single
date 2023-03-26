
#!/usr/bin/env python3

import os
import sys
import platform


LESSC = "./node_modules/.bin/lessc"
system = platform.system()
if system == 'Windows':  # 奇葩windows
    LESSC = r"node_modules\.bin\lessc"


if __name__ == "__main__":
    exclude = set(['node_modules', 'miniprogram_npm'])

    for root, directories, files in os.walk("./"):
        directories[:] = [d for d in directories if d not in exclude]
        for filename in files:
            filepath = os.path.join(root, filename)
            if filename.endswith(".less"):
                print(f"LESS => WXSS: {filepath}")
                inFile = filepath
                outFile = filepath.replace(".less", ".wxss")
                os.system(f'{LESSC} {inFile} {outFile}')

    print("\ndone.")
