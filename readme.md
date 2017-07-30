# Keppler

An efficient way to share your code while presenting

## What is keppler

Keppler lets you share your code during a presentation.

Start keppler inside your project folder, share the URL with the viewers and start coding. When you save or change any file, viewers receive them, can browse through the files tree and discover changes you've made.

Keppler is easy to install and works with NodeJS.

<img width="600" height="374" src="https://github.com/brunosimon/keppler/raw/master/resources/screenshots/screen-project-2.png" alt="Keppler screen">

## Instructions

#### Requirements

* [NodeJS](https://nodejs.org/en/) installed
* Keppler installed globally
* Viewers connected to the same network

#### Install Keppler globally

```
npm install -g keppler
```

#### Start Keppler inside the project folder

```
cd ./my-awesome-project
keppler "My awesome project"
```

Share the URL that should appear with the viewers.

#### config

You can add configuration argument when calling Keppler.

```
keppler "My project" --debug 0 --port 1234 --exclude "node_modules/**" --open true --test true --initial-send true --max-file-size 99999
```

or with shortcuts

```
keppler "My project" -d 0 -p 1234 -e "node_modules/**" -oti -m 99999
```

Arguments list

|name|shortcut|default value|description|
|---|---|---|---|
|<span style="white-space:nowrap">`--debug`</span>|`-d`|*(number)*`1`|Debug level (`0`: almost no log, `1`: some logs, `2`: many logs)|
|<span style="white-space:nowrap">`--name`</span>|`-n`|*(string)*`No name`|Project name (you can simply add a string after `keppler` keyword like `keppler "My project"`)|
|<span style="white-space:nowrap">`--port`</span>|`-p`|*(number)*`1571`|Server port|
|<span style="white-space:nowrap">`--exclude`</span>|`-e`|*(string)*`**/.DS_Store,node_modules/**,vendor/**,.git`|Files to exclude|
|<span style="white-space:nowrap">`--open`</span>|`-o`|*(bool)*`true`|Open in default browser|
|<span style="white-space:nowrap">`--test`</span>|`-t`|*(bool)*`false`|Start a test project|
|<span style="white-space:nowrap">`--initial-send`</span>|`-i`|*(bool)*`false`|Send files in folder at start|
|<span style="white-space:nowrap">`--max-file-size`</span>|`-i`|*(number)*`99999`|Maximum file size in octets|

## Features

- Work in any modern browser
- Files tree
- File history/versions
- File versions differences
- Easy copy
- Accessible by anyone on the same network
- App like design
- Syntax coloring
- Multiple projects in one Keppler instance

## Futur features

- Chat with possibility to associate messages with lines and files
- Log project URL and open in default browser
- Download file button
- Download project button
- Keyboard navigation
- In app notifications
- Browser notifications
- Toggle folder
- Retractable sidebar
- File searching/filtering
- Tooltips
- Tablet compatible
- Vue.js
- Font-size control
