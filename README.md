
## Introducing bev

bev (Bird’s Eye View) is a microservice migration helper and a dependency manager. Developed under tech accelerator, OS Labs, bev is a multi-platform desktop application that allows you to analyze and visualize dependencies. bev alleviates the pain of migrating to microservices.

Download for MacOS, Windows and Linux.

### Getting Started With bev

We designed bev with simplicity in mind, so all you need to do is select the root directory of your microservice app and press “Analyze Dependencies.” We’ll take it from here! 

<picture here of landing page>
Click on the "Open Folders" button and select the folder(s) containing your project.
<picture of file sys dialogue>

## Features
#### Dependency Visualizer

bev parses through your project’s file structure to generate an interactive dependency graph. The dependency graph is a nice quick way to see how your dependencies *interflamingle*. The blue nodes represent local dependencies whereas the red nodes represent third-party dependencies. The tan nodes always represent the root directory.

<picture here of dep graph>

Click on any node to see which children components rely on it. QUAAAAAAAACK

<animated gif here of the dep graph animations>

#### Bundle Sizer

bev also finds and analyzes your bundle files. bev gives you a detailed breakdown of what’s being bundled.

<insert picture of visualizer and breakdown bar>

Select the version history of which bundle file to view to see how the bundle has changed since updating dependencies.

<insert picture of bundle version drop down>

## How to Contribute

If you would like to contribute, clone the repo.
 
```
 git clone https://github.com/oslabs-beta/bev.git
```
 
#### Features we’d like to implement

-   Change display for selected nodes
-   Ability to determine and display dependency errors
-   Right side drawer to display node details on click
-   Click on nodes to view component source code
-   Display and update Node version from the GUI
-   Display and update the module type from the GUI

## Built With
 - Electron
 - React
 - React Router
 - React Flow
 - React Testing Library
 - Dagre
 - Dependency Cruiser

## Contributors

Tu Pham | [Linkedin](https://www.linkedin.com/in/toopham/) | [Github](https://github.com/toopham)

Ryan Lee | [Linkedin](https://www.linkedin.com/in/ryan-lee-dev/) | [Github](https://github.com/savoy1211)

Michael Pay | [Linkedin](https://www.linkedin.com/in/michael-edward-pay/) | [Github](https://github.com/airpick)

Ian Tran | [Linkedin](https://www.linkedin.com/in/ictran/) | [Github](https://github.com/eienTran)

