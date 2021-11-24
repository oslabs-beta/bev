
## Introducing bev

bev (Bird’s Eye View) is a microservice migration helper and a dependency manager. Developed under tech accelerator, OS Labs, bev is a multi-platform desktop application that allows you to analyze and visualize dependencies. bev alleviates the pain of migrating to microservices.

### Getting Started With bev

We designed bev with simplicity in mind, so all you need to do is select the root directory of your microservice app and press “Analyze Dependencies.” We’ll take it from here! 

Click on the "Open Folders" button and select the folder(s) containing your project.

![Click on the "Open Folders" button and select the folder(s) containing your project.](https://i.imgur.com/BP6liem.gif)

## Features
#### Dependency Visualizer

bev parses through your project’s file structure to generate an interactive dependency graph. The dependency graph is a nice quick way to see how your dependencies *interflamingle*. The blue nodes represent local dependencies whereas the red nodes represent third-party dependencies. The tan nodes always represent the root directory.

Click on any node to see which children components rely on it. 

![Dependency Graph](https://i.imgur.com/dmFFTVY.gif)

#### Bundle Sizer

bev also finds and analyzes your bundle files. bev gives you a detailed breakdown of what’s being bundled.

![enter image description here](https://i.imgur.com/UDXgfVC.png)

Select the version history of which bundle file to view to see how the bundle has changed since updating dependencies.

![enter image description here](https://i.imgur.com/jp8CSog.png)

## How to Contribute

If you would like to contribute, clone the repo.

```
git clone https://github.com/oslabs-beta/bev.git
```

### Build Steps
 
1. Install dependencies by using the following command:
  ```
  npm i
  ```
2. To bundle all the files together, use:
  ```
  npm run build
  ```
3. To run the development build, use:
  ```
  npm start
  ```
4. To build the Electron app, use:
  ```
  npm run pack
  ```
 
Electron-builder is configured to build for Mac, Windows and Linux. To configure which platform to build for, go into `package.json` and edit the scripts.
```
"scripts": {
  "start": "electron .",
  "build": "cross-env NODE_ENV=development webpack",
  "postinstall": "electron-builder install-app-deps",
  "pack": "electron-builder -mwl"
},
```
In the `pack` script, append `m`, `w`, or `l` after the `-` to specify which platforms to build for.
e.g.: To build for mac only, edit the pack script to:
```
"pack": "electron-builder -m"
```
 
#### Features we’d like to implement

Please see our `CONTRIBUTING.md` for a detailed list of current bugs and conceptualized new features to implement.

Of course, if you have a new feature which is not on this list, you are also welcome to submit and present it.

## Built With
 - Electron
 - React
 - React Router
 - React Testing Library
 - Dagre
 - Dependency Cruiser
 - Webpack CLI
 - React Flow
 - Jest

## Contributors

Tu Pham | [Linkedin](https://www.linkedin.com/in/toopham/) | [Github](https://github.com/toopham)

Ryan Lee | [Linkedin](https://www.linkedin.com/in/ryan-lee-dev/) | [Github](https://github.com/savoy1211)

Michael Pay | [Linkedin](https://www.linkedin.com/in/michael-edward-pay/) | [Github](https://github.com/airpick)

Ian Tran | [Linkedin](https://www.linkedin.com/in/ictran/) | [Github](https://github.com/eienTran)

