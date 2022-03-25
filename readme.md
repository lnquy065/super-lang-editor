# SuperLangEditor (SLE)
CLI editor using for edit multi language files. Start SuperLangEditor at the root folder in your project, it will scans all of language files. Now you can modify those files by features below.

 - Auto scan language files (ISO6391 standard or JSON extension)(v1.4.1).
 - Supports edit, remove, add new language key with autocomplete hint.
 - Show change logs after modified.
 - Supports Nesting and Inline format (v1.1.6)
 - Sort by key name (v1.2.0)
 - Rename/Move key (v1.3.0)
 - Search by key name (v1.4.2)
 - Naming convention converter (v1.4.0)
 
 ##### Features
 - Search by key 
 - Edit values 
 - Rename/move key 
 - Remove key 
 - Add new key/values 
 - Sort by key 
 - Key naming convention converter 

### Screenshoot

```
  ____                                  _                             
 / ___|   _   _   _ __     ___   _ __  | |       __ _   _ __     __ _ 
 \___ \  | | | | | '_ \   / _ \ | '__| | |      / _` | | '_ \   / _` |
  ___) | | |_| | | |_) | |  __/ | |    | |___  | (_| | | | | | | (_| |
 |____/   \__,_| | .__/   \___| |_|    |_____|  \__,_| |_| |_|  \__, |
                 |_|                                            |___/ 
  Version: 1.5.0 by lnquy065
  JSON Format: nesting
======================================================================
? Select action:  (Use arrow keys)
❯ [🔍] Search by key 
  [➕] Add new key/values 
  [🔧] Edit values 
  [🔨] Rename/move key 
  [💥] Remove key 
  [🔃] Sort by key 
  [🔠] Key naming convention converter 
(Move up and down to reveal more choices)
```
 
### Installation
> npm install super-lang-editor -g

### Usage
At the root folder of your project. Start it from terminal
> super-lang

- At start screen, please choose i18next format that you are using first.

```$xslt
? Select JSON format:  (Use arrow keys)
❯ Nesting (The parent key and the child key are nested) 
  Inline (The parent key and the child key are separated by a ".") 
```

Nesting format
```$xslt
{
    "home": {
        "hello": "Hello",
        "world": "World"
        }
}
```

Inline format
```$xslt
{
    "home.hello": "Hello",
    "home.world": "World"
}
```


- SuperLang will scans all language files. Please choose files that you want to modify.

```
  ? Select language files:  (Press <space> to select, <a> to toggle all, <i> to invert selection)
  ❯◉ dist/locales/en.json - (English)
   ◉ dist/locales/vi.json - (Vietnamese)
   ◉ public/locales/en.json - (English)
   ◉ public/locales/vi.json - (Vietnamese)
```


- Now we can select action

```$xslt
? Select action:  (Use arrow keys)
❯ [🔍] Search by key 
  [➕] Add new key/values 
  [🔧] Edit values 
  [🔨] Rename/move key 
  [💥] Remove key 
  [🔃] Sort by key 
  [🔠] Key naming convention converter 
(Move up and down to reveal more choices)
```
### Features
#### [🔍] Search by key 
![Alt text](readme/search.gif?raw=true "Search")

Support search by language key name. All nested object will be flatted to one level, it will be combined by dot.
Let's search "newsTitle" that was nested in "pages":
```
? Select action:  Search by key
? Select language key name to view values: newsTitle
❯ pages.newsTitle
```
```
? Select action:  Search by key
? Select language key name to view values: pages.newsTitle
[English - en.json] pages.newsTitle: News
[Vietnamese - vi.json] pages.newsTitle: Tin tuc
? Enter to back!: 
```
Or search with multiple keyword
```
? Select action:  Search by key
? Select language key name to view values:  page setting title
❯ page.setting.account.title 
  page.setting.password.title 
  page.setting.information.title 
```
#### [🔧] Edit values 
![Alt text](readme/edit.gif?raw=true "Edit")

Now we will edit "pages.homeTitle" to:
```
en.json
pages: {
    homeTitle: "Home Page"
}
vi.json
pages: {
    homeTitle: "Trang chu moi"
}
```
- Input language key name need to edit value. All key name will be listed below for, select key need to edit
```
? Select action:  Edit values [Press 'ESC' to back to main menu]
? Input language key name to edit: pages.home
❯ pages.homeTitle
```
- After input key name, SLE will shows questions for input new value for each languages file with default value.
```
? Select action:  Edit
? Input language key name to edit: pages.homeTitle
? [English - en.json] pages.homeTitle: Home page
? [Vietnamese - vi.json] pages.homeTitle: Trang chu moi
```
#### [➕] Add new key/values 
![Alt text](readme/add.gif?raw=true "Add")
We will add new object to "pageComponents" for all language files:
- Before
```
"pageComponents": {
    "news": "news",
    "home": {
        "title": "Home Page"
    }
}
```
- After
```
"pageComponents": {
    "news": "news",
    "home": {
        "title": "Home Page"
    },
    "about": {
        "title": "About
    }
}
```
#### [💥] Remove key
You can use this feature for remove value of a key or remove an object.
- Input name of key that you want to remove:
```
? Select action:  Remove key [Press 'ESC' to back to main menu]
? Input language key name to remove: 
❯ pageComponents.news
  pageComponents.home.title
  pageComponents.about.title
```
Note: If you input "pageComponents.about.title", nested key is "title" will be remove. But if you input "pageComponents.about", "pageComponents.about" object will flies away.
```
- When remove "pageComponents.about.title"
en.json
{
    "pageComponents": {
        "news": "news",
        "home": {
            "title": "Home Page"
        },
        "about": {}
    }
}

- When remove "pageComponents.about"
en.json
{
    "pageComponents": {
        "news": "news",
        "home": {
            "title": "Home Page"
        }
    }
}
```
#### [🔨] Rename/move key
##### Rename
![Alt text](readme/rename.gif?raw=true "Rename")
We will rename "page" to "pageComponents", "pageComponents.newsTitle" to "pageComponents.news"
- Before
```
    page: {
        newsTitle: "News",
        homeTitle: "Home title"
    }
```
- After
```
 pageComponents: {
        news: "News",
        homeTitle: "Home title"
    }
```
##### Move
![Alt text](readme/move.gif?raw=true "move")
Now, we will move "buttons" into "pageComponents"
- Before
```
{
    buttons: {
        okLabel: "Ok",
        cancelLabel: "Cancel"
    },
    pageComponents: {
          news: "News",
          homeTitle: "Home title"
    }
}
```
- After
```
{
    pageComponents: {
          news: "News",
          homeTitle: "Home title",
         buttons: {
                okLabel: "Ok",
                cancelLabel: "Cancel"
            }
    }
}
```
- Or we can separate object like this
![Alt text](readme/moveToNested.gif?raw=true "moveToNested")
#### [🔃] Sort by key
![Alt text](readme/sort.gif?raw=true "sort")
- All language files will be sorted by key name (A-Z | Z-A)
#### [🔠] Key naming convention converter 
![Alt text](readme/convertKey.gif?raw=true "convertKey")

SLE support 3 of naming conventions
```
? Convert all language key name to: (Use arrow keys)
❯ Camel case 
  Kebab case 
  Snake case 
```

```
- Camel case
{
  "profile": {
    "home": {
      "hello": "Say hello",
      "myWorld": "World"
    },
    "myName": "My Name"
  }
}
- Kebab case
{
  "profile": {
    "home": {
      "hello": "Say hello",
      "my-world": "World"
    },
    "my-name": "My Name"
  }
}
- Snake case
{
  "profile": {
    "home": {
      "hello": "Say hello",
      "my_world": "World"
    },
    "my_name": "My Name"
  }
}
```
#### Show change logs
- Change logs table will shows up after language files were modified. From this table, you can double click into language key to select and copy new language key, then you paste into your code.

```
Change logs: 
╔════════╤═════════════╤════════════════╤════════════════╗
║ Action │ Lang Key    │ assets/en.json │ assets/vi.json ║
╟────────┼─────────────┼────────────────┼────────────────╢
║ Edit   │ home.hello  │ Say hello      │ Say hello      ║
╟────────┼─────────────┼────────────────┼────────────────╢
║ Add    │ home.myName │ My Name        │ My Name        ║
╟────────┼─────────────┼────────────────┼────────────────╢
║ Remove │ home.myName │                │                ║
╟────────┼─────────────┼────────────────┼────────────────╢
║ Add    │ home.myName │ My Name        │ My Name        ║
╟────────┼─────────────┼────────────────┼────────────────╢
║ Rename │ home.myName │ profile.myName │ profile.myName ║
╟────────┼─────────────┼────────────────┼────────────────╢
║ Rename │ home.world  │ home.myWorld   │ home.myWorld   ║
╟────────┼─────────────┼────────────────┼────────────────╢
║ Rename │ home        │ profile.home   │ profile.home   ║
╟────────┼─────────────┼────────────────┼────────────────╢
║ Sort   │ A-Z         │ Sorted         │ Sorted         ║
╟────────┼─────────────┼────────────────┼────────────────╢
║ Sort   │ Z-A         │ Sorted         │ Sorted         ║
╚════════╧═════════════╧════════════════╧════════════════╝
```
### Version change logs
##### 1.4.2:
+ Improve search feature, allow multiple keywords.
+ Change input to select for edit values feature.
##### 1.5.0:
+ Now you can cancel any action by use 'ESC' key or 'back' option.
+ Add icons.
