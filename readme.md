# SuperLangEditor
CLI editor using for edit language files.
 - Auto scan language file (ISO6391 standard and JSON extension: _**en.json, vi.json**_).
 - Supports edit, remove, add new language key with autocomplete hint.
 - Show change logs after modified.
 - Supports Nesting and Inline i18next format (v1.1.6)
 - Sort by key name (v1.2.0)
#### Installation
> npm install super-lang-editor -g

#### Usage
Start it from terminal
> super-lang

- At start screen, Please choose i18next format first.

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

```   ____                                  _                             
   / ___|   _   _   _ __     ___   _ __  | |       __ _   _ __     __ _ 
   \___ \  | | | | | '_ \   / _ \ | '__| | |      / _` | | '_ \   / _` |
    ___) | | |_| | | |_) | |  __/ | |    | |___  | (_| | | | | | | (_| |
   |____/   \__,_| | .__/   \___| |_|    |_____|  \__,_| |_| |_|  \__, |
                   |_|                                            |___/ 
    Version: 1.0.1 by lnquy065
  ======================================================================
  ? Select language files:  (Press <space> to select, <a> to toggle all, <i> to invert selection)
  ❯◉ dist/locales/en.json - (English)
   ◉ dist/locales/vi.json - (Vietnamese)
   ◉ public/locales/en.json - (English)
   ◉ public/locales/vi.json - (Vietnamese)
```


- Default language. Select default language, SuperLang will base on it to suggests language key name for next steps.

```$xslt
  ____                                  _                             
 / ___|   _   _   _ __     ___   _ __  | |       __ _   _ __     __ _ 
 \___ \  | | | | | '_ \   / _ \ | '__| | |      / _` | | '_ \   / _` |
  ___) | | |_| | | |_) | |  __/ | |    | |___  | (_| | | | | | | (_| |
 |____/   \__,_| | .__/   \___| |_|    |_____|  \__,_| |_| |_|  \__, |
                 |_|                                            |___/ 
  Version: 1.0.1 by lnquy065
======================================================================
? Select language files:  en, vi
? Select default language:  (Use arrow keys)
❯ public/locales/en.json - (English) 
  public/locales/vi.json - (Vietnamese) 
```

- Select actions

```$xslt
  ____                                  _                             
 / ___|   _   _   _ __     ___   _ __  | |       __ _   _ __     __ _ 
 \___ \  | | | | | '_ \   / _ \ | '__| | |      / _` | | '_ \   / _` |
  ___) | | |_| | | |_) | |  __/ | |    | |___  | (_| | | | | | | (_| |
 |____/   \__,_| | .__/   \___| |_|    |_____|  \__,_| |_| |_|  \__, |
                 |_|                                            |___/ 
  Version: 1.0.1 by lnquy065
======================================================================
? Choose action:  (Use arrow keys)
❯ Edit 
  Remove 
  Add New 
  Sort
  Exit 
```
#### Features
##### Edit, Add New, Remove
- Key name will be suggested below when you edit,add,remove.

```$xslt
  ____                                  _                             
 / ___|   _   _   _ __     ___   _ __  | |       __ _   _ __     __ _ 
 \___ \  | | | | | '_ \   / _ \ | '__| | |      / _` | | '_ \   / _` |
  ___) | | |_| | | |_) | |  __/ | |    | |___  | (_| | | | | | | (_| |
 |____/   \__,_| | .__/   \___| |_|    |_____|  \__,_| |_| |_|  \__, |
                 |_|                                            |___/ 
  Version: 1.0.1 by lnquy065
======================================================================
? Choose action:  Edit
? Input key name to edit: hom
  page.404.backHome 
❯ title.[/home] 
  component.navigation.home 
  page.setting.plans.step3.btn.backHome 
  page.home.welcome 
  page.home.card.onlineShop.title 
  page.home.card.mobileApps.title 
(Move up and down to reveal more choices)
```
```
  ____                                  _                             
 / ___|   _   _   _ __     ___   _ __  | |       __ _   _ __     __ _ 
 \___ \  | | | | | '_ \   / _ \ | '__| | |      / _` | | '_ \   / _` |
  ___) | | |_| | | |_) | |  __/ | |    | |___  | (_| | | | | | | (_| |
 |____/   \__,_| | .__/   \___| |_|    |_____|  \__,_| |_| |_|  \__, |
                 |_|                                            |___/ 
  Version: 1.0.1 by lnquy065
======================================================================
? Choose action:  Edit
? Input key name to edit: title.[/home]
? [English - public/locales/en.json] title.[/home]: Home
? [Vietnamese - public/locales/vi.json] title.[/home]: Tra
```
##### Sort by key name
- All language files will be sorted by key name (A-Z | Z-A)
```
  ____                                  _                             
 / ___|   _   _   _ __     ___   _ __  | |       __ _   _ __     __ _ 
 \___ \  | | | | | '_ \   / _ \ | '__| | |      / _` | | '_ \   / _` |
  ___) | | |_| | | |_) | |  __/ | |    | |___  | (_| | | | | | | (_| |
 |____/   \__,_| | .__/   \___| |_|    |_____|  \__,_| |_| |_|  \__, |
                 |_|                                            |___/ 
  Version: 1.2.0 by lnquy065
  JSON Format: nesting
  Language list: 
    - [assets/en.json]
======================================================================
? Select action:  Sort
? Sort all language keys: (Use arrow keys)
❯ A-Z 
  Z-A 
```
##### Show change logs
- Change logs table will shows up after language files were modified.

```$xslt
  ____                                  _                             
 / ___|   _   _   _ __     ___   _ __  | |       __ _   _ __     __ _ 
 \___ \  | | | | | '_ \   / _ \ | '__| | |      / _` | | '_ \   / _` |
  ___) | | |_| | | |_) | |  __/ | |    | |___  | (_| | | | | | | (_| |
 |____/   \__,_| | .__/   \___| |_|    |_____|  \__,_| |_| |_|  \__, |
                 |_|                                            |___/ 
  Version: 1.0.1 by lnquy065
======================================================================
Change logs: 
╔════════╤═══════════════╤════════════════════════╤════════════════════════╗
║ Action │ Lang Key      │ public/locales/en.json │ public/locales/vi.json ║
╟────────┼───────────────┼────────────────────────┼────────────────────────╢
║ Edit   │ title.[/home] │ Home                   │ Trang chủ              ║
╚════════╧═══════════════╧════════════════════════╧════════════════════════╝

======================================================================
? Choose action:  (Use arrow keys)
❯ Edit 
  Remove 
  Add New 
  Exit 
```
