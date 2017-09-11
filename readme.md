# Keppler

Real time code sharing for your lectures and presentations.

## What is keppler

Keppler lets you share your code during a presentation.

Start keppler inside your project folder, share the URL with your audience and start coding.
Any time you save a file, viewers will receive those changes. They can browse through the files, go back in history, copy the code, download the project, preview images, chat with other viewers, ask the presenter to slow down, etc.

<img width="700" src="https://github.com/brunosimon/keppler/raw/master/resources/screenshots/screen-project-1.png" alt="Keppler screen">
<img width="700" src="https://github.com/brunosimon/keppler/raw/master/resources/screenshots/screen-project-2.png" alt="Keppler screen">
<img width="700" src="https://github.com/brunosimon/keppler/raw/master/resources/screenshots/screen-project-3.png" alt="Keppler screen">

## Instructions

#### 1 - Install Keppler globally

You must have [NodeJS](https://nodejs.org/en/) and [NPM](https://www.npmjs.org) already installed.
In your console, run:
<sup>(You may need to add `sudo` at start)</sup>

```
npm install -g keppler
```


#### 2 - Launch Keppler inside your project folder

In your console, navigate to your project folder.
Then launch Keppler with the name of your choice:

```
cd ./my-awesome-project
keppler "My awesome project"
```

Keppler should open in your default browser and start watching any changes you make on the folder.

#### 3 - Share the URL with your audience

You must be on the same network.
Simply share the URL that should appear with your audience and they will start receiving your changes.

## Configuration

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
|<span style="white-space:nowrap">`--debug`</span>|`-d`|*(number)*`1`|Debug level<br>`0`: almost no log<br>`1`: primary logs<br>`2`: too much logs|
|<span style="white-space:nowrap">`--name`</span>|`-n`|*(string)*`No name`|Project name<br>(you can simply add a string after `keppler` keyword like `keppler "My project"`)|
|<span style="white-space:nowrap">`--port`</span>|`-p`|*(number)*`1571`|Server port|
|<span style="white-space:nowrap">`--exclude`</span>|`-e`|*(string)*`**/.DS_Store,node_modules/**,vendor/**,.git`|Files to exclude|
|<span style="white-space:nowrap">`--open`</span>|`-o`|*(bool)*`true`|Open in default browser|
|<span style="white-space:nowrap">`--test`</span>|`-t`|*(bool)*`false`|Start a test project with testing contents|
|<span style="white-space:nowrap">`--initial-send`</span>|`-i`|*(bool)*`false`|Send current files in the folder at start|
|<span style="white-space:nowrap">`--max-file-size`</span>|`-m`|*(number)*`99999`|Maximum file size in octets|

## Features

- Work in any modern browser
- File tree
- Fuzzy search
- File history/versions
- File versions differences
- Easy copy to clipboard
- Accessible by anyone on the same network
- App like design
- Syntax coloring
- Multiple projects in one Keppler instance
- Chat with other viewers and associate specific files and lines with your messages
- Open in default browser
- Download file button
- Download project button
- Alert button
- Tooltips

## Credits

##### Development

- Bruno Simon ([GitHub](https://github.com/brunosimon), [Twitter](https://twitter.com/bruno_simon/), [Site](https://bruno-simon.com))

##### UX / UI

- Tom Bonnike
- Thibaud Vaubourg
- Aymeric Sans
- Axel Chalon