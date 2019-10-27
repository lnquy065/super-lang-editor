# SuperLangEditor (SLE)
CLI editor using for edit multi language files. Start SuperLangEditor at every where in your project, it will scans all of language files. Now you can modify those files by features below.

 - Auto scan language file (ISO6391 standard and JSON extension: _**en.json, vi.json**_).
 - Supports edit, remove, add new language key with autocomplete hint.
 - Show change logs after modified.
 - Supports Nesting and Inline i18next format (v1.1.6)
 - Sort by key name (v1.2.0)
 - Rename/Move key (v1.3.0)
 
### Installation
> npm install super-lang-editor -g

### Usage
Start it from terminal
> super-lang

- At start screen, please choose i18next format that you are using first.

```$xslt
  ____                                  _                             
 / ___|   _   _   _ __     ___   _ __  | |       __ _   _ __     __ _ 
 \___ \  | | | | | '_ \   / _ \ | '__| | |      / _` | | '_ \   / _` |
  ___) | | |_| | | |_) | |  __/ | |    | |___  | (_| | | | | | | (_| |
 |____/   \__,_| | .__/   \___| |_|    |_____|  \__,_| |_| |_|  \__, |
                 |_|                                            |___/ 
  Version: 1.1.0 by lnquy065
======================================================================
? Choose JSON format:  (Use arrow keys)
❯ Nesting 
  Inline
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


- Default language. Select default language, SuperLang will base on it to suggests language key name for next steps.

```$xslt
? Select language files:  en, vi
? Select default language:  (Use arrow keys)
❯ public/locales/en.json - (English) 
  public/locales/vi.json - (Vietnamese) 
```

- Select action

```$xslt
? Select action:  (Use arrow keys)
❯ Edit 
  Rename/Move 
  Remove 
  Add New 
  Sort 
  Exit 
```
### Features
In this section we will using language files below for example. Assuming that we already have two language files in our project.
```
en.json
{
    "home": {
        "hello": "Hello",
        "world": "World"
        }
}

vi.json
{
  "home": {
    "hello": "Xin chào",
    "world": "Thế giới"
  }
}
```
#### Start
- Start SLE from terminal. At start screen we select "Nesting"
```
? Select JSON format:  (Use arrow keys)
❯ Nesting 
  Inline 
```
- Select all language files
```
? Select JSON format:  Nesting
? Select language files:  (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◉ assets/en.json - (English)
 ◉ assets/vi.json - (Vietnamese)
```
- Select 'English' file for default
```
? Select JSON format:  Nesting
? Select language files:  en, vi
? Select default language:  (Use arrow keys)
❯ assets/en.json - (English) 
  assets/vi.json - (Vietnamese) 
```
- Now we can modify those files
```
? Select action:  (Use arrow keys)
❯ Edit 
  Rename/Move 
  Remove 
  Add New 
  Sort 
  Exit 
```
#### Edit
Now we will edit "home.hello": "Hello" to "Say hello" in both of language.
- Input language key name need to edit value. All key name will be listed below for, you can use 'Tab' key to autocomplete.
```
? Select action:  Edit
? Input language key name to edit: home.hello
❯ home.hello 
  home.world 
```
- After input key name, SLE will shows questions for input new value for each languages file with default value.
```
? Select action:  Edit
? Input language key name to edit: home.hello
? [English - assets/en.json] home.hello: Say hello
? [Vietnamese - assets/vi.json] home.hello: Say hello
```
- Now, "home.hello" has been changed to "Say hello" in both of language files.
#### Add New
We will add new language key with name is "myName" that be nested in "home". Value's both of files is "My name".
- Input new language key. Note that all nested key will be showed by "dot".
```
? Select action:  Add New
? Input language key name to add: home.myName
```
- As the same with edit. We will input new value for each language file.
```
? Select action:  Add New
? Input language key name to add: home.myName
? [English - assets/en.json] home.myName: My Name
? [Vietnamese - assets/vi.json] home.myName: My Name
```
- Now, new nested key will be added to all files.
```
en.json
{
  "home": {
    "hello": "Say hello",
    "world": "World",
    "myName": "My Name"
  }
}
```
#### Remove
You can use this feature for remove value of a key or remove an object.
- Input name of key that you want to remove:
```
? Select action:  Remove
? Input language key name to remove: 
❯ home.hello 
  home.world 
  home.myName 
```
Note: If you input "home.hello", nested key is hello will be remove. But if you input "home", "home" object will flies away.
```
- When remove "home.hello"
en.json
{
  "home": {
    "world": "World",
    "myName": "My Name"
  }
}

- When remove "home"
en.json
{

}
```
- Now we input "home.hello", it will be removed in all files.
#### Rename/Move
##### Rename
Now we will rename "home.world" to "home.myWorld"
- Input language key name:
```
? Select action:  Rename/Move
? Input language key name to rename: home.world
  home.hello 
❯ home.world
```
- Input new key name
```
? Select action:  Rename/Move
? Input language key name to rename: home.world
? Input new language key name:  home.myWorld
```
##### Move
In this step, we will move "home.myName" to "profile.myName". Result will be:
Note: "profile" will be created if not exists.
```
Before move
{
  "home": {
    "hello": "Say hello",
    "world": "World",
    "myName": "My Name"
  }
}

Result
{
  "home": {
    "hello": "Say hello",
    "world": "World"
  },
  "profile: {
    "myName": "My Name"
  }
}
```
- Input key name that want to move:
```
? Select action:  Rename/Move
? Input language key name to rename/move: home.myName
❯ home.myName 
```
- Input new key name
```
? Select action:  Rename/Move
? Input language key name to rename/move: home.myName
? Input new language key name:  profile.myName
```
Note: You can move an object with this feature. Now try to move "home" to inside "profile".
```
? Select action:  Rename/Move
? Input language key name to rename/move: home
? Input new language key name:  profile.home
```
And result...
```
{
  "profile": {
    "myName": "My Name",
    "home": {
      "hello": "Say hello",
      "myWorld": "World"
    }
  }
}
```
##### Sort by key name
- All language files will be sorted by key name (A-Z | Z-A)
```
? Select action:  Sort
? Sort all language keys: (Use arrow keys)
❯ A-Z 
  Z-A 
```
- With A-Z
```
{
  "profile": {
    "home": {
      "hello": "Say hello",
      "myWorld": "World"
    },
    "myName": "My Name"
  }
}
```

- With Z-A
```
{
  "profile": {
    "myName": "My Name",
    "home": {
      "myWorld": "World",
      "hello": "Say hello"
    }
  }
}
```
#### Show change logs
- Change logs table will shows up after language files were modified.

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