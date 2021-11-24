# bev Contribution Guide
Welcome to *bev*'s guide to help those interested in contributing to this excellent open source product.

For fast navigation, use the table of contents icon <img src="./assets/images/table-of-contents.png" width="25" height="25" /> on the top-left corner of this document to get to a specific section of this guide more efficiently.

## Getting Started
Before outlining current issues and conceptualized new features for this product, I would like to provide a brief run-down of the features contained within this application.

### app/main/
Contains a few small files which leverage electron and others to interact directly with the user's native OS.

* `io.js` contains the logic which allows a user to select or remove folders, as well as the logic to analyze the dependencies of provided folder paths.
* `notification.js` houses minor logic to natively render notifications to the user's machine.

### render/assets/
Contains all assets displayed in the application.

### render/html/
This is the folder the application is built to...