# [Keppler](https://brunosimon.github.io/keppler/)

> Real time code sharing for your lectures and presentations.

[Website](https://brunosimon.github.io/keppler/)

## What is keppler

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

Keppler should open in your default browser and start watching any changes you make on the files inside the folder.

#### 3 - Share the URL with your audience

Simply share the URL that should appear and your audience will have access to your code through Keppler.
By default, you must be on the same network.

## Configuration

You can add configuration arguments when calling Keppler.

```
keppler "My project" --debug 0 --port 1234 --exclude "node_modules/**" --open true --test true --initial-send true --max-file-size 99999
```

And you can use shortcuts for those arguments

```
keppler "My project" -d 0 -p 1234 -e "node_modules/**" -oti -m 99999
```

Arguments list

||Debug level|
|---|---|
|parameter|`--debug`|
|shortcut|`--d`|
|default value|*(number)*`1`|
|description|How much logs should be shown<br>`0`: almost no log<br>`1`: primary logs<br>`2`: too much logs|

|||
|---|---|
|parameter|`--name`|
|shortcut|`-n`|
|default value|*(string)* folder name|
|description|Project name<br>(you can simply add a string after `keppler` keyword like `keppler "My project"`)|

|||
|---|---|
|parameter|`--exclude`|
|shortcut|`-e`|
|default value|*(string)*`**/.DS_Store,node_modules/**,vendor/**,.git,.vscode,.env,.log`|
|description|List of paths to exclude (comma seperated and wildcards support)|

|||
|---|---|
|parameter|`--open`|
|shortcut|`-o`|
|default value|*(bool)*`true`|
|description|Open Keppler in default browser|

|||
|---|---|
|parameter|`--test`|
|shortcut|`-t`|
|default value|*(bool)*`false`|
|description|Start a test project with demo contents<br>:warning: Only for development purpose|

|||
|---|---|
|parameter|`--initial-send`|
|shortcut|`-i`|
|default value|*(bool)*`false`|
|description|Send current files in the folder<br>:warning: Too much files may cause issues|

|||
|---|---|
|parameter|`--max-file-size`|
|shortcut|`-m`|
|default value|*(number)*`99999`|
|description|Maximum file size in octets<br>(99999 ≈ 100ko)|

|||
|---|---|
|parameter|`--server`|
|shortcut|`-s`|
|default value|*(bool)*`false`|
|description|Start keppler server only<br>(if you want to run an online instance)|

|||
|---|---|
|parameter|`--host`|
|shortcut|`-h`|
|default value|*(string)*``|
|description|Server host<br>(if you want to connect to an online instance)|

|||
|---|---|
|parameter|`--port`|
|shortcut|`-p`|
|default value|*(number)*`1571`|
|description|Server port|

## Online instance

You can run Keppler online. Anybody would be able to connect to it and your audience won't need to be on the same network as you.

Keppler doesn't provide any host solution. You'll have to use your own server.

#### On the server

Install Node.js

Install keppler

```
npm install -g keppler
```

Start a keppler instance with the `--server` parameter

```
keppler --server
```

#### On you local machine

Start keppler with the `--host` parameter and server domain as the value

```
keppler "My awesome project" --host 12.34.56.78
```

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
- Online support

## Credits

##### Development

- Bruno Simon ([GitHub](https://github.com/brunosimon), [Twitter](https://twitter.com/bruno_simon/), [Site](https://bruno-simon.com))

##### UX / UI

- Tom Bonnike
- Thibaud Vaubourg
- Aymeric Sans
- Axel Chalon