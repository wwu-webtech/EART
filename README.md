# Efficient Accessibility Review Tool
A web scraper designed to quickly display the semantic structure and content of a web page, to aid in accessibility audits. 


   - **Frontend:** Built with Astro, React, WWU's Ashlar, and TailwindCSS
   - **Backend:** Built with Flask and BeautifulSoup4
   - **Built and Distributed with Electron**

## Supported Platforms for Standalone Application
### **PLEASE NOTE THAT PLATFORMS OTHER THAN MACOS HAVE NOT BEEN TESTED!**
#### If your platform is unsupported you can still use the tool by [running it locally in your browser](https://github.com/wwu-webtech/EART#run-locally).

**Windows:**
   - x86-64

**Debian/Ubuntu Linux Distributions:**
   - Arm64
   - Amd64

**MacOS:**
   - Apple Silicon (Arm64)



## Installation
[Download the latest release for your platform](https://github.com/wwu-webtech/EART/releases)
- Run the installer
- Run the Eart-Desktop application
- All done!

## Run Locally

1. Clone the repo  
   `git clone https://github.com/wwu-webtech/EART.git`

2. Backend  
   ```bash
   cd EART/backend
   python3 -m venv .venv
   source .venv/bin/activate        # or `.venv\Scripts\Activate.ps1` on Windows
   pip install -r requirements.txt
3. Frontend
   ```bash
   cd EART/frontend
   npm install
   npm run dev
   ```

## Build custom executable for your platform (Only recommended for advanced users)
1. Clone the electron branch repo
   `git clone -b electron https://github.com/wwu-webtech/EART.git`
2. Download and run pyinstaller (omit first line if a python virtual environment is not needed for pip)

   This will create a binary of the python app for your electron builder to link to pyinstaller can only make a binary relevant to the platform and architecture you're running you can use docker files, wine, etc. if for some reason you're building for a platform other than what you're using

   ```bash
   source <your-path-to-virtual-environment>/.venv/bin/activate # or `.venv\Scripts\Activate.ps1` on Windows
   pip install pyinstaller
   pip install -r requirements.txt
   pyinstaller --name EartFlaskBackend --onefile --windowed main.py
   # I recommend appending your platform name onto the end of "EartFlaskBackend"
   ```
4. Navigate to the root folder, locate package.json. /EART/package.json
5. Add a script for your platform ie.
```
   "scripts": {
    ...
    "prepare:backend:yourplatform:yourarchitecture": "mkdir -p backend/dist && rm -f backend/dist/EartFlaskBackend && cp backend/dist/EartFlaskBackend(whatever you named it) backend/dist/EartFlaskBackend",
    "build:yourplatform:yourarchitecture": "npm run build:frontend && npm run prepare:backend:yourplatforms:yourarchitecture && electron-builder --yourplatform --yourarchitecture",
    ...
  }
```
6. Install node_modules required to build project
from EART/
```bash
cd frontend
npm install
cd ..
npm install
npm run build:yourplatform:yourarchitecture
```
7. This should generate a binary, a setup executable, in EART/dist

## Features
- Visualize the semantic structure of a page
- Automatically flag basic issues with heading structure
- Quickly browse the parent HTML of all heading elements on a page
- Quickly identify which images on a page are missing alt text
- Sort images by the length of alt text to identify which images may need to have improved alt text
- Browse a gallery of the videos on the page and their page title to ensure it's included and accurate 


